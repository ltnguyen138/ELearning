package com.example.elearningbackend.order.detail;

import com.example.elearningbackend.course.CourseShortRes;
import com.example.elearningbackend.discount.DiscountRes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OrderDetailRes {

    private long id;

    private CourseShortRes course;

    private DiscountRes discount;

    private double price;

    private double discountPrice;

    private double finalPrice;

    private Boolean refunded;
}
