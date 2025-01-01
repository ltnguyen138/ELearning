package com.example.elearningbackend.chat.message;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageReq {

    private long chatRoomId;
    private long senderId;
    private long receiverId;
    private String message;
    private String type;
}
