package com.example.elearningbackend.history.approval;

import com.example.elearningbackend.course.CourseShortRes;
import com.example.elearningbackend.lecture.Lecture;
import com.example.elearningbackend.lecture.LectureRes;
import com.example.elearningbackend.user.UserShortRes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ApprovalRes {

    private long id;

    private String type;

    private CourseShortRes course;

    private LectureRes lecture;

    private UserShortRes admin;

    private String status;

    private String comment;

    private String timestamp;
}
