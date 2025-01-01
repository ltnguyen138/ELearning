package com.example.elearningbackend.notification;

import com.example.elearningbackend.course.CourseMapper;
import com.example.elearningbackend.user.UserMapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CourseMapper.class, UserMapper.class})
public interface NotificationMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(dateFormat = "dd-MM-yyyy hh:mm:ss", target = "timestamp")
    NotificationRes toNotificationRes(Notification notification);

}
