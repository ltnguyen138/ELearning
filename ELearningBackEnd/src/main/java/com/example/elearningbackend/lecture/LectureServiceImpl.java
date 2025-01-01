package com.example.elearningbackend.lecture;

import com.example.elearningbackend.action.ActionReq;
import com.example.elearningbackend.aws.S3Service;
import com.example.elearningbackend.chapter.Chapter;
import com.example.elearningbackend.chapter.ChapterRepository;
import com.example.elearningbackend.common.EntityNameEnum;
import com.example.elearningbackend.exception.BusinessException;
import com.example.elearningbackend.exception.ResourceNotFoundException;
import com.example.elearningbackend.action.ActionHistory;
import com.example.elearningbackend.history.action.ActionHistoryRepository;
import com.example.elearningbackend.history.action.ActionType;
import com.example.elearningbackend.history.approval.*;
import com.example.elearningbackend.notification.Notification;
import com.example.elearningbackend.notification.NotificationService;
import com.example.elearningbackend.report.Report;
import com.example.elearningbackend.report.ReportRepository;
import com.example.elearningbackend.report.ReportStatus;
import com.example.elearningbackend.role.UserRole;
import com.example.elearningbackend.user.User;
import com.example.elearningbackend.user.user_course.UserCourseRepository;

import com.example.elearningbackend.util.AuthUtil;
import com.example.elearningbackend.util.MultipartfileUtil;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.StreamSupport;

@Component
@RequiredArgsConstructor
public class LectureServiceImpl implements LectureService{

    private final LectureRepository lectureRepository;
    private final LectureMapper lectureMapper;
    private final ChapterRepository chapterRepository;
    private final UserCourseRepository userCourseRepository;
    private final ApprovalRepository approvalRepository;
    private final ApprovalMapper approvalMapper;
    private final ReportRepository reportRepository;
    private final ActionHistoryRepository actionHistoryRepository;
    private final NotificationService notificationService;
    private final S3Service s3Service;

    private final String uploadDir = "uploads/lectures";
    private final String awsUploadDir = "lectures";

    @Override
    @Cacheable(
            value = "publicLectures",
            key = "'page=' + #pageable.pageNumber + '-size=' + #pageable.pageSize + '-sort=' + #pageable.sort.toString() + '-query=' + #lectureQuery.toString()"
    )
    public Page<LectureRes> getPublicPage(Pageable pageable, LectureQuery lectureQuery) {

        lectureQuery.setManager(false);
        return lectureRepository.findAll(lectureQuery.toPredicate(), pageable).map(lectureMapper :: toLectureRes);
    }

