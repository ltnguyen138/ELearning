package com.example.elearningbackend.user.earning;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.List;
import java.util.Optional;

public interface PayoutHistoryRepository extends JpaRepository<PayoutHistory, Long>, QuerydslPredicateExecutor<PayoutHistory> {

    Optional<PayoutHistory> findFirstByUserIdOrderByPayoutDateDesc(long userId);

    List<PayoutHistory> findAllByUserIdOrderByPayoutDateDesc(long userId);
}
