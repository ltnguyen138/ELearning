package com.example.elearningbackend.exchangerate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "exchangerates")
@Getter
@Setter
public class Exchangerate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private double value;

    private LocalDate date;
}
