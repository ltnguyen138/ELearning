package com.example.elearningbackend.notification;

import com.example.elearningbackend.course.CourseShortRes;
import com.example.elearningbackend.user.UserShortRes;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRes {

    private long id;

    private String title;

    private String roleNotification;

    private UserShortRes user;

    private CourseShortRes course;

    private String timestamp;

    private boolean read;
}
