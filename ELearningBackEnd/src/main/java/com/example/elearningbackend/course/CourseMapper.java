package com.example.elearningbackend.course;

import com.example.elearningbackend.category.CategoryMapper;
import com.example.elearningbackend.user.UserMapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class, UserMapper.class})
public interface CourseMapper {


    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    Course toCourse(CourseReq courseReq);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(dateFormat = "dd-MM-yyyy hh:mm:ss", target = "createdTime")
    @Mapping(dateFormat = "dd-MM-yyyy hh:mm:ss", target = "updatedTime")
    @Mapping(target = "averageRating", expression = "java((int) Math.round(course.getAverageRating()))")
    CourseRes toCourseRes(Course course);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    CourseShortRes toCourseShortRes(Course course);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    void updateCourse(CourseReq courseReq,@MappingTarget Course course);


}
