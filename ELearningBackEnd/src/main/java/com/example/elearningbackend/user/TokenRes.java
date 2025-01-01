package com.example.elearningbackend.user;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenRes {

    private String token;
    private boolean verified;
}
