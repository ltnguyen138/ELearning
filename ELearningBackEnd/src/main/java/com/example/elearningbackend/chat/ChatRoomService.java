package com.example.elearningbackend.chat;

import com.example.elearningbackend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    public ChatRoom getChatRoomByUserId(long userId) {

        ChatRoom chatRoom = chatRoomRepository.findByUserId(userId).orElse(null);
        if (chatRoom == null) {
            chatRoom = ChatRoom.builder()
                    .userId(userId)
                    .active(false)
                    .startedAt(LocalDateTime.now())
                    .build();
            chatRoom = chatRoomRepository.save(chatRoom);
        }
        return chatRoom;
    }

    public List<ChatRoom> getChatRoomByAdminId(long adminId) {
        return chatRoomRepository.findByAdminIdNotNullAndAdminId(adminId);
    }

    public ChatRoom activeChatRoom(ChatRoom chatRoom) {
        chatRoom.setActive(true);
        chatRoom.setStartedAt(LocalDateTime.now());
        return chatRoomRepository.save(chatRoom);
    }

    public ChatRoom deactivateChatRoom(long userId) {
        ChatRoom chatRoom = chatRoomRepository.findByUserId(userId).orElse(null);
        if (chatRoom != null) {
            chatRoom.setActive(false);
            chatRoom.setAdminId(null);
            return chatRoomRepository.save(chatRoom);
        }
        throw new ResourceNotFoundException("Phòng chat không tồn tại");
    }



    public ChatRoom deactivateChatRoom(ChatRoom chatRoom) {
        chatRoom.setActive(false);
        chatRoom.setAdminId(null);
        return chatRoomRepository.save(chatRoom);
    }

    public List<ChatRoom> getActiveChatRooms() {
        return chatRoomRepository.findAllByActiveIsTrueAndAdminIdIsNullOrderByStartedAtAsc();
    }

    public void toggleAdminRead(long chatRoomId) {
        Optional<ChatRoom> chatRoom = chatRoomRepository.findById(chatRoomId);
        if (chatRoom.isPresent()) {
            chatRoom.get().setAdminRead(!chatRoom.get().isAdminRead());
            chatRoomRepository.save(chatRoom.get());
        } else {
            throw new ResourceNotFoundException("Phòng chat không tồn tại");
        }
    }

    public void toggleUserRead(long chatRoomId) {
        Optional<ChatRoom> chatRoom = chatRoomRepository.findById(chatRoomId);
        if (chatRoom.isPresent()) {
            chatRoom.get().setUserRead(!chatRoom.get().isUserRead());
            chatRoomRepository.save(chatRoom.get());
        } else {
            throw new ResourceNotFoundException("Phòng chat không tồn tại");
        }
    }
}
