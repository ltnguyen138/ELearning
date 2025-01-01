package com.example.elearningbackend.notification;

import com.example.elearningbackend.action.ActionHistory;
import com.example.elearningbackend.course.Course;
import com.example.elearningbackend.role.UserRole;
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
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String title;

    private String roleNotification;

    @ManyToOne
    @JoinColumn(name="course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime timestamp;

    private boolean read;

    @ManyToOne
    @JoinColumn(name = "action_id")
    private ActionHistory actionHistory;
}
