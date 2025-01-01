package com.example.elearningbackend.review;

import com.example.elearningbackend.course.CourseMapper;
import com.example.elearningbackend.user.UserMapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring",uses = {UserMapper.class, CourseMapper.class})
public interface ReviewMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    Review toReview(ReviewReq reviewReq);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(dateFormat = "dd-MM-yyyy", target = "createdTime")
    @Mapping(dateFormat = "dd-MM-yyyy", target = "updatedTime")
    ReviewRes toReviewRes(Review review);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    void updateReview(ReviewReq reviewReq, @MappingTarget Review review);
}
