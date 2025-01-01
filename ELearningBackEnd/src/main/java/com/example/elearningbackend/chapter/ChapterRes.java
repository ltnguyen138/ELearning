package com.example.elearningbackend.chapter;

import com.example.elearningbackend.course.CourseShortRes;
import com.example.elearningbackend.lecture.LectureRes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class ChapterRes implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private boolean isDeleted;

    private boolean isActivated;

    private LocalDateTime createdTime;

    private LocalDateTime updatedTime;

    private CourseShortRes course;

    private Integer orderNumber;
}
