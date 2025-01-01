package com.example.elearningbackend.order;

import com.example.elearningbackend.order.detail.CartItemReq;
import com.example.elearningbackend.order.track.OrderTrackReq;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class OrderReq {

    private long userId;

    private Long discountId;

    private double totalAmount;

    private double discountAmount;

    private double finalAmount;

    private String status;

    private boolean isActivated;

    private Set<CartItemReq> cartItems = new HashSet<>();

    private OrderTrackReq orderTrackReq;

    private String paymentId;
}
