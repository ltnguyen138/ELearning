package com.example.elearningbackend.discount;

import com.example.elearningbackend.course.CourseMapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {CourseMapper.class})
public interface DiscountMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    Discount toDiscount(DiscountReq discountReq);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(dateFormat = "dd-MM-yyyy", target = "createdTime")
    @Mapping(dateFormat = "dd-MM-yyyy", target = "updatedTime")
    @Mapping(dateFormat = "dd-MM-yyyy", target = "validFrom")
    @Mapping(dateFormat = "dd-MM-yyyy", target = "validTo")
    DiscountRes toDiscountRes(Discount discount);


    void updateDiscount(DiscountReq discountReq, @MappingTarget Discount discount);
}
