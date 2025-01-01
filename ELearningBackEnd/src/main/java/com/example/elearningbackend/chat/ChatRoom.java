package com.example.elearningbackend.chat;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private long userId;

    private Long adminId;

    private boolean active;

    private LocalDateTime startedAt;

    private boolean adminRead;

    private boolean userRead;

}
