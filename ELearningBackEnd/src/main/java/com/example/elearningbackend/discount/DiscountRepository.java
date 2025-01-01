package com.example.elearningbackend.discount;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Long>, QuerydslPredicateExecutor<Discount> {

    boolean existsByCodeAndIsDeletedIsFalse(String code);

    Optional<Discount> findByIdAndIsDeletedIsFalse(long id);

    List<Discount> findAllByTypeAndCourseId(String type, long courseId);
}
