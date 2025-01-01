package com.example.elearningbackend.report;

import com.example.elearningbackend.action.ActionHistory;
import com.example.elearningbackend.common.EntityNameEnum;
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
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EntityNameEnum entityType;

    @Column(nullable = false)
    private long entityId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String reason;

    @Enumerated(EnumType.STRING)
    private ReportStatus status;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "action_id")
    private ActionHistory actionHistory;

}
