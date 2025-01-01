package com.example.elearningbackend.review;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewQuery {

    private Integer rating;
    private boolean isManager;
    private Boolean isActivated;
    private Long courseId;
    private String courseName;
    private String comment;

    public Predicate toPredicate() {

        QReview review = QReview.review;

        BooleanBuilder builder = new BooleanBuilder();
        builder.and(review.isDeleted.isFalse());

        if (rating != null) {
            builder.and(review.rating.eq((int) rating));
        }
        if (courseId != null) {
            builder.and(review.course.id.eq(courseId));
        }
        if (!isManager) {
            builder.and(review.isActivated.isTrue());
        }
        if(isManager && isActivated != null) {
            builder.and(review.isActivated.eq(isActivated));
        }
        if (courseName != null) {
            builder.and(review.course.name.containsIgnoreCase(courseName));
        }
        if (comment != null) {
            builder.and(review.comment.containsIgnoreCase(comment));
        }
        return  builder.getValue();

    }
}
