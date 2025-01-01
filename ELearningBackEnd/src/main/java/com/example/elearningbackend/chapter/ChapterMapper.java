package com.example.elearningbackend.chapter;

import com.example.elearningbackend.course.CourseMapper;
import com.example.elearningbackend.lecture.LectureMapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {LectureMapper.class, CourseMapper.class})
public interface ChapterMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    Chapter toChapter(ChapterReq chapterReq);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(dateFormat = "dd-MM-yyyy", target = "createdTime")
    @Mapping(dateFormat = "dd-MM-yyyy", target = "updatedTime")
    ChapterRes toChapterRes(Chapter chapter);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    ChapterShortRes toChapterShortRes(Chapter chapter);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    void updateChapter(ChapterReq chapterReq, @MappingTarget Chapter chapter);
}
