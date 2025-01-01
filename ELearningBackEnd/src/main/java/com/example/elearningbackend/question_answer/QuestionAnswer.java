package com.example.elearningbackend.question_answer;

import com.example.elearningbackend.common.FullEntity;
import com.example.elearningbackend.course.Course;
import com.example.elearningbackend.lecture.Lecture;
import com.example.elearningbackend.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "question_answers")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionAnswer extends FullEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "lecture_id")
    private Lecture lecture;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private QuestionAnswer question;

    @OneToMany(mappedBy = "question", orphanRemoval = true, cascade = CascadeType.ALL)
    @OrderBy("createdTime asc ")
    private Set<QuestionAnswer> answers = new HashSet<>();

}
