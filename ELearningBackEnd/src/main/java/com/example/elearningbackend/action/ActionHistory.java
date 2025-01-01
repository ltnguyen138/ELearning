package com.example.elearningbackend.action;

import com.example.elearningbackend.common.EntityNameEnum;
import com.example.elearningbackend.history.action.ActionType;
import com.example.elearningbackend.user.User;
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
public class ActionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntityNameEnum entityName;

    @Column(nullable = false)
    private long entityId;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private User admin;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private String reason;
}
