package com.example.elearningbackend.report;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public Page<ReportRes> getPage(Pageable pageable, ReportQuery query) {

        return reportService.getPage(pageable, query);
    }

    @GetMapping("/{id}")
    public ReportRes getById(@PathVariable long id) {

        return reportService.getById(id);
    }

    @PutMapping("/dismiss")
    public void dismissReport(@RequestBody ReportActionReq reportActionReq) {

        reportService.dismissReport(reportActionReq);
    }

    @PostMapping
    public ReportRes createReport(@RequestBody ReportReq reportReq) {

        return reportService.createReport(reportReq);
    }

    @PutMapping("/block-user")
    public void blockUser(@RequestBody ReportActionReq reportActionReq) {

        reportService.blockUser(reportActionReq);
    }

    @PutMapping("/delete-review")
    public void deleteReview(@RequestBody ReportActionReq reportActionReq) {

        reportService.deleteReview(reportActionReq);
    }

    @PutMapping("/delete-question-answer")
    public void deleteQuestionAnswer(@RequestBody ReportActionReq reportActionReq) {

        reportService.deleteQuestionAnswer(reportActionReq);
    }

    @PutMapping("/delete-course")
    public void deleteCourse(@RequestBody ReportActionReq reportActionReq) {

        reportService.deleteCourse(reportActionReq);
    }

    @PutMapping("/reject-course")
    public void rejectCourse(@RequestBody ReportActionReq reportActionReq) {

        reportService.rejectCourse(reportActionReq);
    }
    @GetMapping("/course/{id}")
    public ReportRes getReportCourseById(@PathVariable long id) {

        return reportService.getReportCourseById(id);
    }

    @GetMapping("/review/{id}")
    public ReportRes getReportReviewById(@PathVariable long id) {

        return reportService.getReportReviewById(id);
    }

    @GetMapping("/question-answer/{id}")
    public ReportRes getReportQuestionAnswerById(@PathVariable long id) {

        return reportService.getReportQuestionAnswerById(id);
    }

    @GetMapping("/course")
    public Page<ReportRes> getReportCourse(Pageable pageable, ReportQuery query) {

        return reportService.getReportCourse(pageable, query);
    }

    @GetMapping("/review")
    public Page<ReportRes> getReportReview(Pageable pageable, ReportQuery query) {

        return reportService.getReportReview(pageable, query);
    }

    @GetMapping("/question-answer")
    public Page<ReportRes> getReportQuestionAnswer(Pageable pageable, ReportQuery query) {

        return reportService.getReportQuestionAnswer(pageable, query);
    }
}
