package com.example.elearningbackend.vnpay;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class vnpayPaymentRes {

    private String status;
    private String message;
    private String url;
}
