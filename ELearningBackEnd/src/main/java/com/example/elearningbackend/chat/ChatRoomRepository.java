package com.example.elearningbackend.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findByUserId(long userId);

    List<ChatRoom> findByAdminIdNotNullAndAdminId(long adminId);

    List<ChatRoom> findAllByActiveIsTrueAndAdminIdIsNullOrderByStartedAtAsc();
}
