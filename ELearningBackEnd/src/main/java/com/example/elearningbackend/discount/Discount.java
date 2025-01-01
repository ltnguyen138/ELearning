package com.example.elearningbackend.discount;

import com.example.elearningbackend.common.FullEntity;
import com.example.elearningbackend.course.Course;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "discounts")
@Getter
@Setter

public class Discount extends FullEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String code;

    private String type;

    @Column
    private double discount;

    @Column(nullable = false)
    private LocalDate validFrom;

    @Column(nullable = false)
    private LocalDate validTo;

    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
}
