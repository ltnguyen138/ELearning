package com.example.elearningbackend.user.user_course;

import com.example.elearningbackend.course.CourseRes;
import com.example.elearningbackend.course.CourseShortRes;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCourseShortRes {

    CourseRes course;

    Long currentLectureId;

    List<UserCourseLectureRes> lectures;
}
