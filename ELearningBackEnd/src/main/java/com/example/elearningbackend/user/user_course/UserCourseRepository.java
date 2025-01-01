package com.example.elearningbackend.user.user_course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserCourseRepository extends JpaRepository<UserCourse, Long> , QuerydslPredicateExecutor<UserCourse> {

    boolean existsByUserIdAndCourseId(long userId, long courseId);

    List<UserCourse> findAllByUserId(long userId);

    UserCourse findByCourseAliasAndUserId(String alias, long userId);

    List<UserCourse> findAllByCourseId(long courseId);
}

