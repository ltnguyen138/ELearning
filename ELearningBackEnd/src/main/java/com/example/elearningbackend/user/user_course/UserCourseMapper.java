package com.example.elearningbackend.user.user_course;

import com.example.elearningbackend.course.CourseMapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {CourseMapper.class, UserCourseLectureMapper.class})
public interface UserCourseMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    UserCourseShortRes toUserCourseShortRes(UserCourse userCourse);
}
