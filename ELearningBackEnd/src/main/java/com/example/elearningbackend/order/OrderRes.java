package com.example.elearningbackend.order;

import com.example.elearningbackend.discount.DiscountRes;
import com.example.elearningbackend.order.detail.OrderDetailRes;
import com.example.elearningbackend.order.track.OrderTrackRes;
import com.example.elearningbackend.user.UserRes;
import com.example.elearningbackend.user.UserShortRes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class OrderRes {

    private long id;

    private UserShortRes user;

    private DiscountRes discount;

    private double totalAmount;

    private double discountAmount;

    private double finalAmount;

    private String status;

    private Set<OrderDetailRes> orderDetails = new HashSet<>();

    private Set<OrderTrackRes> orderTracks = new HashSet<>();

    private boolean isDeleted;

    private boolean isActivated;

    private String createdTime;

    private String updatedTime;

    private String paymentId;
}
