package com.example.elearningbackend.history.approval;

import com.example.elearningbackend.history.action.ActionType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ApprovalReq {

    private ActionType status;

    private String comment;

}
