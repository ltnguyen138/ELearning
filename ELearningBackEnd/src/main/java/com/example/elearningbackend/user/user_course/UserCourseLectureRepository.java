package com.example.elearningbackend.user.user_course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface UserCourseLectureRepository extends JpaRepository<UserCourseLecture, Long>, QuerydslPredicateExecutor<UserCourseLecture> {

}
