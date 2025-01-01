package com.example.elearningbackend.report;

import com.example.elearningbackend.common.EntityNameEnum;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReportReq {

    @NotBlank
    private EntityNameEnum entityType;

    private long entityId;

    private long userId;

    @NotBlank
    private String reason;

}
