package com.example.elearningbackend.chat.message;

import com.example.elearningbackend.chat.ChatRoom;
import com.example.elearningbackend.user.UserShortRes;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessageRes {

    private long id;
    private ChatRoom chatRoom;
    private UserShortRes sender;
    private UserShortRes receiver;
    private String message;
    private String timestamp;
    private String type;
    private boolean read;

}
