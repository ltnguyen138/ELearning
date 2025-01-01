package com.example.elearningbackend.history.action;

import com.example.elearningbackend.action.QActionHistory;
import com.example.elearningbackend.common.EntityNameEnum;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ActionQuery {

    private String entityName;
    private String type;
    private Long adminId;

    public boolean checkNullQuery() {
        return entityName == null && type == null && adminId == null;
    }

    public Predicate toPredicate() {
        QActionHistory qActionHistory = QActionHistory.actionHistory;
        BooleanBuilder builder = new BooleanBuilder();
        if (entityName != null) {
            builder.and(qActionHistory.entityName.eq(EntityNameEnum.valueOf(entityName)));
        }
        if (type != null) {
            builder.and(qActionHistory.type.eq(ActionType.valueOf(type)));
        }
        if (adminId != null) {
            builder.and(qActionHistory.admin.id.eq(adminId));
        }
        return builder.getValue();
    }
}
