package com.example.elearningbackend.statistic;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticRes {


    private String identifier;

    private Double totalPrice;

    private Double finalPrice;

    private Double globalDiscount;

    private Double courseDiscount;

    private Double countUsers;

    private Double countOrders;

    private Double countCourse;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof StatisticRes)) return false;

        StatisticRes statisticRes = (StatisticRes) o;

        return getIdentifier().equals(statisticRes.getIdentifier());
    }

    @Override
    public int hashCode() {
        return getIdentifier().hashCode();
    }
}
