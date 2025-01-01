package com.example.elearningbackend.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
public class UserShortRes implements Serializable {

    private static final long serialVersionUID = 1L;

    private long id;

    private String email;

    private String fullName;

    private String profilePicture;
}
