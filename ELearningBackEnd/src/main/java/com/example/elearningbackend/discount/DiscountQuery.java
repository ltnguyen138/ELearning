package com.example.elearningbackend.discount;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Getter
@Setter
public class DiscountQuery {

    private String keyword;

    private Long courseId;

    private boolean isManager;

    private Boolean activated;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private LocalDate validFrom;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private LocalDate validTo;

    private String type;

    public Predicate toPredicate() {
        QDiscount qDiscount = QDiscount.discount1;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qDiscount.isDeleted.isFalse());
        if (keyword != null) {
            builder.and(qDiscount.code.containsIgnoreCase(keyword));
        }
        if (courseId != null) {
            builder.and(qDiscount.course.id.eq(courseId));
        }
        if (validFrom != null) {
            builder.and(qDiscount.validFrom.goe(validFrom));
        }
        if (validTo != null) {
            builder.and(qDiscount.validTo.loe(validTo));
        }
        if (!isManager) {
            builder.and(qDiscount.isActivated.isTrue());
        }

        if ( activated != null && isManager) {
            builder.and(qDiscount.isActivated.eq(activated));
        }
        if(type != null){
            builder.and(qDiscount.type.eq(type));
        }
        return builder.getValue();
    }
}
