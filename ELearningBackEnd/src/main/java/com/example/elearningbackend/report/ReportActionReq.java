package com.example.elearningbackend.report;

import com.example.elearningbackend.common.EntityNameEnum;
import com.example.elearningbackend.history.action.ActionType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class ReportActionReq {

    private ActionType actionType;
    private EntityNameEnum entityType;
    private String reason;
    private long entityId;
    private Set<Long> ids = new HashSet<>();

}
