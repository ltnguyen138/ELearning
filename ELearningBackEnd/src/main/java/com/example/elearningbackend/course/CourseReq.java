package com.example.elearningbackend.course;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CourseReq {

    @NotBlank(message = "name is required")
    private String name;

    @NotBlank(message = "description is required")
    private String description;

    @NotBlank(message = "category is required")
    private long categoryId;

    @NotBlank(message = "Skill Level is required")
    private String skillLevel;

    @NotBlank(message = "price is required")
    private double price;

    private long instructorId;

    private String categoryName;

}
