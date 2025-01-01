package com.example.elearningbackend.user.user_course;

import com.example.elearningbackend.course.CourseMapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserCourseLectureMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    UserCourseLectureRes toUserCourseLectureRes(UserCourseLecture userCourseLecture);
}
