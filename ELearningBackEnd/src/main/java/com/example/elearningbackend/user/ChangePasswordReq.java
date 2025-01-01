package com.example.elearningbackend.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordReq {

    private String oldPassword;

    private String newPassword;
}
