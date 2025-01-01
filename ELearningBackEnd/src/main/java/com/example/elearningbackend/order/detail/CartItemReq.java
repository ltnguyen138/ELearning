package com.example.elearningbackend.order.detail;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CartItemReq {

    private long courseId;

    private String discountCode;
}
