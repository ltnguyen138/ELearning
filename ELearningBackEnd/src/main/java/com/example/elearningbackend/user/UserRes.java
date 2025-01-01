package com.example.elearningbackend.user;

import com.example.elearningbackend.role.Role;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class UserRes implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String email;

    private String fullName;

    private String phoneNumber;

    private String address;

    private String birthDate;

    private String bio;

    private String profilePicture;

    private boolean isDeleted;

    private boolean isActivated;

    private String createdTime;

    private String updatedTime;

    private Role role;

    private String title;
}
