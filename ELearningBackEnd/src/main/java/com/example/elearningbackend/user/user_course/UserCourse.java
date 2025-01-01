package com.example.elearningbackend.user.user_course;

import com.example.elearningbackend.course.Course;
import com.example.elearningbackend.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="user_courses")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name="course_id")
    private Course course;

    private Long currentLectureId;

    @Column
    private LocalDateTime updatedTime;

    @OneToMany(mappedBy = "userCourse", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserCourseLecture> lectures = new ArrayList<>();

    @PreUpdate
    public void preUpdate() {
        updatedTime = LocalDateTime.now();
    }
}
