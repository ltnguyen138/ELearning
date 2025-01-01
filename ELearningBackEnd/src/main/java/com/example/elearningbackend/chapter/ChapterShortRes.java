package com.example.elearningbackend.chapter;

import com.example.elearningbackend.course.CourseShortRes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
public class ChapterShortRes implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private boolean isDeleted;

    private boolean isActivated;

    private CourseShortRes course;

}
