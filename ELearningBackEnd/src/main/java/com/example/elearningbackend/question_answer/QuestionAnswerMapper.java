package com.example.elearningbackend.question_answer;

import com.example.elearningbackend.course.CourseMapper;
import com.example.elearningbackend.course.CourseShortRes;
import com.example.elearningbackend.lecture.LectureMapper;
import com.example.elearningbackend.user.UserMapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {UserMapper.class, LectureMapper.class, CourseMapper.class})
public interface QuestionAnswerMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    QuestionAnswer toQuestionAnswer(QuestionAnswerReq questionAnswerReq);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(dateFormat = "dd-MM-yyyy", target = "createdTime")
    @Mapping(dateFormat = "dd-MM-yyyy", target = "updatedTime")
    QuestionAnswerRes toQuestionAnswerRes(QuestionAnswer questionAnswer);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    void updateQuestionAnswer(QuestionAnswerReq questionAnswerReq, @MappingTarget QuestionAnswer questionAnswer);

}
