package com.example.elearningbackend.question_answer;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class QuestionAnswerReq {

    private String content;

    private long lectureId;

    private long userId;

    private Long questionId;

    private boolean isActivated;
}
