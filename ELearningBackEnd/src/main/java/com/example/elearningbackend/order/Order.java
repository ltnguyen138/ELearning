package com.example.elearningbackend.order;

import com.example.elearningbackend.common.FullEntity;
import com.example.elearningbackend.discount.Discount;
import com.example.elearningbackend.order.detail.OrderDetail;
import com.example.elearningbackend.order.track.OrderTrack;
import com.example.elearningbackend.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order extends FullEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @OneToOne
    @JoinColumn(name = "discount_id")
    private Discount discount;

    private double totalAmount;

    private double discountAmount;

    private double finalAmount;

    private String status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id DESC")
    private Set<OrderDetail> orderDetails = new HashSet<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id DESC")
    private Set<OrderTrack> orderTracks = new HashSet<>();

    private String paymentMethod;

    private String paymentId;
}
