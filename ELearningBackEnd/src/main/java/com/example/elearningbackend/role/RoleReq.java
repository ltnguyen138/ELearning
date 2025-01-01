package com.example.elearningbackend.role;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RoleReq {

    @NotBlank(message = "name is required")
    private String name;
}
