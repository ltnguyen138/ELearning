package com.example.elearningbackend.order.track;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class OrderTrackRes {

    private long id;

    private String status;

    private String note;

    private String updateTime;
}
