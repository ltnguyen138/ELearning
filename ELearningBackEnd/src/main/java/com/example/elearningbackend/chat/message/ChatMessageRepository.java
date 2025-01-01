package com.example.elearningbackend.chat.message;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long>, QuerydslPredicateExecutor<ChatMessage> {

    Page<ChatMessage> findAllByChatRoomIdOrderByTimestampDesc(long chatRoomId, Pageable pageable);
}
