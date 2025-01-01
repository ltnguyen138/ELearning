package com.example.elearningbackend.paypal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentPaypalReq {

    private Double total;
    private String description;

}
