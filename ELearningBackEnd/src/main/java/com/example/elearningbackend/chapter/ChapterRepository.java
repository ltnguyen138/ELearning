package com.example.elearningbackend.chapter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long>, QuerydslPredicateExecutor<Chapter> {

    Optional<Chapter> findByIdAndIsDeletedIsFalse(long id);

    int countByCourseIdAndIsDeletedIsFalse(long courseId);
}
