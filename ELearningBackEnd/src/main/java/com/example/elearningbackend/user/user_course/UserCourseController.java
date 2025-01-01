package com.example.elearningbackend.user.user_course;

import com.example.elearningbackend.lecture.Lecture;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/user-courses")
public class UserCourseController {

    private final UserCourseService userCourseService;

    @GetMapping("/{alias}")
    UserCourseShortRes getByAliasAndUserId(@PathVariable String alias) {
        return userCourseService.getByAliasAndUserId(alias);
    }

    @PutMapping("/{alias}/current-lecture/{lectureId}")
    UserCourseShortRes updateCurrentLectureId(@PathVariable String alias, @PathVariable Long lectureId) {
        return userCourseService.updateCurrentLectureId(alias, lectureId);
    }

    @PutMapping("/{alias}/completed-lectures/{lectureId}")
    UserCourseShortRes updateCompletedLectures(@PathVariable String alias, @PathVariable Long lectureId) {
        return userCourseService.completeLecture(alias, lectureId);
    }

    @GetMapping("/a/{alias}")
    Long getCurrentLecture(@PathVariable String alias) {
        return userCourseService.getCurrentLecture(alias);
    }

    @GetMapping("/count-learner-complete/{courseId}")
    Long countLearnerComplete(@PathVariable Long courseId) {
        return userCourseService.countLearnerComplete(courseId);
    }
}
