package com.example.elearningbackend.order;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefundReq {

    private long orderDetailId;

    private long courseId;

    private Long discountId;

    private String reason;

    private double totalAmount;

    private double discountAmount;

    private double finalAmount;
}
