package com.example.elearningbackend.note;

import com.example.elearningbackend.lecture.Lecture;
import com.example.elearningbackend.user.user_course.UserCourse;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notes")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String title;

    private double duration;

    @ManyToOne
    @JoinColumn(name = "user_course_id")
    private UserCourse userCourse;

    @ManyToOne
    @JoinColumn(name = "lecture_id")
    private Lecture lecture;

    private LocalDateTime createdAt;

}
