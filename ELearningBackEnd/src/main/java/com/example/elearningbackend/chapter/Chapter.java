package com.example.elearningbackend.chapter;

import com.example.elearningbackend.common.FullEntity;
import com.example.elearningbackend.course.Course;
import com.example.elearningbackend.lecture.Lecture;
import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "chapters")
@Data
public class Chapter extends FullEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @OneToMany(mappedBy = "chapter", cascade = CascadeType.ALL)
    private Set<Lecture> lectures = new HashSet<>();

    private int orderNumber;
}
