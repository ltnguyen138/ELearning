package com.example.elearningbackend.order.track;

import com.example.elearningbackend.order.Order;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "order_tracks")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name="order_id")
    private Order order;

    private String status;

    private String note;

    private LocalDateTime updateTime;
}
