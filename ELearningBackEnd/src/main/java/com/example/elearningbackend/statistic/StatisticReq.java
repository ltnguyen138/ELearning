package com.example.elearningbackend.statistic;

import com.example.elearningbackend.order.OrderStatus;
import com.example.elearningbackend.order.QOrder;
import com.example.elearningbackend.order.detail.QOrderDetail;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StatisticReq {

    private TimeLineType timeLineType;

    private StatisticType statisticType;


    private String startDate;


    private String endDate;

    private Long courseId;

    private Long categoryId;

    private boolean refunded;

    private Long instructorId;

    Predicate toOrderPredicate() {

        QOrder qOrder = QOrder.order;
        BooleanBuilder builder = new BooleanBuilder();


        if(startDate != null && endDate != null){
            LocalDateTime startDateTime = buildStartDateTime();
            LocalDateTime endDateTime = buildEndDateTime();
            builder.and(qOrder.createdTime.goe(startDateTime))
                    .and(qOrder.createdTime.lt(endDateTime));
        }
        if(refunded){
            builder.and(qOrder.status.eq(OrderStatus.REFUNDED.name()));
        }
        if(!refunded){
            builder.and(qOrder.status.eq(OrderStatus.COMPLETED.name()));
        }
        if(instructorId != null){
            builder.and(qOrder.orderDetails.any().course.instructor.id.eq(instructorId));
        }

        return builder.getValue();
    }

    Predicate toOrderDetailPredicate() {

        QOrderDetail qOrderDetail = QOrderDetail.orderDetail;
        BooleanBuilder builder = new BooleanBuilder();



        if(startDate != null && endDate != null){
            LocalDateTime startDateTime = buildStartDateTime();
            LocalDateTime endDateTime = buildEndDateTime();
            builder.and(qOrderDetail.order.createdTime.goe(startDateTime))
                    .and(qOrderDetail.order.createdTime.lt(endDateTime));
        }
        if (courseId != null) {
            builder.and(qOrderDetail.course.id.eq(courseId));
        }
        if (categoryId != null) {
            builder.and(qOrderDetail.course.category.id.eq(categoryId));
        }
        if(instructorId != null){
            builder.and(qOrderDetail.course.instructor.id.eq(instructorId));
        }

        builder.and(qOrderDetail.refunded.isNotNull());
        builder.and(qOrderDetail.refunded.eq(refunded));


        return builder.getValue();
    }

    public LocalDateTime buildStartDateTime() {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        LocalDate startDate = LocalDate.parse(this.startDate, formatter);
        if(timeLineType.equals(TimeLineType.DAY)){
            return startDate.atStartOfDay();
        }else if(timeLineType.equals(TimeLineType.MONTH)){
            return startDate.withDayOfMonth(1).atStartOfDay();
        }else {
            return startDate.withDayOfYear(1).atStartOfDay();
        }
    }

    public LocalDateTime buildEndDateTime() {

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        LocalDate endDate = LocalDate.parse(this.endDate, formatter);
        if(timeLineType.equals(TimeLineType.DAY)){
            return endDate.atStartOfDay().plusDays(1);
        }else if(timeLineType.equals(TimeLineType.MONTH)){
            return endDate.withDayOfMonth(1).plusMonths(1).atStartOfDay();
        }else {
            return endDate.withDayOfYear(1).plusYears(1).atStartOfDay();
        }
    }
}
