package com.example.elearningbackend.user;

import lombok.Data;

@Data
public class ResetPasswordReq {

    private String token;
    private String password;
}
