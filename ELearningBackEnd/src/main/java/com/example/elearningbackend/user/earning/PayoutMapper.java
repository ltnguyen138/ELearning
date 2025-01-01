package com.example.elearningbackend.user.earning;

import com.example.elearningbackend.course.CourseMapper;
import com.example.elearningbackend.user.UserMapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring",uses = {UserMapper.class})
public interface PayoutMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(dateFormat = "dd-MM-yyyy HH:mm:ss", target = "payoutDate")
    PayoutHistoryRes toPayoutHistoryRes(PayoutHistory payoutHistory);
}
