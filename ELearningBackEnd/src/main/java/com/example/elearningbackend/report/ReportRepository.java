package com.example.elearningbackend.report;

import com.example.elearningbackend.common.EntityNameEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long>, QuerydslPredicateExecutor<Report> {

    List<Report> findByIdInAndStatusAndEntityType(List<Long> ids, ReportStatus status, EntityNameEnum entityType);
}
