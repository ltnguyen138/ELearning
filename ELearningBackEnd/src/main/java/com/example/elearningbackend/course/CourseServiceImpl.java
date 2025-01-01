package com.example.elearningbackend.course;

import com.example.elearningbackend.action.ActionReq;
import com.example.elearningbackend.category.Category;
import com.example.elearningbackend.category.CategoryRepository;
import com.example.elearningbackend.category.QCategory;
import com.example.elearningbackend.action.ActionHistory;
import com.example.elearningbackend.history.action.ActionHistoryRepository;
import com.example.elearningbackend.history.action.ActionType;
import com.example.elearningbackend.history.approval.*;
import com.example.elearningbackend.common.EntityNameEnum;
import com.example.elearningbackend.exception.BusinessException;
import com.example.elearningbackend.exception.ResourceNotFoundException;
import com.example.elearningbackend.notification.Notification;
import com.example.elearningbackend.notification.NotificationService;
import com.example.elearningbackend.report.Report;
import com.example.elearningbackend.report.ReportRepository;
import com.example.elearningbackend.report.ReportStatus;
import com.example.elearningbackend.role.UserRole;
import com.example.elearningbackend.user.User;

import com.example.elearningbackend.user.user_course.UserCourse;
import com.example.elearningbackend.user.user_course.UserCourseRepository;
import com.example.elearningbackend.util.AppUtil;
import com.example.elearningbackend.util.AuthUtil;
import com.example.elearningbackend.util.MultipartfileUtil;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService{

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final CourseMapper courseMapper;
    private final ApprovalRepository approvalRepository;
    private final ApprovalMapper approvalMapper;
    private final ReportRepository reportRepository;
    private final ActionHistoryRepository actionHistoryRepository;
    private final NotificationService notificationService;
    private final UserCourseRepository userCourseRepository;
    private final String uploadDir = "uploads/courses";
    private final EntityManager entityManager;
    @Override
    public Page<CourseRes> getManagerPage(Pageable pageable, CourseQuery courseQuery) {
        User loggedInUser = (User) AuthUtil.getCurrentUser();
        if(loggedInUser.getRole().getName().equals(UserRole.INSTRUCTOR.name())){
            courseQuery.setInstructorId(loggedInUser.getId());
        }
        courseQuery.setManager(true);
        return courseRepository.findAll(courseQuery.toPredicate(), pageable).map(courseMapper::toCourseRes);
    }

    @Override
    public Page<CourseRes> getInstructorPage(Pageable pageable, CourseQuery courseQuery) {
        return null;
    }

    @Override
    public Page<CourseRes> getPublicPage(Pageable pageable, CourseQuery courseQuery) {

        courseQuery.setManager(false);
        return courseRepository.findAll(courseQuery.toPredicate(), pageable).map(courseMapper::toCourseRes);
    }

    @Override
    public CourseRes getManagerById(long id) {
        User loggedInUser = (User) AuthUtil.getCurrentUser();
        Course course = courseRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));
        if(loggedInUser.getRole().getName().equals(UserRole.INSTRUCTOR.name())){
            if(!checkOwnerAccess(loggedInUser, course)){
                throw new ResourceNotFoundException("Bạn không có quyền xem khóa học này");
            }
        }
        return courseMapper.toCourseRes(course);
    }

    @Override
    public CourseRes getInstructorById(long id) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        Course course = courseRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));
        if(!checkOwnerAccess(loggedInUser, course)){
            throw new ResourceNotFoundException("Bạn không có quyền xem khóa học này");
        }
        return courseMapper.toCourseRes(course);
    }

    @Override
    public CourseRes getPublicByCourseName(String courseName) {

        QCourse qCourse = QCourse.course;
        Predicate predicate = qCourse.name.eq(courseName)
                .and(qCourse.isDeleted.isFalse())
                .and(qCourse.isActivated.isTrue());
        return courseRepository.findOne(predicate).map(courseMapper::toCourseRes).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));
    }

    @Override
    public CourseRes getPublicByCourseAlias(String courseAlias) {

            QCourse qCourse = QCourse.course;
            Predicate predicate = qCourse.alias.eq(courseAlias)
                    .and(qCourse.isDeleted.isFalse())
                    .and(qCourse.isActivated.isTrue());
            return courseRepository.findOne(predicate).map(courseMapper::toCourseRes).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));
    }

    @Transactional
    @Override

    public CourseRes create(CourseReq courseReq) {
        User loggedInUser = (User) AuthUtil.getCurrentUser();

        if(courseRepository.existsByNameAndIsDeletedIsFalse(courseReq.getName())){
            throw new ResourceNotFoundException("Tên khóa học đã tồn tại");
        }
        Course course = courseMapper.toCourse(courseReq);
        course.setAlias(AppUtil.toSlug(course.getName()));
        if(courseRepository.existsByAliasAndIsDeletedIsFalse(course.getAlias())){
            throw new ResourceNotFoundException("Tên khóa học đã tồn tại");
        }
        if(courseReq.getCategoryId() == -1){
            course.setCategory(createTempCategory(courseReq.getCategoryName()));
        }else {
            QCategory qCategory = QCategory.category;
            Predicate predicate = qCategory.id.eq(courseReq.getCategoryId())
                    .and(qCategory.isDeleted.isFalse())
                    .and(qCategory.isActivated.isTrue());
            course.setCategory(categoryRepository.findOne(predicate).orElseThrow(() -> new ResourceNotFoundException("Chủ đề khóa học không tồn tại")));
        }

        course.setInstructor(loggedInUser);
        course.setApprovalStatus(ApprovalStatus.PENDING.name());
        course.setActivated(true);

        UserCourse userCourse = UserCourse.builder()
                .user(loggedInUser)
                .course(course)
                .currentLectureId(0L)
                .updatedTime(LocalDateTime.now())
                .build();
        userCourseRepository.save(userCourse);
        return courseMapper.toCourseRes(courseRepository.save(course));
    }

    private Category createTempCategory(String name){
        Category category = Category.builder()
                .name(name)
                .alias(AppUtil.toSlug(name))
                .temporary(true)
                .build();
        category.setActivated(false);
        category.setDeleted(false);
        if(categoryRepository.existsByAliasAndIsDeletedIsFalse(category.getAlias())){
            throw new BusinessException("Chủ đề đã tồn tại, vui lòng chọn chủ đề này trong danh sách ở trên");
        }
        if (categoryRepository.existsByNameAndIsDeletedIsFalse(category.getName())) {
            throw new BusinessException("Chủ đề đã tồn tại, vui lòng chọn chủ đề này trong danh sách ở trên");
        }
        return categoryRepository.save(category);
    }

    private Category updateTempCategory(long categoryId, String name){
        Category category = categoryRepository.findByIdAndIsDeletedIsFalse(categoryId).orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if(categoryRepository.existsByAliasAndIsDeletedIsFalse(AppUtil.toSlug(name))){
            throw new BusinessException("Chủ đề đã tồn tại, vui lòng chọn chủ đề này trong danh sách ở trên");
        }
        if (categoryRepository.existsByNameAndIsDeletedIsFalse(name)) {
            throw new BusinessException("Chủ đề đã tồn tại, vui lòng chọn chủ đề này trong danh sách ở trên");
        }
        category.setName(name);
        category.setAlias(AppUtil.toSlug(name));
        category.setTemporary(true);
        return categoryRepository.save(category);

    }

    @Transactional
    @Override
    @CacheEvict(value = "publicCourses", allEntries = true)
    public CourseRes update(long id, CourseReq courseReq) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();

        Course course = courseRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));
        if(!course.getName().equals(courseReq.getName())){

            if(courseRepository.existsByNameAndIsDeletedIsFalse(courseReq.getName())){
                throw new BusinessException("Tên khóa học đã tồn tại");
            }
            String slug = AppUtil.toSlug(courseReq.getName());

            if(courseRepository.existsByAliasAndIsDeletedIsFalse(slug)){
                throw new BusinessException("Tên khóa học đã tồn tại");
            }
            course.setAlias(slug);
        }
        if(loggedInUser.getId() != course.getInstructor().getId() && loggedInUser.getRole().getName().equals(UserRole.INSTRUCTOR.name())){
            throw new BusinessException("Bạn không có quyền chỉnh sửa khóa học này");
        }
        courseMapper.updateCourse(courseReq, course);
        if(courseReq.getCategoryId() == -1){
            course.setCategory(createTempCategory(courseReq.getCategoryName()));
        }else if(courseReq.getCategoryId() != course.getCategory().getId()){
            Category oldCategory = course.getCategory();
            QCategory qCategory = QCategory.category;
            Predicate predicate = qCategory.id.eq(courseReq.getCategoryId())
                    .and(qCategory.isDeleted.isFalse())
                    .and(qCategory.isActivated.isTrue());
            course.setCategory(categoryRepository.findOne(predicate).orElseThrow(() -> new ResourceNotFoundException("Chủ đề khóa học không tồn tại")));
            if(oldCategory.getTemporary()){
                categoryRepository.delete(oldCategory);
            }

        } else if(course.getCategory().getTemporary() != null && course.getCategory().getTemporary()  && !courseReq.getCategoryName().equals(course.getCategory().getName())){
            updateTempCategory(course.getCategory().getId(), courseReq.getCategoryName());
        }
        course.setActivated(true);
        return courseMapper.toCourseRes(courseRepository.save(course));
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicCourses", allEntries = true)
    public void deleteByOwner(long id) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        Course course = courseRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));
        if(loggedInUser.getId() != course.getInstructor().getId()){
            throw new ResourceNotFoundException("Bạn không có quyền xóa khóa học này");
        }
        if(course.getApprovalStatus().equals(ApprovalStatus.APPROVED.name())){
            throw new ResourceNotFoundException("Bạn không thể xóa khóa học đã được duyệt");
        }
        course.setDeleted(true);
        courseRepository.save(course);
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicCourses", allEntries = true)
    public CourseRes uploadImage(long courseId, MultipartFile image) throws IOException {
        User loggedInUser = (User) AuthUtil.getCurrentUser();
        Course course = courseRepository.findByIdAndIsDeletedIsFalse(courseId).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        if(loggedInUser.getId() != course.getInstructor().getId()){
            throw new ResourceNotFoundException("Bạn không có quyền thay đổi ảnh khóa học này");
        }
        String oldImage = course.getImage();
        MultipartfileUtil.checkImage(image);
        String uniqueFileName = MultipartfileUtil.saveFile(image, uploadDir);
        if(oldImage != null){
            MultipartfileUtil.deleteFile(oldImage, uploadDir);
        }
        course.setImage(uniqueFileName);

        return courseMapper.toCourseRes(courseRepository.save(course));
    }

    @Override
    public UrlResource getImage(String imageName) throws IOException{

        return MultipartfileUtil.loadImageFile(imageName, uploadDir);
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicCourses", allEntries = true)
    public CourseRes toggleActivation(long id, ActionReq actionReq) {

        Course course = courseRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));
        course.setActivated(!course.isActivated());

        ActionHistory actionHistory = ActionHistory.builder()
                .type(course.isActivated() ? ActionType.UNBLOCK : ActionType.BLOCK)
                .entityName(EntityNameEnum.COURSE)
                .entityId(course.getId())
                .timestamp(LocalDateTime.now())
                .admin((User) AuthUtil.getCurrentUser())
                .reason(actionReq.getReason())
                .build();
        actionHistoryRepository.save(actionHistory);

        return courseMapper.toCourseRes(courseRepository.save(course));
    }

    @Transactional
    @Override
    public CourseRes toggleModeration(long id) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        Course course = courseRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));
        checkOwnerAccess(loggedInUser, course);
        course.setModerationRequested(!course.isModerationRequested());
        return courseMapper.toCourseRes(courseRepository.save(course));
    }

    @Override
    @Transactional
    @CacheEvict(value = "publicCourses", allEntries = true)
    public CourseRes approve(long courseId, ApprovalReq approvalReq) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        Course course = courseRepository.findByIdAndIsDeletedIsFalse(courseId).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));

        if(course.getCategory().getTemporary() != null && course.getCategory().getTemporary()){
            throw new BusinessException("Không thể duyệt khóa học với chủ đề tạm thời");
        }
        course.setModerationRequested(false);
        course.setApprovalStatus(approvalReq.getStatus().name());
        courseRepository.save(course);

        ActionHistory actionHistory = ActionHistory.builder()
                .type(approvalReq.getStatus())
                .entityName(EntityNameEnum.COURSE)
                .entityId(course.getId())
                .timestamp(LocalDateTime.now())
                .admin(loggedInUser)
                .reason(approvalReq.getComment())
                .build();
        actionHistory = actionHistoryRepository.save(actionHistory);

        Notification notification = Notification.builder()
                .user(course.getInstructor())
                .title(approvalReq.getStatus().equals(ActionType.APPROVED) ? "Khóa học của bạn đã được duyệt" : "Khóa học của bạn bị từ chối")
                .timestamp(LocalDateTime.now())
                .roleNotification(UserRole.INSTRUCTOR.name())
                .course(course)
                .read(false)
                .build();
        notificationService.saveNotification(notification);
        notificationService.sendNotification(notification);
        return courseMapper.toCourseRes(course);
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicCourses", allEntries = true)
    public void delete(long id, ActionReq actionReq) {

        Course course = courseRepository.findByIdAndIsDeletedIsFalse(id).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));
        course.setDeleted(true);
        courseRepository.save(course);

        ActionHistory actionHistory = ActionHistory.builder()
                .type(ActionType.DELETE)
                .entityName(EntityNameEnum.COURSE)
                .entityId(course.getId())
                .timestamp(LocalDateTime.now())
                .admin((User) AuthUtil.getCurrentUser())
                .reason(actionReq.getReason())
                .build();
        actionHistoryRepository.save(actionHistory);
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicCourses", allEntries = true)
    public void deleteByReport(long reportId, ActionReq actionReq) {

        Report report = reportRepository.findById(reportId).orElseThrow(() -> new ResourceNotFoundException("Báo cáo vi phạm không tồn tại"));
        if(!report.getEntityType().equals(EntityNameEnum.COURSE)){
            throw new ResourceNotFoundException("Báo cáo không liên quan đến khóa học");
        }
        Course course = courseRepository.findByIdAndIsDeletedIsFalse(report.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));
        course.setDeleted(true);
        courseRepository.save(course);

        ActionHistory actionHistory = ActionHistory.builder()
                .type(ActionType.DELETE)
                .entityName(EntityNameEnum.COURSE)
                .entityId(course.getId())
                .timestamp(LocalDateTime.now())
                .admin((User) AuthUtil.getCurrentUser())
                .reason(actionReq.getReason())
                .build();
        report.setStatus(ReportStatus.RESOLVED);
        report.setActionHistory(actionHistory);
        reportRepository.save(report);
        actionHistoryRepository.save(actionHistory);
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicCourses", allEntries = true)
    public CourseRes block(long reportId, ActionReq actionReq) {

        Report report = reportRepository.findById(reportId).orElseThrow(() -> new ResourceNotFoundException("Báo cáo vi phạm không tồn tại"));
        if(!report.getEntityType().equals(EntityNameEnum.COURSE)){
            throw new ResourceNotFoundException("Báo cáo vi phạm không liên quan đến khóa học");
        }
        Course course = courseRepository.findByIdAndIsDeletedIsFalse(report.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));
        course.setActivated(false);
        courseRepository.save(course);

        ActionHistory actionHistory = ActionHistory.builder()
                .type(ActionType.BLOCK)
                .entityName(EntityNameEnum.COURSE)
                .entityId(course.getId())
                .timestamp(LocalDateTime.now())
                .admin((User) AuthUtil.getCurrentUser())
                .reason(actionReq.getReason())
                .build();
        report.setStatus(ReportStatus.RESOLVED);
        report.setActionHistory(actionHistory);
        reportRepository.save(report);
        actionHistoryRepository.save(actionHistory);
        return courseMapper.toCourseRes(course);
    }

    @Override
    @CacheEvict(value = "publicCourses", allEntries = true)
    public CourseRes rejectByReport(long reportId, ActionReq actionReq) {

        Report report = reportRepository.findById(reportId).orElseThrow(() -> new ResourceNotFoundException("Báo cáo vi phạm không tồn tại"));
        if(!report.getEntityType().equals(EntityNameEnum.COURSE)){
            throw new ResourceNotFoundException("Báo cáo vi phạm không liên quan đến khóa học");
        }
        Course course = courseRepository.findByIdAndIsDeletedIsFalse(report.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại"));
        course.setModerationRequested(false);
        course.setApprovalStatus(ApprovalStatus.REJECTED.name());
        courseRepository.save(course);
        ActionHistory actionHistory = ActionHistory.builder()
                .type(ActionType.REJECTED)
                .entityName(EntityNameEnum.COURSE)
                .entityId(course.getId())
                .timestamp(LocalDateTime.now())
                .admin((User) AuthUtil.getCurrentUser())
                .reason(actionReq.getReason())
                .build();
        report.setStatus(ReportStatus.RESOLVED);
        report.setActionHistory(actionHistory);
        reportRepository.save(report);
        actionHistoryRepository.save(actionHistory);
        return courseMapper.toCourseRes(course);
    }

    @Override
    public CourseRes getCourseByIdIgnoreDeleted(long id) {

        return courseMapper.toCourseRes(courseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Khóa học không tồn tại")));
    }

    @Override
    public long countPuschasedCourses(CourseQuery courseQuery) {

        QCourse qCourse = QCourse.course;
        JPAQueryFactory queryFactory = new JPAQueryFactory(entityManager);
        Integer countPurchasedCourses = queryFactory.select(qCourse.purchasedCount.sum())
                .from(qCourse)
                .where(courseQuery.toPredicate())
                .fetchOne();

        return countPurchasedCourses == null ? 0 : countPurchasedCourses;
    }


    private boolean checkOwnerAccess(User loggedInUser, Course course){
        return loggedInUser.getId() == course.getInstructor().getId();
    }
}
