package com.example.elearningbackend.discount;

import com.example.elearningbackend.course.CourseShortRes;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplyDiscountRes {

    private CourseShortRes course;

    private String code;

    private double price;

    private double discountPrice;

    private double finalPrice;
}