    @Override
    public Page<LectureRes> getManagerPage(Pageable pageable, LectureQuery lectureQuery) {

        lectureQuery.setManager(true);
        return lectureRepository.findAll(lectureQuery.toPredicate(), pageable).map(lectureMapper :: toLectureRes);
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicLectures", allEntries = true)
    public LectureRes create(LectureReq lectureReq) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        Chapter chapter = chapterRepository.findByIdAndIsDeletedIsFalse(lectureReq.getChapterId()).orElseThrow(() ->
                new ResourceNotFoundException("Chapter not found"));

        if(chapter.getCourse().getInstructor().getId() !=  loggedInUser.getId()){
            throw new BusinessException("You are not authorized to create lecture for this chapter");
        }
        int orderNumber = lectureRepository.countByChapterIdAndIsDeletedIsFalse(lectureReq.getChapterId());
        Lecture lecture = lectureMapper.toLecture(lectureReq);
        lecture.setOrderNumber(orderNumber);
        lecture.setChapter(chapter);
        lecture.setActivated(false);
        lecture.setApprovalStatus(ApprovalStatus.PENDING.name());
        lecture.setActivated(true);
        lecture.setCountLearnerComplete(0L);
        return lectureMapper.toLectureRes(lectureRepository.save(lecture));
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicLectures", allEntries = true)
    public LectureRes update(long id, LectureReq lectureReq) {

        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(id).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
        validateLectureOwnership(lecture);

        lectureMapper.updateLecture(lectureReq, lecture);
        lecture.setApprovalStatus(ApprovalStatus.PENDING.name());
        lecture.setActivated(true);
        return lectureMapper.toLectureRes(lectureRepository.save(lecture));
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicLectures", allEntries = true)
    public void deleteByOwner(long id) {

        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(id).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
        validateLectureOwnership(lecture);
        if(lecture.getApprovalStatus().equals(ApprovalStatus.APPROVED.name())){
            throw new BusinessException("Không thể xóa bài giảng đã được duyệt");
        }
        lecture.setDeleted(true);
        lectureRepository.save(lecture);
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicLectures", allEntries = true)
    public ActionHistory delete(long id, ActionReq actionReq) {

        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(id).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));

        lecture.setDeleted(true);
        lectureRepository.save(lecture);

        ActionHistory actionHistory = ActionHistory.builder()
                .type(ActionType.DELETE)
                .entityName(EntityNameEnum.LECTURE)
                .entityId(lecture.getId())
                .admin((User) AuthUtil.getCurrentUser())
                .timestamp(LocalDateTime.now())
                .reason(actionReq.getReason())
                .build();
        return actionHistoryRepository.save(actionHistory);
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicLectures", allEntries = true)
    public void deleteByReport(long reporterId, ActionReq actionReq) {

        Report report = reportRepository.findById(reporterId).orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        if(!report.getEntityType().equals(EntityNameEnum.LECTURE)){
            throw new BusinessException("Report type mismatch");
        }
        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(report.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
        lecture.setDeleted(true);
        lectureRepository.save(lecture);

        ActionHistory actionHistory = ActionHistory.builder()
                .type(ActionType.DELETE)
                .entityName(EntityNameEnum.LECTURE)
                .entityId(lecture.getId())
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
    public LectureRes getManagerById(long id) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(id).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
//        if(!lecture.isPreview()){
//            if(!accessService.checkUserAccess(loggedInUser, lecture)){
//                throw new ResourceNotFoundException("Access denied");
//            }
//        }
        if(loggedInUser.getRole().getName().equals(UserRole.INSTRUCTOR.name())){
            validateLectureOwnership(lecture);
        }
        return lectureMapper.toLectureRes(lecture);
    }

    @Override
    @Cacheable(
            value = "publicLectures",
            key = "'id=' + #id"
    )
    public LectureRes getPublicById(long id) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        QLecture qLecture = QLecture.lecture;
        Predicate predicate = qLecture.id.eq(id)
                .and(qLecture.isDeleted.isFalse())
                .and(qLecture.chapter.course.isDeleted.isFalse())
                .and(qLecture.chapter.course.isActivated.isTrue())
                .and(qLecture.chapter.isDeleted.isFalse())
                .and(qLecture.chapter.isActivated.isTrue())
                .and(qLecture.chapter.course.instructor.isDeleted.isFalse())
                .and(qLecture.chapter.course.instructor.isActivated.isTrue())
                .and(qLecture.chapter.course.isDeleted.isFalse())
                .and(qLecture.chapter.course.isActivated.isTrue());
        Lecture lecture = lectureRepository.findOne(predicate).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));

        return lectureMapper.toLectureRes(lecture);
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicLectures", allEntries = true)
    public LectureRes toggleActivation(long id, ActionReq actionReq) {

        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(id).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));

        lecture.setActivated(!lecture.isActivated());

