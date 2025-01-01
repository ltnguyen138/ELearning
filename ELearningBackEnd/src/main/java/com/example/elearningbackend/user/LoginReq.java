package com.example.elearningbackend.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LoginReq {

    private String email;

    private String password;
}
