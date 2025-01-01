package com.example.elearningbackend.paypal;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayoutPaypalReq {

    private String email;

    private Double amount;
}
