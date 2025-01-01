package com.example.elearningbackend.user.earning;

import com.example.elearningbackend.statistic.StatisticRes;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EarningRes {

    private String startDate;

    private String endDate;

    private List<StatisticRes> statistics;

    private Double totalEarning;

    private Double globalDiscount;

    private Double courseDiscount;

    private Double finalEarning;

    private Double fee;

}
