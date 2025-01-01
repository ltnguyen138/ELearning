package com.example.elearningbackend.report;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface ReportService {

    Page<ReportRes> getPage(Pageable pageable, ReportQuery query);

    ReportRes getById(long id);

    ReportRes createReport(ReportReq reportReq);

    void dismissReport(ReportActionReq reportActionReq);

    Page<ReportRes> getReportCourse(Pageable pageable, ReportQuery query);

    Page<ReportRes> getReportReview(Pageable pageable, ReportQuery query);

    Page<ReportRes> getReportQuestionAnswer(Pageable pageable, ReportQuery query);

    void blockUser(ReportActionReq reportActionReq);

    void deleteReview(ReportActionReq reportActionReq);

    void deleteQuestionAnswer(ReportActionReq reportActionReq);

    void deleteCourse(ReportActionReq reportActionReq);

    void rejectCourse(ReportActionReq reportActionReq);

    ReportRes getReportCourseById(long id);

    ReportRes getReportReviewById(long id);

    ReportRes getReportQuestionAnswerById(long id);
}
