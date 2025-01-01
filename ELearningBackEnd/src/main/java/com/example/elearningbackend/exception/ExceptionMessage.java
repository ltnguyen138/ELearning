package com.example.elearningbackend.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@AllArgsConstructor
public class ExceptionMessage {
    private int statusCode;
    private LocalDateTime timeStamp;
    private String message;
    private String description;
}
