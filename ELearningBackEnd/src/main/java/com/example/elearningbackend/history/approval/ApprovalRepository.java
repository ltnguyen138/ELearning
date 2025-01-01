package com.example.elearningbackend.history.approval;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ApprovalRepository extends JpaRepository<ApprovalHistory, Long>, QuerydslPredicateExecutor<ApprovalHistory> {

}
