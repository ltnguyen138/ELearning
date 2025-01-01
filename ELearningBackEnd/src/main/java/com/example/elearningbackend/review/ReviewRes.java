package com.example.elearningbackend.review;

import com.example.elearningbackend.course.CourseShortRes;
import com.example.elearningbackend.user.UserRes;
import com.example.elearningbackend.user.UserShortRes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class ReviewRes {

    private long id;

    private String comment;

    private int rating;

    private UserShortRes user;

    private CourseShortRes course;

    private boolean isDeleted;

    private boolean isActivated;

        private LocalDateTime createdTime;

    private LocalDateTime updatedTime;
}
