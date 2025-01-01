package com.example.elearningbackend.order.track;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class OrderTrackReq {

    private String status;

    private String note;
}
