package com.example.elearningbackend.statistic.learner_statistic;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearnerStatisticRes {

    private long totalLearner;

    private long totalLearnerComplete;

    private long avgRate;

    private List<LearnerCompleteLectureRes> learnerCompleteLectureRes = new ArrayList<>();


}