        ActionHistory actionHistory = ActionHistory.builder()
                .entityName(EntityNameEnum.LECTURE)
                .entityId(lecture.getId())
                .admin((User) AuthUtil.getCurrentUser())
                .timestamp(LocalDateTime.now())
                .reason(actionReq.getReason())
                .build();
        if(lecture.isActivated()){
            actionHistory.setType(ActionType.UNBLOCK);
        }else{
            actionHistory.setType(ActionType.BLOCK);
        }
        actionHistoryRepository.save(actionHistory);
        return lectureMapper.toLectureRes(lectureRepository.save(lecture));
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicLectures", allEntries = true)
    public void blockByReport(long reporterId, ActionReq actionReq) {

        Report report = reportRepository.findById(reporterId).orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        if(!report.getEntityType().equals(EntityNameEnum.LECTURE)){
            throw new BusinessException("Report type mismatch");
        }
        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(report.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
        lecture.setActivated(false);

        report.setStatus(ReportStatus.RESOLVED);

        ActionHistory actionHistory = ActionHistory.builder()
                .type(ActionType.BLOCK)
                .entityName(EntityNameEnum.LECTURE)
                .entityId(lecture.getId())
                .admin((User) AuthUtil.getCurrentUser())
                .timestamp(LocalDateTime.now())
                .reason(actionReq.getReason())
                .build();

        report.setActionHistory(actionHistory);
        actionHistoryRepository.save(actionHistory);
        reportRepository.save(report);
        lectureRepository.save(lecture);
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicLectures", allEntries = true)
    public LectureRes uploadVideo(long lectureId, MultipartFile video) throws IOException {

        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(lectureId).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
        validateLectureOwnership(lecture);

        MultipartfileUtil.checkVideo(video);
        String uniqueFileName = MultipartfileUtil.saveFile(video, uploadDir);
        if(lecture.getVideoUrl() != null){
          MultipartfileUtil.deleteFile(lecture.getVideoUrl(), uploadDir);

        }

        lecture.setVideoUrl(uniqueFileName);
        lecture.setApprovalStatus(ApprovalStatus.PENDING.name());
        return lectureMapper.toLectureRes(lectureRepository.save(lecture));
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicLectures", allEntries = true)
    public LectureRes uploadDocument(long lectureId, MultipartFile document) throws IOException {


        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(lectureId).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
        validateLectureOwnership(lecture);

        MultipartfileUtil.checkDocumentFile(document);
        String uniqueFileName = MultipartfileUtil.saveFile(document, uploadDir);
        if(lecture.getResourceUrl() != null){
            MultipartfileUtil.deleteFile(lecture.getResourceUrl(), uploadDir);
        }
        lecture.setResourceUrl(uniqueFileName);
        lecture.setApprovalStatus(ApprovalStatus.PENDING.name());
        return lectureMapper.toLectureRes(lectureRepository.save(lecture));
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicLectures", allEntries = true)
    public void deleteVideo(long lectureId) throws IOException {

        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(lectureId).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
        validateLectureOwnership(lecture);

        MultipartfileUtil.deleteFile(lecture.getVideoUrl(), uploadDir);

        lecture.setVideoUrl(null);
        lecture.setApprovalStatus(ApprovalStatus.PENDING.name());
        lectureRepository.save(lecture);
    }

    @Transactional
    @Override
    @CacheEvict(value = "publicLectures", allEntries = true)
    public void deleteDocument(long lectureId) throws IOException {

        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(lectureId).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
        validateLectureOwnership(lecture);

        MultipartfileUtil.deleteFile(lecture.getResourceUrl(), uploadDir);
        lecture.setResourceUrl(null);
        lecture.setApprovalStatus(ApprovalStatus.PENDING.name());
        lectureRepository.save(lecture);
    }

    @Override

    public Resource getManagerVideo(long lectureId) throws IOException {

//        User loggedInUser = (User) AuthUtil.getCurrentUser();
//        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(lectureId).
//                orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
//        if(loggedInUser.getRole().equals(UserRole.INSTRUCTOR)){
//            validateLectureOwnership(lecture);
//        }
        Lecture lecture = getManagerLecture(lectureId);
        return MultipartfileUtil.loadVideoFile(lecture.getVideoUrl(), uploadDir);
    }

    @Override
    public Resource getManagerDocument(long lectureId) throws IOException {

//        User loggedInUser = (User) AuthUtil.getCurrentUser();
//        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(lectureId).
//                orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
//        if(loggedInUser.getRole().equals(UserRole.INSTRUCTOR)){
//            validateLectureOwnership(lecture);
//        }
        Lecture lecture = getManagerLecture(lectureId);
        return MultipartfileUtil.loadDocumentFile(lecture.getResourceUrl(), uploadDir);
    }

    @Override
    public Resource getEnrolledVideo(long lectureId) throws IOException {

//        User loggedInUser = (User) AuthUtil.getCurrentUser();
        Lecture lecture = getPublicLecture(lectureId);

//        if(lecture.isPreview()){
//            return MultipartfileUtil.loadVideoFile(lecture.getVideoUrl(), uploadDir);
//        }
//        if(!checkUserAccess(loggedInUser, lecture)){
//            throw new ResourceNotFoundException("Access denied");
//        }
        return MultipartfileUtil.loadVideoFile(lecture.getVideoUrl(), uploadDir);
    }

    @Override
    public Resource getEnrolledDocument(long lectureId) throws IOException {

//        User loggedInUser = (User) AuthUtil.getCurrentUser();

        Lecture lecture = getPublicLecture(lectureId);
//        if(lecture.isPreview()){
//            return MultipartfileUtil.loadDocumentFile(lecture.getResourceUrl(), uploadDir);
//        }
//        if(!checkUserAccess(loggedInUser, lecture)){
//            throw new ResourceNotFoundException("Access denied");
//        }
        return MultipartfileUtil.loadDocumentFile(lecture.getResourceUrl(), uploadDir);
    }

    @Override
    @Transactional
    @CacheEvict(value = "publicLectures", allEntries = true)
    public LectureRes uploadS3Video(long lectureId, MultipartFile video) throws IOException {

        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(lectureId).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
        validateLectureOwnership(lecture);

        MultipartfileUtil.checkVideo(video);
        Float videoDuration = 0.0f;
        try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(video.getInputStream())) {
            grabber.start();
            double durationInSeconds = grabber.getLengthInTime() / (1_000_000.0 * 60);
            durationInSeconds = Math.round(durationInSeconds * 10.0) / 10.0;
            grabber.stop();
            videoDuration = (float) durationInSeconds;
        } catch (Exception e) {
            e.printStackTrace();

        }


        String uniqueFileName = s3Service.uploadFile(awsUploadDir, video);
//        MultipartfileUtil.saveFile(video, uploadDir, uniqueFileName);
        if(lecture.getVideoUrl() != null){
            s3Service.deleteFile(awsUploadDir + "/"+ lecture.getVideoUrl());
//            MultipartfileUtil.deleteFile(lecture.getVideoUrl(), uploadDir);
        }
        lecture.setVideoDuration(videoDuration);
        lecture.setVideoUrl(uniqueFileName);
        lecture.setApprovalStatus(ApprovalStatus.PENDING.name());
        return lectureMapper.toLectureRes(lectureRepository.save(lecture));
    }

    @Override
    @Transactional
    @CacheEvict(value = "publicLectures", allEntries = true)
    public LectureRes uploadS3Document(long lectureId, MultipartFile document) throws IOException {

        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(lectureId).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
        validateLectureOwnership(lecture);

        MultipartfileUtil.checkDocumentFile(document);
        String uniqueFileName = s3Service.uploadDocumentFile(awsUploadDir, document);

        if(lecture.getResourceUrl() != null){
            s3Service.deleteFile(awsUploadDir + "/"+ lecture.getResourceUrl());

        }
        lecture.setResourceUrl(uniqueFileName);
        lecture.setApprovalStatus(ApprovalStatus.PENDING.name());
        return lectureMapper.toLectureRes(lectureRepository.save(lecture));
    }

    @Override
    @Transactional
    @CacheEvict(value = "publicLectures", allEntries = true)
    public void deleteS3Video(long lectureId) throws IOException {

        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(lectureId).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
        validateLectureOwnership(lecture);

        s3Service.deleteFile(awsUploadDir + lecture.getVideoUrl());
        lecture.setVideoUrl(null);
        lectureRepository.save(lecture);
    }

    @Override
    @Transactional
    @CacheEvict(value = "publicLectures", allEntries = true)
    public void deleteS3Document(long lectureId) throws IOException {

        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(lectureId).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
        validateLectureOwnership(lecture);

        s3Service.deleteFile(awsUploadDir + lecture.getResourceUrl());
        lecture.setResourceUrl(null);
        lectureRepository.save(lecture);
    }

    @Override
    public String getManagerS3Video(long lectureId) throws IOException {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        Lecture lecture = getManagerLecture(lectureId);
        if(loggedInUser.getRole().equals(UserRole.INSTRUCTOR)){
            validateLectureOwnership(lecture);
        }
        Duration expiration = Duration.ofMinutes(60);
        return s3Service.presignedUrl(awsUploadDir, lecture.getVideoUrl(), expiration);

    }


    public String getManagerS3Document(long lectureId) throws IOException {

            User loggedInUser = (User) AuthUtil.getCurrentUser();
            Lecture lecture = getManagerLecture(lectureId);
            if(loggedInUser.getRole().equals(UserRole.INSTRUCTOR)){
                validateLectureOwnership(lecture);
            }
            Duration expiration = Duration.ofMinutes(60);
            return s3Service.presignedUrl(awsUploadDir, lecture.getResourceUrl(), expiration);
    }

    @Override
    @Cacheable(
            value = "publicLecturesVideo",
            key = "'id=' + #lectureId+ '-user=' + #userId"
    )
    public String getEnrolledS3Video(long lectureId, long userId) throws IOException {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        Lecture lecture = getPublicLecture(lectureId);

        if(lecture.isPreview()){
            return s3Service.presignedUrl(awsUploadDir, lecture.getVideoUrl(), Duration.ofMinutes(60));
        }
        if(!checkUserAccess(loggedInUser, lecture)){
            throw new ResourceNotFoundException("Access denied");
        }
        return s3Service.presignedUrl(awsUploadDir, lecture.getVideoUrl(), Duration.ofMinutes(60));
    }

    @Override
    @Cacheable(
            value = "publicLecturesDoc",
            key = "'id=' + #lectureId+ '-user=' + #userId"
    )
    public String getEnrolledS3Document(long lectureId, long userId) throws IOException {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        Lecture lecture = getPublicLecture(lectureId);
        if(lecture.isPreview()){
            return s3Service.presignedUrl(awsUploadDir, lecture.getResourceUrl(), Duration.ofMinutes(60));
        }
        if(!checkUserAccess(loggedInUser, lecture)){
            throw new ResourceNotFoundException("Access denied");
        }
        return s3Service.presignedUrl(awsUploadDir, lecture.getResourceUrl(), Duration.ofMinutes(60));
    }

    @Override
    public CountLectureRes countPublicLectureByCourse(long courseId) {

        QLecture qLecture = QLecture.lecture;
        Predicate predicate = qLecture.chapter.course.id.eq(courseId)
                .and(qLecture.isDeleted.isFalse())
                .and(qLecture.chapter.isDeleted.isFalse())
                .and(qLecture.chapter.course.isDeleted.isFalse())
                .and(qLecture.approvalStatus.eq(ApprovalStatus.APPROVED.name()))
                .and(qLecture.chapter.course.approvalStatus.eq(ApprovalStatus.APPROVED.name()));
        long totalLecture = lectureRepository.count(predicate);
        return new CountLectureRes(totalLecture);

    }

    @Override
    public CountLectureRes countLectureByCourse(long courseId) {

        QLecture qLecture = QLecture.lecture;
        Predicate predicate = qLecture.chapter.course.id.eq(courseId)
                .and(qLecture.isDeleted.isFalse())
                .and(qLecture.chapter.isDeleted.isFalse())
                .and(qLecture.chapter.course.isDeleted.isFalse());
        long totalLecture = lectureRepository.count(predicate);
        return new CountLectureRes(totalLecture);

    }

    @Override
    @Transactional
    @CacheEvict(value = "publicLectures", allEntries = true)
    public LectureRes approve(long id, ApprovalReq approvalReq) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(id).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
        if(lecture.getVideoUrl() == null && lecture.getResourceUrl() == null){
            throw new BusinessException("Vui lòng tải lên video hoặc tài liệu trước khi duyệt");
        }
        lecture.setApprovalStatus(approvalReq.getStatus().name());
        lectureRepository.save(lecture);

        ActionHistory actionHistory = ActionHistory.builder()
                .type(approvalReq.getStatus())
                .entityName(EntityNameEnum.LECTURE)
                .entityId(lecture.getId())
                .admin(loggedInUser)
                .timestamp(LocalDateTime.now())
                .reason(approvalReq.getComment())
                .build();
        actionHistoryRepository.save(actionHistory);

        if (approvalReq.getStatus().equals(ApprovalStatus.REJECTED)) {
            Notification notification = Notification.builder()
                    .user(lecture.getChapter().getCourse().getInstructor())
                    .title("Bài giảng của bạn đã bị từ chối")
                    .course(lecture.getChapter().getCourse())
                    .timestamp(LocalDateTime.now())
                    .roleNotification(UserRole.INSTRUCTOR.name())
                    .read(false)
                    .build();
            notificationService.saveNotification(notification);
            notificationService.sendNotification(notification);
        }
        return lectureMapper.toLectureRes(lecture);
    }

    @Override
    public boolean containsPendingApprovalLectures(long courseId) {

            QLecture qLecture = QLecture.lecture;
            Predicate predicate = qLecture.chapter.course.id.eq(courseId)
                    .and(qLecture.isDeleted.isFalse())
                    .and(qLecture.chapter.isDeleted.isFalse())
                    .and(qLecture.chapter.course.isDeleted.isFalse())
                    .and(qLecture.chapter.course.isActivated.isTrue())
                    .and(qLecture.chapter.isActivated.isTrue())
                    .and(qLecture.approvalStatus.eq(ApprovalStatus.PENDING.name()));
            return lectureRepository.exists(predicate);
    }

    @Override
    public long getLectureCountByStatus(long courseId, String status) {

            QLecture qLecture = QLecture.lecture;
            Predicate predicate = qLecture.chapter.course.id.eq(courseId)
                    .and(qLecture.isDeleted.isFalse())
                    .and(qLecture.chapter.isDeleted.isFalse())
                    .and(qLecture.chapter.course.isDeleted.isFalse())
                    .and(qLecture.approvalStatus.eq(status));
            return  lectureRepository.count(predicate);
    }

    @Override
    public float getLectureVideoDurationByStatus(long courseId, String status) {

        QLecture qLecture = QLecture.lecture;
        Predicate predicate = qLecture.chapter.course.id.eq(courseId)
                .and(qLecture.isDeleted.isFalse())
                .and(qLecture.chapter.isDeleted.isFalse())
                .and(qLecture.chapter.course.isDeleted.isFalse())
                .and(qLecture.approvalStatus.eq(status));

        List<Lecture> lectures = StreamSupport.stream(lectureRepository.findAll(predicate).spliterator(), false).toList();
        float totalDuration = 0.0f;
        for(Lecture lecture : lectures){
            if(lecture.getVideoDuration() == null){
                continue;
            }
            totalDuration += lecture.getVideoDuration();
        }
        return totalDuration;
    }

    @Override
    public float getLectureVideoDurationByStatus(long courseId) {

        QLecture qLecture = QLecture.lecture;
        Predicate predicate = qLecture.chapter.course.id.eq(courseId)
                .and(qLecture.isDeleted.isFalse())
                .and(qLecture.chapter.isDeleted.isFalse())
                .and(qLecture.chapter.course.isDeleted.isFalse());

        List<Lecture> lectures = StreamSupport.stream(lectureRepository.findAll(predicate).spliterator(), false).toList();
        float totalDuration = 0.0f;
        for(Lecture lecture : lectures){
            if(lecture.getVideoDuration() == null){
                continue;
            }
            totalDuration += lecture.getVideoDuration();
        }
        return totalDuration;
    }

    @Override
    @CacheEvict(value = "publicLectures", allEntries = true)
    public LectureRes rejectByReport(long reporterId, ActionReq actionReq) {

        Report report = reportRepository.findById(reporterId).orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        if(!report.getEntityType().equals(EntityNameEnum.LECTURE)){
            throw new BusinessException("Report type mismatch");
        }
        Lecture lecture = lectureRepository.findByIsDeletedIsFalseAndId(report.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
        lecture.setApprovalStatus(ApprovalStatus.REJECTED.name());
        lectureRepository.save(lecture);



        ActionHistory actionHistory = ActionHistory.builder()
                .type(ActionType.REJECTED)
                .entityName(EntityNameEnum.LECTURE)
                .entityId(lecture.getId())
                .admin((User) AuthUtil.getCurrentUser())
                .timestamp(LocalDateTime.now())
                .reason(actionReq.getReason())
                .build();

        report.setStatus(ReportStatus.RESOLVED);
        report.setActionHistory(actionHistory);
        reportRepository.save(report);
        return lectureMapper.toLectureRes(lecture);
    }

    @Override
    @Transactional
    @CacheEvict(value = "publicLectures", allEntries = true)
    public void swapOrder(long chapterId, long lectureId1, long lectureId2) {

        Lecture lecture1 = lectureRepository.findByIsDeletedIsFalseAndId(lectureId1).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
        Lecture lecture2 = lectureRepository.findByIsDeletedIsFalseAndId(lectureId2).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
        if(lecture1.getChapter().getId() != chapterId || lecture2.getChapter().getId() != chapterId){
            throw new BusinessException("Lecture not found in this chapter");
        }
        validateLectureOwnership(lecture1);
        validateLectureOwnership(lecture2);

        int orderNumber = lecture1.getOrderNumber();
        lecture1.setOrderNumber(lecture2.getOrderNumber());
        lecture2.setOrderNumber(orderNumber);
        lectureRepository.save(lecture1);
        lectureRepository.save(lecture2);

    }

    public void validateLectureOwnership(Lecture lecture){
        User loggedInUser = (User) AuthUtil.getCurrentUser();
        if(lecture.getChapter().getCourse().getInstructor().getId() !=  loggedInUser.getId()){
            throw new BusinessException("You are not authorized to update lecture for this chapter");
        }
    }



    public boolean checkUserAccess(User user, Lecture lecture){
        return userCourseRepository.existsByUserIdAndCourseId(user.getId(), lecture.getChapter().getCourse().getId());
    }

    private Lecture getPublicLecture(long id){
        QLecture qLecture = QLecture.lecture;
        Predicate predicate = qLecture.id.eq(id)
                .and(qLecture.isDeleted.isFalse())
                .and(qLecture.chapter.course.isDeleted.isFalse())
                .and(qLecture.chapter.course.isActivated.isTrue())
                .and(qLecture.chapter.isDeleted.isFalse())
                .and(qLecture.chapter.course.isDeleted.isFalse())
                .and(qLecture.chapter.course.isActivated.isTrue())
                .and(qLecture.approvalStatus.eq(ApprovalStatus.APPROVED.name()))
                .and(qLecture.chapter.course.approvalStatus.eq(ApprovalStatus.APPROVED.name()));
        return lectureRepository.findOne(predicate).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
    }

    private Lecture getManagerLecture(long id){
        QLecture qLecture = QLecture.lecture;
        Predicate predicate = qLecture.id.eq(id)
                .and(qLecture.isDeleted.isFalse())
                .and(qLecture.chapter.isDeleted.isFalse())
                .and(qLecture.chapter.course.isDeleted.isFalse());
        return lectureRepository.findOne(predicate).orElseThrow(() -> new ResourceNotFoundException("Lecture not found"));
    }

    @Override
    public Page<LearnerCompleteLectureRes> getLearnerCompleteLecture(Pageable pageable, LectureQuery lectureQuery) {

        lectureQuery.setManager(false);
        return lectureRepository.findAll(lectureQuery.toPredicate(), pageable).map(lectureMapper :: toLearnerCompleteLectureRes);
    }

}
