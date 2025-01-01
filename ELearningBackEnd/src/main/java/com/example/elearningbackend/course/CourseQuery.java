package com.example.elearningbackend.course;

import com.example.elearningbackend.history.approval.ApprovalStatus;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseQuery {

    private String Keyword;

    private Long categoryId;

    private String alias;

    private Long instructorId;

    private String skillLevel;

    private Double minPrice;

    private Double maxPrice;

    private Boolean activated;

    private boolean isManager;

    private Integer averageRating;

    private Boolean moderationRequested;

    private String approvalStatus;

    public Predicate toPredicate() {
        QCourse qCourse = QCourse.course;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qCourse.isDeleted.isFalse());
        if (Keyword != null) {
            builder.and(qCourse.name.containsIgnoreCase(Keyword)
                    .or(qCourse.description.containsIgnoreCase(Keyword))
                    .or(qCourse.instructor.fullName.containsIgnoreCase(Keyword))
                    .or(qCourse.instructor.email.containsIgnoreCase(Keyword))
            );
        }
        if (categoryId != null) {
            builder.and(qCourse.category.id.eq(categoryId));
        }
        if (alias != null) {
            builder.and(qCourse.category.alias.eq(alias));
        }
        if (instructorId != null) {
            builder.and(qCourse.instructor.id.eq(instructorId));
        }
        if (skillLevel != null) {
            builder.and(qCourse.skillLevel.eq(skillLevel));
        }
        if(minPrice != null) {
            builder.and(qCourse.price.goe(minPrice));
        }
        if(maxPrice != null) {
            builder.and(qCourse.price.loe(maxPrice));
        }
        if(!isManager) {
            builder.and(qCourse.isActivated.isTrue());
            builder.and(qCourse.approvalStatus.eq(ApprovalStatus.APPROVED.name()));
        }
        if(isManager && activated != null) {
            builder.and(qCourse.isActivated.eq(activated));
        }
        if(averageRating != null) {
            int rating = averageRating;
            builder.and(qCourse.averageRating.goe(rating));
        }
        if(moderationRequested != null) {
            builder.and(qCourse.moderationRequested.eq(moderationRequested));
        }
        if(approvalStatus != null) {
            builder.and(qCourse.approvalStatus.eq(approvalStatus));
        }

        return builder.getValue();
    }
}
