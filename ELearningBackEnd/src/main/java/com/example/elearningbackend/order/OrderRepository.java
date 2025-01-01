package com.example.elearningbackend.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, QuerydslPredicateExecutor<Order> {

    Optional<Order> findByStatusAndUser_Id(String status, long userId);

    Optional<Order> findByStatusAndPaymentIdIsNotLike(String status, String paymentId);
}
