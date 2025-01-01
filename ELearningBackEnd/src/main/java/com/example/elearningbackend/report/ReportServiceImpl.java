package com.example.elearningbackend.report;

import com.example.elearningbackend.action.ActionHistory;
import com.example.elearningbackend.common.EntityNameEnum;
import com.example.elearningbackend.course.CourseMapper;
import com.example.elearningbackend.course.CourseRepository;
import com.example.elearningbackend.exception.ResourceNotFoundException;
import com.example.elearningbackend.history.action.ActionHistoryRepository;
import com.example.elearningbackend.history.action.ActionType;
import com.example.elearningbackend.history.approval.ApprovalStatus;
import com.example.elearningbackend.notification.Notification;
import com.example.elearningbackend.notification.NotificationService;
import com.example.elearningbackend.question_answer.QuestionAnswer;
import com.example.elearningbackend.question_answer.QuestionAnswerMapper;
import com.example.elearningbackend.question_answer.QuestionAnswerRepository;
import com.example.elearningbackend.review.Review;
import com.example.elearningbackend.review.ReviewMapper;
import com.example.elearningbackend.review.ReviewRepository;
import com.example.elearningbackend.role.UserRole;
import com.example.elearningbackend.user.User;
import com.example.elearningbackend.user.UserRepository;
import com.example.elearningbackend.util.AuthUtil;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.StreamSupport;

