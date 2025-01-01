package com.example.elearningbackend.course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long>, QuerydslPredicateExecutor<Course> {

    Optional<Course> findByIdAndIsDeletedIsFalse(long id);

    boolean existsByNameAndIsDeletedIsFalse(String name);

    boolean existsByAliasAndIsDeletedIsFalse(String alias);
}
