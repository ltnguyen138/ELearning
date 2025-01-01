package com.example.elearningbackend.lecture;

import com.example.elearningbackend.history.approval.ApprovalStatus;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter

public class LectureQuery {

    private String name;
    private long chapterId;
    private boolean isManager;
    private Boolean isActivated;
    private Long courseId;
    private String approvalStatus;

    public Predicate toPredicate() {

        QLecture qLecture = QLecture.lecture;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qLecture.isDeleted.isFalse());
        builder.and(qLecture.chapter.id.eq(chapterId));
        if (name != null) {
            builder.and(qLecture.name.containsIgnoreCase(name));
        }

        if(!isManager) {
            builder.and(qLecture.isActivated.isTrue())
                    .and(qLecture.chapter.course.isDeleted.isFalse())
                    .and(qLecture.chapter.course.isActivated.isTrue())
                    .and(qLecture.chapter.isDeleted.isFalse())

                    .and(qLecture.approvalStatus.eq(ApprovalStatus.APPROVED.name()))
                    .and(qLecture.chapter.course.approvalStatus.eq(ApprovalStatus.APPROVED.name()));
        }
        if(isManager && isActivated != null) {
            builder.and(qLecture.isActivated.eq(isActivated));
        }
        if(courseId != null) {
            builder.and(qLecture.chapter.course.id.eq(courseId));
        }
        if(approvalStatus != null) {
            builder.and(qLecture.approvalStatus.eq(approvalStatus));
        }
        return builder.getValue();
    }

    @Override
    public String toString() {

        return "LectureQuery{" +
                "name='" + name +
                ", chapterId=" + chapterId +
                ", isManager=" + isManager +
                ", isActivated=" + isActivated +
                ", courseId=" + courseId +
                ", approvalStatus='" + approvalStatus+
                '}';
    }
}