@Component
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService{

    private final ReportRepository reportRepository;
    private final ReportMapper reportMapper;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final ReviewRepository reviewRepository;
    private final QuestionAnswerRepository questionAnswerRepository;
    private final ReviewMapper reviewMapper;
    private final QuestionAnswerMapper questionAnswerMapper;
    private final ActionHistoryRepository actionHistoryRepository;
    private final NotificationService notificationService;

    @Override
    public Page<ReportRes> getPage(Pageable pageable, ReportQuery query) {

        if(query.checkNullQuery()){
            return reportRepository.findAll(pageable).map(reportMapper::toReportRes);
        }
        return reportRepository.findAll(query.toPredicate(), pageable).map(reportMapper::toReportRes);
    }

    @Override
    public ReportRes getById(long id) {

        return reportRepository.findById(id).map(reportMapper::toReportRes).orElse(null);
    }

    @Override
    public ReportRes createReport(ReportReq reportReq) {

        User user =
            userRepository
                .findById(reportReq.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Report report = reportMapper.toReport(reportReq);
        report.setUser(user);
        report.setStatus(ReportStatus.PENDING);
        report.setTimestamp(LocalDateTime.now());
        return reportMapper.toReportRes(reportRepository.save(report));
    }

    @Override
    public void dismissReport(ReportActionReq reportActionReq) {

        List<Report> reports = getReports(reportActionReq);
        User loggedUser = (User) AuthUtil.getCurrentUser();
        ActionHistory actionHistory = ActionHistory.builder()
                .type(ActionType.DISMISS)
                .reason(reportActionReq.getReason())
                .timestamp(LocalDateTime.now())
                .admin(loggedUser)
                .entityName(reportActionReq.getEntityType())
                .entityId(reportActionReq.getEntityId())
                .build();
        actionHistoryRepository.save(actionHistory);
        reports.forEach(report -> {
            report.setActionHistory(actionHistory);
            report.setStatus(ReportStatus.DISMISSED);
        });
        reportRepository.saveAll(reports);
    }

    @Override
    public Page<ReportRes> getReportCourse(Pageable pageable, ReportQuery query) {

        query.setEntityType(EntityNameEnum.COURSE.name());
        Page<Report> reports = getPageReportPage(pageable, query);

         Page<ReportRes> reportsRes = reports.map(report -> {
            ReportRes reportRes = reportMapper.toReportRes(report);
            reportRes.setCourse(courseMapper.toCourseShortRes(courseRepository.findById(report.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("Course not found"))));
            return reportRes;
         });
        return reportsRes;
    }

    @Override
    public Page<ReportRes> getReportReview(Pageable pageable, ReportQuery query) {

        query.setEntityType(EntityNameEnum.REVIEW.name());
        Page<Report> reports = getPageReportPage(pageable, query);
        Page<ReportRes> reportsRes = reports.map(report -> {
            ReportRes reportRes = reportMapper.toReportRes(report);
            reportRes.setReview(reviewMapper.toReviewRes(reviewRepository.findById(report.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("Review not found"))));
            return reportRes;
        });
        return reportsRes;
    }

    @Override
    public Page<ReportRes> getReportQuestionAnswer(Pageable pageable, ReportQuery query) {

        query.setEntityType(EntityNameEnum.QUESTION_ANSWER.name());
        Page<Report> reports = getPageReportPage(pageable, query);
        Page<ReportRes> reportsRes = reports.map(report -> {
            ReportRes reportRes = reportMapper.toReportRes(report);
            reportRes.setQuestionAnswer(questionAnswerMapper.toQuestionAnswerRes(questionAnswerRepository.findById(report.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("QuestionAnswer not found"))));
            return reportRes;
        });
        return reportsRes;
    }

    @Override
    @Transactional
    public void blockUser(ReportActionReq reportActionReq) {

        if(reportActionReq.getEntityType() != EntityNameEnum.USER){
            throw new ResourceNotFoundException("Entity type is not user");
        }
        User loggedUser = (User) AuthUtil.getCurrentUser();
        List<Report> reports = getReports(reportActionReq);

        User user = userRepository.findById(reportActionReq.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if(user.getRole().getName().equals(UserRole.ADMIN.toString()) || user.getRole().getName().equals(UserRole.ROOT.toString())){
            throw new ResourceNotFoundException("User can't be blocked");
        }
        user.setActivated(false);

        ActionHistory actionHistory = ActionHistory.builder()
                .type(ActionType.BLOCK)
                .reason(reportActionReq.getReason())
                .timestamp(LocalDateTime.now())
                .admin(loggedUser)
                .entityName(EntityNameEnum.USER)
                .entityId(reportActionReq.getEntityId())
                .build();
        userRepository.save(user);
        actionHistoryRepository.save(actionHistory);

        List<Notification> notifications = new ArrayList<>();
        reports.forEach(report -> {
            report.setActionHistory(actionHistory);
            report.setStatus(ReportStatus.RESOLVED);
            Notification notification = Notification.builder()
                    .user(report.getUser())
                    .title("Báo cáo của bạn đã được xử lý")
                    .timestamp(LocalDateTime.now())
                    .roleNotification(UserRole.LEARNER.name())
                    .read(false)
                    .build();
            notifications.add(notification);
        });
        notificationService.sendNotifications(notifications);
        reportRepository.saveAll(reports);
    }

    @Override
    @Transactional
    public void deleteReview(ReportActionReq reportActionReq) {

        if(reportActionReq.getEntityType() != EntityNameEnum.REVIEW){
            throw new ResourceNotFoundException("Entity type is not review");
        }
        User loggedUser = (User) AuthUtil.getCurrentUser();
        List<Report> reports = getReports(reportActionReq);

        Review review = reviewRepository.findById(reportActionReq.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("Review not found"));
        review.setDeleted(true);
        ActionHistory actionHistory = ActionHistory.builder()
                .type(ActionType.DELETE)
                .reason(reportActionReq.getReason())
                .timestamp(LocalDateTime.now())
                .admin(loggedUser)
                .entityName(EntityNameEnum.REVIEW)
                .entityId(reportActionReq.getEntityId())
                .build();
        reviewRepository.save(review);
        actionHistoryRepository.save(actionHistory);
        List<Notification> notifications = new ArrayList<>();
        reports.forEach(report -> {
            report.setActionHistory(actionHistory);
            report.setStatus(ReportStatus.RESOLVED);
            Notification notification = Notification.builder()
                    .user(report.getUser())
                    .title("Báo cáo của bạn đã được xử lý, đánh giá không hợp lệ đã bị xóa")
                    .course(review.getCourse())
                    .timestamp(LocalDateTime.now())
                    .roleNotification(UserRole.LEARNER.name())
                    .read(false)
                    .build();
            notifications.add(notification);
        });

        notificationService.sendNotifications(notifications);
        reportRepository.saveAll(reports);
    }

    @Override
    @Transactional
    public void deleteQuestionAnswer(ReportActionReq reportActionReq) {

        if(reportActionReq.getEntityType() != EntityNameEnum.QUESTION_ANSWER){
            throw new ResourceNotFoundException("Entity type is not question answer");
        }
        User loggedUser = (User) AuthUtil.getCurrentUser();
        List<Report> reports = getReports(reportActionReq);

        QuestionAnswer questionAnswer = questionAnswerRepository.findById(reportActionReq.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("QuestionAnswer not found"));
        questionAnswer.setDeleted(true);
        ActionHistory actionHistory = ActionHistory.builder()
                .type(ActionType.DELETE)
                .reason(reportActionReq.getReason())
                .timestamp(LocalDateTime.now())
                .admin(loggedUser)
                .entityName(EntityNameEnum.QUESTION_ANSWER)
                .entityId(reportActionReq.getEntityId())
                .build();
        questionAnswerRepository.save(questionAnswer);
        actionHistoryRepository.save(actionHistory);
        List<Notification> notifications = new ArrayList<>();
        reports.forEach(report -> {
            report.setActionHistory(actionHistory);
            report.setStatus(ReportStatus.RESOLVED);
            Notification notification = Notification.builder()
                    .user(report.getUser())
                    .title("Báo cáo của bạn đã được xử lý, câu hỏi hoặc câu trả lời không hợp lệ đã bị xóa")
                    .course(questionAnswer.getCourse())
                    .timestamp(LocalDateTime.now())
                    .roleNotification(UserRole.LEARNER.name())
                    .read(false)
                    .build();
            notifications.add(notification);
        });

        notificationService.sendNotifications(notifications);
        reportRepository.saveAll(reports);
    }

    @Override
    @Transactional
    @CacheEvict(value = "publicCourses", allEntries = true)
    public void deleteCourse(ReportActionReq reportActionReq) {

        if(reportActionReq.getEntityType() != EntityNameEnum.COURSE){
            throw new ResourceNotFoundException("Entity type is not course");
        }
        User loggedUser = (User) AuthUtil.getCurrentUser();
        List<Report> reports = getReports(reportActionReq);

        com.example.elearningbackend.course.Course course = courseRepository.findById(reportActionReq.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        course.setDeleted(true);
        ActionHistory actionHistory = ActionHistory.builder()
                .type(ActionType.DELETE)
                .reason(reportActionReq.getReason())
                .timestamp(LocalDateTime.now())
                .admin(loggedUser)
                .entityName(EntityNameEnum.COURSE)
                .entityId(reportActionReq.getEntityId())
                .build();
        courseRepository.save(course);
        actionHistoryRepository.save(actionHistory);
        List<Notification> notifications = new ArrayList<>();
        reports.forEach(report -> {
            report.setActionHistory(actionHistory);
            report.setStatus(ReportStatus.RESOLVED);
            Notification notification = Notification.builder()
                    .user(report.getUser())
                    .title("Báo cáo của bạn đã được xử lý, khóa học không hợp lệ đã bị xóa")
                    .course(course)
                    .timestamp(LocalDateTime.now())
                    .roleNotification(UserRole.LEARNER.name())
                    .read(false)
                    .build();
            notifications.add(notification);
        });
        notificationService.sendNotifications(notifications);
        reportRepository.saveAll(reports);
    }

    @Override
    @Transactional
    @CacheEvict(value = "publicCourses", allEntries = true)
    public void rejectCourse(ReportActionReq reportActionReq) {

        if(reportActionReq.getEntityType() != EntityNameEnum.COURSE){
            throw new ResourceNotFoundException("Entity type is not course");
        }
        User loggedUser = (User) AuthUtil.getCurrentUser();
        List<Report> reports = getReports(reportActionReq);

        com.example.elearningbackend.course.Course course = courseRepository.findById(reportActionReq.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        course.setApprovalStatus(ApprovalStatus.REJECTED.name());
        ActionHistory actionHistory = ActionHistory.builder()
                .type(ActionType.REJECTED)
                .reason(reportActionReq.getReason())
                .timestamp(LocalDateTime.now())
                .admin(loggedUser)
                .entityName(EntityNameEnum.COURSE)
                .entityId(reportActionReq.getEntityId())
                .build();
        courseRepository.save(course);
        actionHistoryRepository.save(actionHistory);
        List<Notification> notifications = new ArrayList<>();
        reports.forEach(report -> {
            report.setActionHistory(actionHistory);
            report.setStatus(ReportStatus.RESOLVED);
            Notification notification = Notification.builder()
                    .user(report.getUser())
                    .title("Báo cáo của bạn đã được xử lý, khóa học không hợp lệ đã tạm thời bị khóa")
                    .course(course)
                    .timestamp(LocalDateTime.now())
                    .roleNotification(UserRole.LEARNER.name())
                    .read(false)
                    .build();
            notifications.add(notification);
        });
        notificationService.sendNotifications(notifications);
        reportRepository.saveAll(reports);
    }

    @Override
    public ReportRes getReportCourseById(long id) {

        Report report = reportRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        ReportRes reportRes = reportMapper.toReportRes(report);
        if(report.getEntityType() != EntityNameEnum.COURSE){
            throw new ResourceNotFoundException("Entity type is not course");
        }
        reportRes.setCourse(courseMapper.toCourseShortRes(courseRepository.findById(report.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("Course not found"))));
        return reportRes;
    }

    @Override
    public ReportRes getReportReviewById(long id) {

        Report report = reportRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        ReportRes reportRes = reportMapper.toReportRes(report);
        if(report.getEntityType() != EntityNameEnum.REVIEW){
            throw new ResourceNotFoundException("Entity type is not review");
        }
        reportRes.setReview(reviewMapper.toReviewRes(reviewRepository.findById(report.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("Review not found"))));
        return reportRes;
    }

    @Override
    public ReportRes getReportQuestionAnswerById(long id) {

        Report report = reportRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        ReportRes reportRes = reportMapper.toReportRes(report);
        if(report.getEntityType() != EntityNameEnum.QUESTION_ANSWER){
            throw new ResourceNotFoundException("Entity type is not question answer");
        }
        reportRes.setQuestionAnswer(questionAnswerMapper.toQuestionAnswerRes(questionAnswerRepository.findById(report.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("QuestionAnswer not found"))));
        return reportRes;
    }


    private Page<Report> getPageReportPage(Pageable pageable, ReportQuery query){
        if(query.checkNullQuery()){
            return reportRepository.findAll(pageable);
        }
        return reportRepository.findAll(query.toPredicate(), pageable);
    }

    public List<Report> getAllReports(ReportActionReq reportActionReq){
        QReport qReport = QReport.report;
        Predicate predicate = qReport.id.in(reportActionReq.getIds())
                .and(qReport.status.eq(ReportStatus.PENDING))
                .and(qReport.entityType.eq(reportActionReq.getEntityType()))
                .and(qReport.actionHistory.isNull());

        List<Report> reports = StreamSupport.stream(reportRepository.findAll(predicate).spliterator(), false).toList();
        if(reports.isEmpty()){
            throw new ResourceNotFoundException("Report not found");
        }
        return reports;
    }
    private List<Report> getReports(ReportActionReq reportActionReq){
        QReport qReport = QReport.report;
        Predicate predicate = qReport.id.in(reportActionReq.getIds())
                .and(qReport.status.eq(ReportStatus.PENDING))
                .and(qReport.entityType.eq(reportActionReq.getEntityType()))
                .and(qReport.actionHistory.isNull())
                .and(qReport.entityId.eq(reportActionReq.getEntityId()));
        List<Report> reports = StreamSupport.stream(reportRepository.findAll(predicate).spliterator(), false).toList();
        if(reports.isEmpty()){
            throw new ResourceNotFoundException("Report not found");
        }
        return reports;
    }
}
