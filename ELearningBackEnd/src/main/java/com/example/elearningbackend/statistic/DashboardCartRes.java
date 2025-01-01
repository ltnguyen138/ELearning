package com.example.elearningbackend.statistic;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardCartRes {

    private double currentValue;

    private double previousValue;

    private double ratio;

    private double totalValue;
}
