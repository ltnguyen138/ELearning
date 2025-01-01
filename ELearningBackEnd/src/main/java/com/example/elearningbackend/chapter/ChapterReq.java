package com.example.elearningbackend.chapter;

import com.example.elearningbackend.lecture.LectureReq;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ChapterReq {

    private String name;

    private long courseId;

    private List<LectureReq> lectures = new ArrayList<>();

}
