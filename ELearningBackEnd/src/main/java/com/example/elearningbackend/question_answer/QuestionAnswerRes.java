package com.example.elearningbackend.question_answer;

import com.example.elearningbackend.course.CourseShortRes;
import com.example.elearningbackend.lecture.LectureRes;
import com.example.elearningbackend.user.UserShortRes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class QuestionAnswerRes {

    private long id;

    private String content;

    private UserShortRes user;

    private Set<QuestionAnswerRes> answers = new HashSet<>();

    private boolean isDeleted;

    private boolean isActivated;

    private String createdTime;

    private String updatedTime;

    private LectureRes lecture;

    private CourseShortRes course;
}
