package com.example.elearningbackend.lecture;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long>, QuerydslPredicateExecutor<Lecture> {

    Optional<Lecture> findByIsDeletedIsFalseAndId(long id);

    int countByChapterIdAndIsDeletedIsFalse(long chapterId);

    Optional<Lecture> findByChapterOrderNumberAndOrderNumber(int chapterOrderNumber, int orderNumber);

    Optional<Lecture> findByChapterOrderNumberAndOrderNumberAndChapter_CourseId(int chapterOrderNumber, int orderNumber, long courseId);
}
