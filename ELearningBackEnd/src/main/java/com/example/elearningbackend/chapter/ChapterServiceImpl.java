package com.example.elearningbackend.chapter;

import com.example.elearningbackend.course.Course;
import com.example.elearningbackend.course.CourseRepository;
import com.example.elearningbackend.exception.ResourceNotFoundException;
import com.example.elearningbackend.history.approval.ApprovalStatus;
import com.example.elearningbackend.lecture.Lecture;
import com.example.elearningbackend.lecture.LectureMapper;
import com.example.elearningbackend.lecture.LectureReq;
import com.example.elearningbackend.role.UserRole;
import com.example.elearningbackend.user.User;
import com.example.elearningbackend.util.AuthUtil;
import com.example.elearningbackend.util.MultipartfileUtil;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Component
@RequiredArgsConstructor
public class ChapterServiceImpl implements ChapterService{

    private final ChapterRepository chapterRepository;
    private final CourseRepository courseRepository;
    private final ChapterMapper chapterMapper;
    private final LectureMapper lectureMapper;

    @Override
    @Cacheable(
            value = "publicChapters",
            key = "'page=' + #pageable.pageNumber + '-size=' + #pageable.pageSize + '-sort=' + #pageable.sort.toString() + '-query=' + #chapterQuery.toString()"
    )
    public Page<ChapterRes> getPublicPage(Pageable pageable, ChapterQuery chapterQuery) {

        chapterQuery.setManager(false);
        return chapterRepository.findAll(chapterQuery.toPredicate(), pageable).map(chapterMapper :: toChapterRes);
    }

    @Override
    public Page<ChapterRes> getManagerPage(Pageable pageable, ChapterQuery chapterQuery) {

        chapterQuery.setManager(true);
        return chapterRepository.findAll(chapterQuery.toPredicate(), pageable).map(chapterMapper :: toChapterRes);
    }

