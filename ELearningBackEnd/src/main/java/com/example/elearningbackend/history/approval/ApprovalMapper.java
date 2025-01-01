package com.example.elearningbackend.history.approval;

import com.example.elearningbackend.course.CourseMapper;
import com.example.elearningbackend.lecture.LectureMapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {LectureMapper.class, CourseMapper.class})
public interface ApprovalMapper {

}
