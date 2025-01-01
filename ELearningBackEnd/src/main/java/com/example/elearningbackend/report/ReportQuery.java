package com.example.elearningbackend.report;

import com.example.elearningbackend.common.EntityNameEnum;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportQuery {

    private Long userId;
    private Long entityId;
    private String entityType;
    private String reason;
    private String status;
    public boolean checkNullQuery() {
        return userId == null && entityId == null && entityType == null && reason == null;
    }

    public Predicate toPredicate() {
        QReport qReport = QReport.report;
        BooleanBuilder builder = new BooleanBuilder();
        if (userId != null) {
            builder.and(qReport.user.id.eq(userId));
        }
        if (entityId != null) {
            builder.and(qReport.entityId.eq(entityId));
        }
        if (entityType != null) {
            builder.and(qReport.entityType.eq(EntityNameEnum.valueOf(entityType)));
        }
        if(reason != null) {
            builder.and(qReport.reason.containsIgnoreCase(reason));
        }
        if(status != null) {
            builder.and(qReport.status.eq(ReportStatus.valueOf(status)));
        }
        return builder.getValue();
    }
}
