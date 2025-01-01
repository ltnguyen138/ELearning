package com.example.elearningbackend.user.earning;

import com.example.elearningbackend.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payout_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayoutHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private double amount;

    private String payoutId;

    private LocalDateTime payoutDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private double totalEarning;

    private double globalDiscount;

    private double courseDiscount;

    private double fee;
}
