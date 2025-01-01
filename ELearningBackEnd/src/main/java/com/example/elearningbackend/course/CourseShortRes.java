package com.example.elearningbackend.course;

import com.example.elearningbackend.category.CategoryRes;
import com.example.elearningbackend.user.UserShortRes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
public class CourseShortRes implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String name;

    private String alias;

    private String approvalStatus;

    private boolean isDeleted;

    private String image;

    private CategoryRes category;

    private UserShortRes instructor;
}
