package com.example.elearningbackend.note;

import com.example.elearningbackend.lecture.LectureShortRes;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteRes {

    private long id;

    private String title;

    private double duration;

    private LectureShortRes lecture;

}
