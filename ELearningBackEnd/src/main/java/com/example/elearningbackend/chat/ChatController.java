package com.example.elearningbackend.chat;

import com.example.elearningbackend.chat.message.*;
import com.example.elearningbackend.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatRoomService chatRoomService;
    private final ChatMessageService chatMessageService;
    private final ChatMessageMapper chatMessageMapper;

    @MessageMapping("/startChat.user")
    public void userStartChat(@Payload long userId) {

        ChatRoom chatRoom = chatRoomService.getChatRoomByUserId(userId);
        ChatRoom activeChatRoom = chatRoomService.activeChatRoom(chatRoom);
        System.out.println("activeChatRoom = " + activeChatRoom.getUserId());
        messagingTemplate.convertAndSend("/user/topic/chat", activeChatRoom);
    }

    @MessageMapping("/endChat.user")
    public void userEndChat(@Payload long userId) {

        ChatRoom deactivateChatRoom = chatRoomService.deactivateChatRoom(userId);
        messagingTemplate.convertAndSend("/user/topic/chat", deactivateChatRoom);

    }

    @MessageMapping("startChat.admin")
    public void adminStartChat(@Payload ChatRoom chatRoom) {

        ChatRoom activeChatRoom = chatRoomService.activeChatRoom(chatRoom);
        messagingTemplate.convertAndSend("/user/topic/chat", activeChatRoom);
    }

    @MessageMapping("/send.message")
    public void sendMessage(@Payload ChatMessageReq chatMessageReq) {

        ChatMessage chatMessage = chatMessageService.save(chatMessageReq);
        if(chatMessageReq.getType().equals(ChatMessageType.START.name())){
            if(chatMessage.getSender().getId() == chatMessage.getChatRoom().getAdminId()){
                messagingTemplate.convertAndSend("/user/topic/chat", chatMessage.getChatRoom());
            }
        }
        if(chatMessageReq.getType().equals(ChatMessageType.END.name())){
            chatRoomService.deactivateChatRoom(chatMessageReq.getSenderId());
        }
        ChatMessageRes chatMessageRes = chatMessageMapper.toChatMessageRes(chatMessage);
        messagingTemplate.convertAndSendToUser(String.valueOf(chatMessageReq.getReceiverId()), "/message", chatMessageRes);
    }


}
