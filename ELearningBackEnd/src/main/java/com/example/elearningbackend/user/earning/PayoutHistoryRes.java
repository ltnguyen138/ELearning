package com.example.elearningbackend.user.earning;

import com.example.elearningbackend.user.UserShortRes;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PayoutHistoryRes {

    private long id;

    private double amount;

    private String payoutId;

    @JsonFormat(pattern = "dd-MM-yyyy HH:mm:ss")
    private String payoutDate;

    private UserShortRes user;

    private double totalEarning;

    private double globalDiscount;

    private double courseDiscount;

    private double fee;
}
