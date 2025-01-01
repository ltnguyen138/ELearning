package com.example.elearningbackend.history.action;

import com.example.elearningbackend.action.ActionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ActionHistoryRepository extends JpaRepository<ActionHistory, Long>, QuerydslPredicateExecutor<ActionHistory> {}
