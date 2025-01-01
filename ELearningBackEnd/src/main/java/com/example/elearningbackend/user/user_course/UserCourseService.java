package com.example.elearningbackend.user.user_course;

import com.example.elearningbackend.chapter.QChapter;
import com.example.elearningbackend.course.*;
import com.example.elearningbackend.exception.ResourceNotFoundException;
import com.example.elearningbackend.history.approval.ApprovalStatus;
import com.example.elearningbackend.lecture.Lecture;
import com.example.elearningbackend.lecture.LectureRepository;
import com.example.elearningbackend.lecture.QLecture;
import com.example.elearningbackend.user.User;
import com.example.elearningbackend.util.AuthUtil;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserCourseService {

    private final UserCourseRepository userCourseRepository;
    private final UserCourseMapper userCourseMapper;
    private final CourseMapper courseMapper;
    private final LectureRepository lectureRepository;
    private final UserCourseLectureRepository userCourseLectureRepository;
    private final EntityManager entityManager;

     public List<CourseShortRes> findAllByUserId() {

        User loggedInUser = (User) AuthUtil.getCurrentUser();

        List<UserCourse> userCourses = userCourseRepository.findAllByUserId(loggedInUser.getId());
        List<CourseShortRes> courseShortResList = userCourses.stream()
                .map(userCourse -> courseMapper.toCourseShortRes(userCourse.getCourse()))
                .collect(Collectors.toList());
        return courseShortResList;

    }
    public UserCourseShortRes getByAliasAndUserId(String alias) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();

        UserCourse userCourse = userCourseRepository.findByCourseAliasAndUserId(alias, loggedInUser.getId());
        return userCourseMapper.toUserCourseShortRes(userCourse);
    }

    public Page<CourseRes> getPageForCustomer(Pageable pageable, UserCourseQuery userCourseQuery) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();

        if(loggedInUser.getId() != userCourseQuery.getUserId()) {
            throw new IllegalArgumentException("Invalid user id");
        }
        Page<UserCourse> userCourses = userCourseRepository.findAll(userCourseQuery.toPredicate(), pageable);
        return userCourses.map(userCourse -> courseMapper.toCourseRes(userCourse.getCourse()));
    }

    public UserCourseShortRes updateCurrentLectureId(String alias, Long lectureId) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();

        UserCourse userCourse = userCourseRepository.findByCourseAliasAndUserId(alias, loggedInUser.getId());
        userCourse.setCurrentLectureId(lectureId);
        userCourseRepository.save(userCourse);
        return userCourseMapper.toUserCourseShortRes(userCourse);
    }

    @Transactional
    public UserCourseShortRes completeLecture(String alias, long lectureId) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        UserCourse userCourse = userCourseRepository.findByCourseAliasAndUserId(alias, loggedInUser.getId());
        if(userCourse.getLectures().stream().anyMatch(userCourseLecture -> userCourseLecture.getLectureId() == lectureId)) {
            return userCourseMapper.toUserCourseShortRes(userCourse);
        }
        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(lectureId)
                .orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));

        UserCourseLecture userCourseLecture = UserCourseLecture.builder()
                .userCourse(userCourse)
                .lectureId(lectureId)
                .build();

        userCourse.getLectures().add(userCourseLecture);
        UserCourse savedUserCourse = userCourseRepository.save(userCourse);
        lecture.setCountLearnerComplete(lecture.getCountLearnerComplete() + 1);
        lectureRepository.save(lecture);
        return userCourseMapper.toUserCourseShortRes(savedUserCourse);
    }

    public Long getCurrentLecture(String alias) {

        QLecture qLecture = QLecture.lecture;
        QChapter qChapter = QChapter.chapter;
        QCourse qCourse = QCourse.course;

        JPAQueryFactory queryFactory = new JPAQueryFactory(entityManager);
        Long lecture = queryFactory.select(qLecture.id)
                .from(qLecture)
                .innerJoin(qLecture.chapter, qChapter)
                .innerJoin(qChapter.course, qCourse)
                .where(
                        qCourse.alias.eq(alias),
                        qLecture.approvalStatus.eq(ApprovalStatus.APPROVED.name()),
                        qLecture.isDeleted.isFalse(),
                        qChapter.isDeleted.isFalse(),
                        qCourse.isDeleted.isFalse()

                )
                .orderBy(qChapter.orderNumber.asc(), qLecture.orderNumber.asc())
                .limit(1)
                .fetchOne();
        return lecture;
    }

    @Cacheable(value = "countLearnerComplete", key = "#courseId")
    public long countLearnerComplete(long courseId) {

        QLecture qLecture = QLecture.lecture;
        Predicate predicate = qLecture.chapter.course.id.eq(courseId)
                .and(qLecture.isDeleted.isFalse())
                .and(qLecture.chapter.isDeleted.isFalse())
                .and(qLecture.chapter.course.isDeleted.isFalse())
                .and(qLecture.approvalStatus.eq(ApprovalStatus.APPROVED.name()))
                .and(qLecture.chapter.course.approvalStatus.eq(ApprovalStatus.APPROVED.name()));
        long totalLecture = lectureRepository.count(predicate);
        List<UserCourse> userCourses = userCourseRepository.findAllByCourseId(courseId);
        long totalLearnerComplete;
        if(totalLecture == 0) {
            totalLearnerComplete = 0;
        } else {
            totalLearnerComplete = userCourses.stream()
                    .map(UserCourse::getLectures)
                    .mapToLong(List::size)
                    .filter(size -> size >= totalLecture)
                    .count();
        }
        return totalLearnerComplete;
    }
}
