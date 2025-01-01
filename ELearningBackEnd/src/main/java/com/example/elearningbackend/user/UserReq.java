package com.example.elearningbackend.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class UserReq {

    private String email;

    private String fullName;

    @Pattern(regexp = "^0[0-9]*$", message = "Phone number id must be a number")
    private String phoneNumber;

    private String address;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDate;

    private String headline;

    private String bio;

    private Long roleId;

    private String title;
}
