package com.example.elearningbackend.user.user_course;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCourseQuery {

    private String keyword;
    private Long categoryId;
    private long userId;

    public Predicate toPredicate() {
        QUserCourse qUserCourse = QUserCourse.userCourse;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qUserCourse.user.id.eq(userId));
        if (keyword != null && !keyword.isEmpty()) {
            builder.and(qUserCourse.course.name.containsIgnoreCase(keyword));
        }

        if (categoryId != null) {
            builder.and(qUserCourse.course.category.id.eq(categoryId));
        }
        return builder;
    }
}
