package com.example.elearningbackend.statistic.learner_statistic;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerCompleteLectureRes {

    private String lectureName;

    private String lectureId;

    private long totalLearner;
}
