package com.example.elearningbackend.order.detail;

import com.example.elearningbackend.course.CourseMapper;
import com.example.elearningbackend.discount.DiscountMapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {CourseMapper.class, DiscountMapper.class})
public interface OrderDetailMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    OrderDetailRes toOrderDetailRes(OrderDetail orderDetail);
}
