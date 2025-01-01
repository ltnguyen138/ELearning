package com.example.elearningbackend.lecture;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface LectureMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    Lecture toLecture(LectureReq lectureReq);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(dateFormat = "dd-MM-yyyy", target = "createdTime")
    @Mapping(dateFormat = "dd-MM-yyyy", target = "updatedTime")
    LectureRes toLectureRes(Lecture lecture);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    void updateLecture(LectureReq lectureReq, @MappingTarget Lecture lecture);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    LectureShortRes toLectureShortRes(Lecture lecture);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    LearnerCompleteLectureRes toLearnerCompleteLectureRes(Lecture lecture);
}
