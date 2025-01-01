package com.example.elearningbackend.report;

import com.example.elearningbackend.course.CourseShortRes;
import com.example.elearningbackend.question_answer.QuestionAnswer;
import com.example.elearningbackend.question_answer.QuestionAnswerRes;
import com.example.elearningbackend.review.ReviewRes;
import com.example.elearningbackend.user.User;
import com.example.elearningbackend.user.UserShortRes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReportRes {

    private long id;

    private String entityType;

    private long entityId;

    private UserShortRes user;

    private String reason;

    private String status;

    private String timestamp;

    private CourseShortRes course;

    private ReviewRes review;

    private QuestionAnswerRes questionAnswer;
}
