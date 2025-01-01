package com.example.elearningbackend.review;

import com.example.elearningbackend.action.ActionReq;
import com.example.elearningbackend.common.EntityNameEnum;
import com.example.elearningbackend.course.Course;
import com.example.elearningbackend.course.CourseRepository;
import com.example.elearningbackend.exception.ResourceNotFoundException;
import com.example.elearningbackend.action.ActionHistory;
import com.example.elearningbackend.history.action.ActionHistoryRepository;
import com.example.elearningbackend.history.action.ActionType;
import com.example.elearningbackend.report.Report;
import com.example.elearningbackend.report.ReportRepository;
import com.example.elearningbackend.report.ReportStatus;
import com.example.elearningbackend.user.User;
import com.example.elearningbackend.user.UserRepository;
import com.example.elearningbackend.user.user_course.UserCourseRepository;
import com.example.elearningbackend.util.AuthUtil;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{

    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final UserCourseRepository userCourseRepository;
    private final ReportRepository reportRepository;
    private final ActionHistoryRepository actionHistoryRepository;


    @Override
    public Page<ReviewRes> getManagerPage(Pageable pageable, ReviewQuery reviewQuery) {

        reviewQuery.setManager(true);
        return reviewRepository.findAll(reviewQuery.toPredicate(), pageable).map(reviewMapper::toReviewRes);
    }

    @Override
    public Page<ReviewRes> getPublicPage(Pageable pageable, ReviewQuery reviewQuery, long courseId) {

        reviewQuery.setManager(false);
        QReview qReview = QReview.review;
        Predicate predicate = qReview.course.id.eq(courseId).and(reviewQuery.toPredicate());
        return reviewRepository.findAll(predicate, pageable).map(reviewMapper::toReviewRes);
    }

    @Override
    public ReviewRes getByAccountAndCourse(long courseId) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        QReview qReview = QReview.review;
        Predicate predicate = qReview.user.id.eq(loggedInUser.getId())
                .and(qReview.course.id.eq(courseId))
                .and(qReview.isDeleted.isFalse());

        return reviewRepository.findOne(predicate).map(reviewMapper::toReviewRes)
                .orElse(null);
    }

    @Transactional
    @Override
    public ReviewRes create(ReviewReq reviewReq) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        User user = userRepository.findById(loggedInUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Course course = courseRepository.findById(reviewReq.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        if(!userCourseRepository.existsByUserIdAndCourseId(user.getId(), course.getId())){
            throw new ResourceNotFoundException("User is not enrolled in this course");
        }
        QReview qReview = QReview.review;
        Predicate predicate = qReview.user.id.eq(user.getId())
                .and(qReview.course.id.eq(course.getId()))
                .and(qReview.isDeleted.isFalse());
        if(reviewRepository.findOne(predicate).isPresent()){
            throw new ResourceNotFoundException("Review already exists");
        }
        Review review = reviewMapper.toReview(reviewReq);
        review.setUser(user);
        review.setCourse(course);
        course.setAverageRating((course.getAverageRating() * course.getRatingCount() + review.getRating()) / (course.getRatingCount() + 1));
        course.setRatingCount(course.getRatingCount() + 1);
        review.setActivated(true);
        courseRepository.save(course);
        return reviewMapper.toReviewRes(reviewRepository.save(review));
    }

    @Transactional
    @Override
    public ReviewRes update(long id, ReviewReq reviewReq) {

        Review review = findAndVerifyReviewOwnership(id);
//        if(review.getUpdatedTime().isAfter(LocalDateTime.now().minusDays(1))){
//            throw new ResourceNotFoundException("Bạn chỉ có thể chỉnh sửa đánh giá 1 lần mỗi ngày");
//        }
        if(reviewReq.getRating() != review.getRating()){
            Course course = review.getCourse();
            course.setAverageRating((course.getAverageRating() * course.getRatingCount() - review.getRating() + reviewReq.getRating()) / course.getRatingCount());
            courseRepository.save(course);
        }
        reviewMapper.updateReview(reviewReq, review);
        review.setActivated(true);
        return reviewMapper.toReviewRes(reviewRepository.save(review));
    }

    @Transactional
    @Override
    public void deleteByOwner(long id) {

        Review review = findAndVerifyReviewOwnership(id);
        review.setDeleted(true);
        Course course = review.getCourse();
        if(course.getRatingCount() == 1){
            course.setAverageRating(0);
        }else {
            course.setAverageRating((course.getAverageRating() * course.getRatingCount() - review.getRating()) / (course.getRatingCount() - 1));
        }        course.setRatingCount(course.getRatingCount() - 1);
        courseRepository.save(course);
        reviewRepository.save(review);
    }

    @Transactional
    @Override
    public ReviewRes toggleActivation(long id) {

        Review review = reviewRepository.findByIdAndIsDeletedIsFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        review.setActivated(!review.isActivated());
        return reviewMapper.toReviewRes(reviewRepository.save(review));
    }

    @Transactional
    @Override
    public void delete(long id, ActionReq actionReq) {

        Review review = reviewRepository.findByIdAndIsDeletedIsFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setDeleted(true);
        reviewRepository.save(review);
        Course course = review.getCourse();
        if(course.getRatingCount() == 1){
            course.setAverageRating(0);
        }else {
            course.setAverageRating((course.getAverageRating() * course.getRatingCount() - review.getRating()) / (course.getRatingCount() - 1));
        }
        course.setRatingCount(course.getRatingCount() - 1);
        courseRepository.save(course);
        ActionHistory actionHistory = ActionHistory.builder()
                .type(ActionType.DELETE)
                .entityName(EntityNameEnum.REVIEW)
                .entityId(id)
                .admin((User) AuthUtil.getCurrentUser())
                .timestamp(LocalDateTime.now())
                .reason(actionReq.getReason())
                .build();
        actionHistoryRepository.save(actionHistory);
    }

    @Transactional
    @Override
    public void deleteByReport(long reportId, ActionReq actionReq) {

        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        if(!report.getEntityType().equals(EntityNameEnum.REVIEW)){
            throw new ResourceNotFoundException("Report is not for review");
        }
        Review review = reviewRepository.findByIdAndIsDeletedIsFalse(report.getEntityId())
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setDeleted(true);
        reviewRepository.save(review);

        Course course = review.getCourse();
        if(course.getRatingCount() == 1){
            course.setAverageRating(0);
        }else {
            course.setAverageRating((course.getAverageRating() * course.getRatingCount() - review.getRating()) / (course.getRatingCount() - 1));
        }        course.setRatingCount(course.getRatingCount() - 1);
        courseRepository.save(course);
        ActionHistory actionHistory = ActionHistory.builder()
                .type(ActionType.DELETE)
                .entityName(EntityNameEnum.REVIEW)
                .entityId(review.getId())
                .admin((User) AuthUtil.getCurrentUser())
                .timestamp(LocalDateTime.now())
                .reason(actionReq.getReason())
                .build();
        report.setStatus(ReportStatus.RESOLVED);
        report.setActionHistory(actionHistory);
        reportRepository.save(report);
        actionHistoryRepository.save(actionHistory);
    }

    @Override
    public ReviewRes getReviewByIdIgnoreDeleted(long id) {

        return reviewRepository.findById(id)
                .map(reviewMapper::toReviewRes)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
    }

    private Review findAndVerifyReviewOwnership(long reviewId) {
        User loggedInUser = (User) AuthUtil.getCurrentUser();
        QReview qReview = QReview.review;
        Predicate predicate = qReview.id.eq(reviewId)
                .and(qReview.user.id.eq(loggedInUser.getId()))
                .and(qReview.isDeleted.isFalse());
        return reviewRepository.findOne(predicate)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
    }
}