    @Override
    public ChapterRes getManagerById(long id) {

        Chapter chapter = chapterRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResourceNotFoundException("Chương không tồn tại"));
        User loggedInUser = (User) AuthUtil.getCurrentUser();
        if(loggedInUser.getRole().getName().equals(UserRole.INSTRUCTOR.name())){
            if(chapter.getCourse().getInstructor().getId() != loggedInUser.getId()){
                throw new ResourceNotFoundException("Bạn không có quyền truy cập chương này");
            }
        }
        return chapterRepository.findByIdAndIsDeletedIsFalse(id).map(chapterMapper :: toChapterRes).orElseThrow(() -> new ResourceNotFoundException("Chương không tồn tại"));
    }

    @Override
    @Cacheable(
            value = "publicChapters",
            key = "'id=' + #id"
    )
    public ChapterRes getPublicById(long id) {

        QChapter qChapter = QChapter.chapter;
        Predicate predicate = qChapter.id.eq(id)
                .and(qChapter.isDeleted.isFalse())
                .and(qChapter.course.isDeleted.isFalse())
                .and(qChapter.course.isActivated.isTrue());
        return chapterRepository.findOne(predicate).map(chapterMapper :: toChapterRes).orElseThrow(() -> new ResourceNotFoundException("Chương không tồn tại"));
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicChapters", allEntries = true)
    public ChapterRes create(ChapterReq chapterReq) {

        User LoggedInUser = (User) AuthUtil.getCurrentUser();
        Course course = courseRepository.findByIdAndIsDeletedIsFalse(chapterReq.getCourseId()).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));
        if(course.getInstructor().getId() != LoggedInUser.getId()){
            throw new ResourceNotFoundException("Bạn không có quyền tạo chương cho khóa học này");
        }

        Chapter chapter = chapterMapper.toChapter(chapterReq);
        int orderNumber = chapterRepository.countByCourseIdAndIsDeletedIsFalse(chapterReq.getCourseId());
        chapter.setOrderNumber(orderNumber);
        chapter.setCourse(course);
        chapter.setActivated(true);
        return chapterMapper.toChapterRes(chapterRepository.save(chapter));
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicChapters", allEntries = true)
    public ChapterRes update(long id, ChapterReq chapterReq) {

        User LoggedInUser = (User) AuthUtil.getCurrentUser();
        Course course = courseRepository.findByIdAndIsDeletedIsFalse(chapterReq.getCourseId()).orElseThrow(() -> new ResourceNotFoundException("Chương không tồn tại"));
        if(course.getInstructor().getId() != LoggedInUser.getId()){
            throw new ResourceNotFoundException("Bạn không có quyền cập nhật chương cho khóa học này");
        }
        Chapter chapter = chapterRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResourceNotFoundException("Chương không tồn tại"));
        chapterMapper.updateChapter(chapterReq, chapter);
        chapter.setActivated(true);
        return chapterMapper.toChapterRes(chapterRepository.save(chapter));
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicChapters", allEntries = true)
    public void delete(long id) {

        User LoggedInUser = (User) AuthUtil.getCurrentUser();
        Chapter chapter = chapterRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResourceNotFoundException("Chương không tồn tại"));
        if(chapter.getCourse().getInstructor().getId() != LoggedInUser.getId()){
            throw new ResourceNotFoundException("Bạn không có quyền xóa chương cho khóa học này");
        }
        for(Lecture lecture : chapter.getLectures()){
            if(lecture.getApprovalStatus().equals(ApprovalStatus.APPROVED.name())){
                throw new ResourceNotFoundException("Không xóa chương chứa bài giảng đã được duyệt");
            }
        }
        chapter.setDeleted(true);
        chapterRepository.save(chapter);
    }

    @Override
    @Transactional
    @CacheEvict(value = "publicChapters", allEntries = true)
    public void swapOrder(long courseId, long chapterId1, long chapterId2) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        Course course = courseRepository.findByIdAndIsDeletedIsFalse(courseId).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));
        if(course.getInstructor().getId() != loggedInUser.getId()){
            throw new ResourceNotFoundException("Bạn không có quyền sắp xếp chương cho khóa học này");
        }
        Chapter chapter1 = chapterRepository.findByIdAndIsDeletedIsFalse(chapterId1).orElseThrow(() -> new ResourceNotFoundException("Chương không tồn tại"));
        Chapter chapter2 = chapterRepository.findByIdAndIsDeletedIsFalse(chapterId2).orElseThrow(() -> new ResourceNotFoundException("Chương không tồn tại"));
        if(chapter1.getCourse().getId() != courseId || chapter2.getCourse().getId() != courseId){
            throw new ResourceNotFoundException("Chương không thuộc khóa học này");
        }

        int temp = chapter1.getOrderNumber();
        chapter1.setOrderNumber(chapter2.getOrderNumber());
        chapter2.setOrderNumber(temp);
        chapterRepository.save(chapter1);
        chapterRepository.save(chapter2);

    }

    @Override
    @Transactional
    @CacheEvict(value = "publicChapters", allEntries = true)
    public List<ChapterRes> createChaptersAndLectures(List<ChapterReq> chapterReqs) {
        if(chapterReqs.size() == 0){
            throw new ResourceNotFoundException("Danh sách chương trống");
        }
        User LoggedInUser = (User) AuthUtil.getCurrentUser();
        Course course = courseRepository.findByIdAndIsDeletedIsFalse(chapterReqs.get(0).getCourseId()).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));
        if(course.getInstructor().getId() != LoggedInUser.getId()){
            throw new ResourceNotFoundException("Bạn không có quyền tạo chương cho khóa học này");
        }
        int chapterOrder = chapterRepository.countByCourseIdAndIsDeletedIsFalse(chapterReqs.get(0).getCourseId());

        List<Chapter> chapters = new ArrayList<>();
        for(ChapterReq chapterReq : chapterReqs){
            int lectureOrder = 0;
            Chapter chapter = chapterMapper.toChapter(chapterReq);
            chapter.setOrderNumber(chapterOrder);
            chapterOrder++;
            chapter.setActivated(true);
            chapter.setCourse(course);
            Set<Lecture> lectures = new HashSet<>();
            for (LectureReq lectureReq : chapterReq.getLectures()){
                Lecture lecture = lectureMapper.toLecture(lectureReq);
                lecture.setOrderNumber(lectureOrder);
                lecture.setChapter(chapter);
                lecture.setActivated(false);
                lecture.setApprovalStatus(ApprovalStatus.PENDING.name());
                lecture.setActivated(true);
                lectureOrder++;
                lectures.add(lecture);
            }
            chapter.setLectures(lectures);
            chapters.add(chapter);
        }
        return chapterRepository.saveAll(chapters).stream().map(chapterMapper :: toChapterRes).toList();
    }

    @Override
    public Resource getFileCreateChaptersAndLecturesTemplate() throws MalformedURLException {

        return MultipartfileUtil.getFileCreateChaptersAndLecturesTemplate();
    }

}
