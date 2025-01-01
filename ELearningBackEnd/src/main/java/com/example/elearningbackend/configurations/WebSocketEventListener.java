package com.example.elearningbackend.configurations;

import com.example.elearningbackend.chat.ChatRoom;
import com.example.elearningbackend.chat.ChatRoomService;
import com.example.elearningbackend.chat.message.ChatMessage;
import com.example.elearningbackend.chat.message.ChatMessageMapper;
import com.example.elearningbackend.chat.message.ChatMessageRes;
import com.example.elearningbackend.chat.message.ChatMessageService;
import com.example.elearningbackend.user.UserRepository;
import com.example.elearningbackend.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;
    private final JwtTokenUtil jwtTokenUtil;
    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;
    private final UserRepository userRepository;
    private final ChatMessageMapper chatMessageMapper;
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {

        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        List<String> authHeaders = headerAccessor.getNativeHeader("Authorization");
        if (authHeaders != null && !authHeaders.isEmpty()) {
            String authHeader = authHeaders.get(0);

            if (authHeader.startsWith("Bearer ")) {
                String jwtToken = authHeader.substring(7);
                if(jwtToken == null || jwtToken.isEmpty()){
                    return;
                }
                long userId = jwtTokenUtil.extractUserId(jwtToken);

                System.out.println("userId: " + userId);
                headerAccessor.getSessionAttributes().put("userId", userId);
            }
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {

        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
        System.out.println("userId diss: " + userId);

        if (userId != null) {

            ChatRoom chatRoom = chatRoomService.getChatRoomByUserId(userId);
            if(chatRoom.isActive() ){
                if(chatRoom.getAdminId() != null){
                    ChatMessage message = ChatMessage.builder()
                            .chatRoom(chatRoom)
                            .sender(userRepository.findById(userId).orElse(null))
                            .receiver(userRepository.findById(chatRoom.getAdminId()).orElse(null))
                            .message("Chat ended")
                            .type("END")
                            .timestamp(java.time.LocalDateTime.now())
                            .read(false)
                            .build();
                    chatMessageService.save(message);
                    ChatMessageRes chatMessageRes = chatMessageMapper.toChatMessageRes(message);
                    messagingTemplate.convertAndSendToUser(String.valueOf(message.getReceiver().getId()), "/message", chatMessageRes);
                }

            }

            sendMessageEndChatRoomByAdmin(userId);
            ChatRoom deactivatedChatRoom = chatRoomService.deactivateChatRoom(userId);
            messagingTemplate.convertAndSend("/user/topic/chat", deactivatedChatRoom);
        }

    }

    private void sendMessageEndChatRoomByAdmin(long userId){

        List<ChatRoom> chatRooms = chatRoomService.getChatRoomByAdminId(userId);
        for(ChatRoom chatRoom : chatRooms){
            if(chatRoom.isActive() && chatRoom.getAdminId() != null){

                ChatMessage message = ChatMessage.builder()
                        .chatRoom(chatRoom)
                        .sender(userRepository.findById(chatRoom.getAdminId()).orElse(null))
                        .receiver(userRepository.findById(chatRoom.getUserId()).orElse(null))
                        .message("Chat ended")
                        .type("END")
                        .timestamp(java.time.LocalDateTime.now())
                        .read(false)
                        .build();
                chatMessageService.save(message);
                ChatMessageRes chatMessageRes = chatMessageMapper.toChatMessageRes(message);
                messagingTemplate.convertAndSendToUser(String.valueOf(message.getReceiver().getId()), "/message", chatMessageRes);
                ChatRoom deactivatedChatRoom = chatRoomService.deactivateChatRoom(chatRoom);
                messagingTemplate.convertAndSend("/user/topic/chat", deactivatedChatRoom);
            }

        }
    }
}
