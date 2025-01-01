package com.example.elearningbackend.course;

import com.example.elearningbackend.category.CategoryRes;
import com.example.elearningbackend.user.UserRes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class CourseRes implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String name;

    private String alias;

    private CategoryRes category;

    private String description;

    private String skillLevel;

    private double price;

    private String image;

    private UserRes instructor;

    private boolean isDeleted;

    private boolean isActivated;

    private String createdTime;

    private String updatedTime;

    private int purchasedCount;

    private int averageRating;

    private int ratingCount;

    private boolean moderationRequested;

    private String approvalStatus;
}
