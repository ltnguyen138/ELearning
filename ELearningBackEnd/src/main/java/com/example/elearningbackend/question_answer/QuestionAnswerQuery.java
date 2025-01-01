package com.example.elearningbackend.question_answer;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuestionAnswerQuery {

    private String keyword;

    private Long lectureId;

    private Long courseId;

    private Long questionId;

    public Predicate toPredicate() {
        QQuestionAnswer qQuestionAnswer = QQuestionAnswer.questionAnswer;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qQuestionAnswer.isDeleted.isFalse());


        if(questionId == null) {
            builder.and(qQuestionAnswer.question.isNull());
        }
        if (questionId != null) {
            builder.and(qQuestionAnswer.question.id.eq(questionId));
        }
        if (courseId != null) {
            builder.and(qQuestionAnswer.course.id.eq(courseId));
        }

        if (lectureId != null) {
            builder.and(qQuestionAnswer.lecture.id.eq(lectureId));
        }
        if (keyword != null) {
            builder.and(qQuestionAnswer.content.containsIgnoreCase(keyword));
        }
        return builder.getValue();
    }
}
