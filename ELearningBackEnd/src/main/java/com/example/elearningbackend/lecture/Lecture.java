package com.example.elearningbackend.lecture;

import com.example.elearningbackend.chapter.Chapter;
import com.example.elearningbackend.common.FullEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lectures")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Lecture extends FullEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;


    private String videoUrl;


    private String resourceUrl;

    @ManyToOne
    @JoinColumn(name = "chapter_id")
    private Chapter chapter;

    @Column
    private boolean isPreview;

    private String approvalStatus;

    private int orderNumber;

    private Float videoDuration;

    private long countLearnerComplete ;
}
