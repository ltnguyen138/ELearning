package com.example.elearningbackend.discount;

import com.example.elearningbackend.course.CourseRes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class DiscountRes {

    private long id;

    private String code;

    private String type;

    private float discount;

    private CourseRes course;

    private String validFrom;

    private String validTo;

    private Integer quantity;

    private boolean isDeleted;

    private boolean isActivated;

    private LocalDateTime createdTime;

    private LocalDateTime updatedTime;
}
