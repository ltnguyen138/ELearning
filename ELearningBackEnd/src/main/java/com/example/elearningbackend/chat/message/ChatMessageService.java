package com.example.elearningbackend.chat.message;

import com.example.elearningbackend.chat.ChatRoom;
import com.example.elearningbackend.chat.ChatRoomRepository;
import com.example.elearningbackend.chat.ChatRoomService;
import com.example.elearningbackend.exception.ResourceNotFoundException;
import com.example.elearningbackend.user.User;
import com.example.elearningbackend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;
    private final ChatMessageMapper chatMessageMapper;

    public ChatMessage save(ChatMessageReq chatMessageReq) {

        ChatRoom chatRoom = chatRoomRepository.findById(chatMessageReq.getChatRoomId()).orElseThrow(() -> new ResourceNotFoundException("Phòng chat không tồn tại"));
        User sender = userRepository.findById(chatMessageReq.getSenderId()).orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));
        User receiver = userRepository.findById(chatMessageReq.getReceiverId()).orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        if(chatMessageReq.getType().equals(ChatMessageType.START.name())){
            chatRoom.setAdminId(sender.getId());
            chatRoom.setActive(true);
            chatRoomRepository.save(chatRoom);
        }

        ChatMessage chatMessage = ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .receiver(receiver)
                .message(chatMessageReq.getMessage())
                .timestamp(LocalDateTime.now())
                .type(chatMessageReq.getType())
                .read(false)
                .build();
        if(receiver.getId() == chatRoom.getUserId()){
            chatMessage.setRead(true);
        }
        return chatMessageRepository.save(chatMessage);
    }

    public ChatMessage save(ChatMessage chatMessage) {
        return chatMessageRepository.save(chatMessage);
    }

    public Page<ChatMessageRes> getChatMessages(long chatRoomId, Pageable pageable) {

        Page<ChatMessage> chatMessages = chatMessageRepository.findAllByChatRoomIdOrderByTimestampDesc(chatRoomId, pageable);
        return chatMessages.map(chatMessageMapper::toChatMessageRes);
    }

    public void readMessages(long messageId) {

        ChatMessage chatMessage = chatMessageRepository.findById(messageId).orElseThrow(() -> new ResourceNotFoundException("Tin nhắn không tồn tại"));
        chatMessage.setRead(true);
        chatMessageRepository.save(chatMessage);
    }

}
