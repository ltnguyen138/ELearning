package com.example.elearningbackend.user;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserQuery {

    private String keyword;
    private Boolean activated;
    private String role;

    public Predicate toPredicate() {
        QUser qUser = QUser.user;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qUser.isDeleted.isFalse());
        if (keyword != null) {
            builder.and(qUser.email.containsIgnoreCase(keyword)
                    .or(qUser.fullName.containsIgnoreCase(keyword))
                    .or(qUser.id.stringValue().containsIgnoreCase(keyword)));
        }
        if(activated != null){
            builder.and(qUser.isActivated.eq(activated));
        }
        if(role != null){
            builder.and(qUser.role.name.eq(role));
        }
        return builder.getValue();
    }
}
