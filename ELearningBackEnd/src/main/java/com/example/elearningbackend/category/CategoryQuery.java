package com.example.elearningbackend.category;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter

public class CategoryQuery {

    private String keyword;
    private boolean isManager;
    private Boolean isActivated;
    public Predicate toPredicateForAdmin() {
        QCategory qCategory = QCategory.category;
        BooleanBuilder builder = new BooleanBuilder();
        if (keyword != null) {
            builder.and(qCategory.name.containsIgnoreCase(keyword));
        }
        builder.and(qCategory.isDeleted.isFalse());
        return builder.getValue();
    }

    public Predicate toPredicateForCustomer() {
        QCategory qCategory = QCategory.category;
        BooleanBuilder builder = new BooleanBuilder();
        if (keyword != null) {
            builder.and(qCategory.name.containsIgnoreCase(keyword));
        }
        builder.and(qCategory.isDeleted.isFalse());
        builder.and(qCategory.isActivated.isTrue());
        return builder.getValue();
    }

    public Predicate toPredicate(){
        QCategory qCategory = QCategory.category;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qCategory.isDeleted.isFalse());
        builder.and(qCategory.temporary.isFalse());
        if (keyword != null) {
            builder.and(qCategory.name.containsIgnoreCase(keyword));
        }
        if(!isManager){
            builder.and(qCategory.isActivated.isTrue());
        }
        if(isManager && isActivated != null){
            builder.and(qCategory.isActivated.eq(isActivated));
        }
        return builder.getValue();
    }

    @Override
    public String toString() {
        return "CategoryQuery{" +
                "keyword='" + keyword +
                ", isManager=" + isManager +
                ", isActivated=" + isActivated +
                '}';
    }
}
