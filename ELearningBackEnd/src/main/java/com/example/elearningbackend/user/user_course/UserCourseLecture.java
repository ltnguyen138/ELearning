package com.example.elearningbackend.user.user_course;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="user_course_lectures")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserCourseLecture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name="user_course_id")
    private UserCourse userCourse;

    @Column
    private long lectureId;

}
