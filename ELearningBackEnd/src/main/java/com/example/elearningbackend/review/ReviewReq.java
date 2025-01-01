package com.example.elearningbackend.review;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReviewReq {

    private String comment;

    private int rating;

    private long courseId;

    private long userId;

    private boolean isActivated;
}
