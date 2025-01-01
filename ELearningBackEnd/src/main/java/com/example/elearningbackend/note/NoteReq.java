package com.example.elearningbackend.note;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteReq {

    private String title;

    private double duration;

    private String courseAlias;

    private long lectureId;
}
