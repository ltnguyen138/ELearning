package com.example.elearningbackend.review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>, QuerydslPredicateExecutor<Review> {

    Optional<Review> findByIdAndIsDeletedIsFalse(long id);
}
