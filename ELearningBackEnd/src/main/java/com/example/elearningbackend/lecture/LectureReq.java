package com.example.elearningbackend.lecture;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LectureReq {

    private String name;

    private long chapterId;

    private boolean isPreview;
}
