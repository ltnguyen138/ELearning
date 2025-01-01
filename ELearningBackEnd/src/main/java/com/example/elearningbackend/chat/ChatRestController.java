package com.example.elearningbackend.chat;

import com.example.elearningbackend.chat.message.ChatMessage;
import com.example.elearningbackend.chat.message.ChatMessageRes;
import com.example.elearningbackend.chat.message.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/chat")
public class ChatRestController {

    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;

    @GetMapping("/room/{userId}")
    public ChatRoom getChatRoomByUserId(@PathVariable long userId) {
        return chatRoomService.getChatRoomByUserId(userId);
    }

    @GetMapping("/room/active")
    public List<ChatRoom> getActiveChatRooms() {
        return chatRoomService.getActiveChatRooms();
    }

    @PutMapping("/room/toggle-admin-read/{chatRoomId}")
    public void toggleAdminRead(@PathVariable long chatRoomId) {

        chatRoomService.toggleAdminRead(chatRoomId);
    }

    @PutMapping("/room/toggle-user-read/{chatRoomId}")
    public void toggleUserRead(@PathVariable long chatRoomId) {

        chatRoomService.toggleUserRead(chatRoomId);
    }
    @GetMapping("/messages/{chatRoomId}")
    public Page<ChatMessageRes> getChatMessages(@PathVariable long chatRoomId, Pageable pageable) {

        return chatMessageService.getChatMessages(chatRoomId, pageable);
    }
}
