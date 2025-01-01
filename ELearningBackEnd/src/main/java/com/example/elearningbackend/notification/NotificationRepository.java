package com.example.elearningbackend.notification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long>, QuerydslPredicateExecutor<Notification> {

    Page<Notification> findByUserId(Long userId, Pageable pageable);

    List<Notification> findTop8ByUserIdOrderByTimestampDesc(Long userId);

    List<Notification> findTop8ByUserIdAndReadOrderByTimestampDesc(Long userId, boolean read);

    void deleteAllByUserId(Long userId);

    List<Notification> findTop4ByUserIdAndReadOrderByTimestampDesc(long id, boolean b);

    List<Notification> findTop4ByUserIdOrderByTimestampDesc(long id);

    List<Notification> findAllByReadIsFalseAndUserId(long id);
}
