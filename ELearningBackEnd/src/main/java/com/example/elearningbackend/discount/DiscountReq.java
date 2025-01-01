package com.example.elearningbackend.discount;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class DiscountReq {

    private String code;

    private String type;

    private float discount;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate validFrom;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate validTo;

    private Integer quantity;

    private Long courseId;

    private boolean isActivated;
}
