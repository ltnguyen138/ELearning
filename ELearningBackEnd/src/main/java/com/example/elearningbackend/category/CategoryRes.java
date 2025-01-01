package com.example.elearningbackend.category;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
public class CategoryRes implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String name;

    private String alias;

    private boolean isActivated;

    private boolean isDeleted;

    private String createdTime;

    private String updatedTime;

    private Boolean temporary;
}
