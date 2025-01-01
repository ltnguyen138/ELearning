package com.example.elearningbackend.chapter;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChapterQuery {

    @Min(1)
    private long courseId;
    private boolean isManager;
    private Boolean isActivated;

    public Predicate toPredicate(){

        QChapter qChapter = QChapter.chapter;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qChapter.isDeleted.isFalse());
        builder.and(qChapter.course.id.eq(courseId));
        if(!isManager){
            builder
                    .and(qChapter.course.isDeleted.isFalse())
                    .and(qChapter.course.isActivated.isTrue())
                    .and(qChapter.lectures.isNotEmpty());
        }
        if(isManager && isActivated != null){
            builder.and(qChapter.isActivated.eq(isActivated));
        }
        return builder.getValue();
    }

    public Predicate toPredicateForLearner(){

        QChapter qChapter = QChapter.chapter;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qChapter.isDeleted.isFalse());
        builder.and(qChapter.isActivated.isTrue());
        return builder.getValue();
    }

    @Override
    public String toString() {
        return "ChapterQuery{" +
                "courseId=" + courseId +
                ", isManager=" + isManager +
                ", isActivated=" + isActivated +
                '}';
    }
}
