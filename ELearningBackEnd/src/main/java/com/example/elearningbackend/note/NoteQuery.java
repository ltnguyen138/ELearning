package com.example.elearningbackend.note;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NoteQuery {

    private String courseAlias;

    private Long lectureId;

    private String title;

    private long userId;

    public Predicate toPredicate(){

        QNote qNote = QNote.note;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qNote.userCourse.course.alias.eq(courseAlias));
        builder.and(qNote.userCourse.user.id.eq(userId));
        if(lectureId != null){
            builder.and(qNote.lecture.id.eq(lectureId));
        }
        if(title != null){
            builder.and(qNote.title.containsIgnoreCase(title));
        }
        return builder.getValue();
    }
}
