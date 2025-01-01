package com.example.elearningbackend.order;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderQuery {

    private String keyword;

    private String status;

    private boolean isAdmin;

    private Long userId;

    private Boolean isActivated;
    public Predicate toPredicate() {

        QOrder qOrder = QOrder.order;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qOrder.isDeleted.isFalse());
        if (keyword != null) {
            builder.and(qOrder.user.email.containsIgnoreCase(keyword)
                    .or(qOrder.user.fullName.containsIgnoreCase(keyword))
                    .or(qOrder.id.stringValue().containsIgnoreCase(keyword)));
        }
        if (status != null) {
            builder.and(qOrder.status.eq(status));
        }
        if(userId != null) {
            builder.and(qOrder.user.id.eq(userId));
        }
        if (!isAdmin) {
            builder.and(qOrder.isActivated.isTrue());
        }

        if(isAdmin && isActivated != null) {
            builder.and(qOrder.isActivated.eq(isActivated));
        }
        return builder.getValue();
    }
}
