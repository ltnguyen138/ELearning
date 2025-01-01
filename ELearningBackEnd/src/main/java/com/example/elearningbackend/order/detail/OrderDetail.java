package com.example.elearningbackend.order.detail;

import com.example.elearningbackend.course.Course;
import com.example.elearningbackend.discount.Discount;
import com.example.elearningbackend.order.Order;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="order_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name="order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name="course_id")
    private Course course;

    private double price;

    @ManyToOne
    @JoinColumn(name="discount_id")
    private Discount discount;

    private double discountPrice;

    private double finalPrice;

    private Boolean refunded;
}
