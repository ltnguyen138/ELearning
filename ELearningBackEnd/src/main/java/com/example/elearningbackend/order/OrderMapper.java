package com.example.elearningbackend.order;

import com.example.elearningbackend.discount.DiscountMapper;
import com.example.elearningbackend.order.detail.OrderDetailMapper;
import com.example.elearningbackend.order.track.OrderTrack;
import com.example.elearningbackend.order.track.OrderTrackMapper;
import com.example.elearningbackend.user.UserMapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {OrderDetailMapper.class, OrderTrackMapper.class, UserMapper.class, DiscountMapper.class})
public interface OrderMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    Order toOrder(OrderReq orderReq);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(dateFormat = "dd-MM-yyyy HH:mm:ss", target = "createdTime")
    @Mapping(dateFormat = "dd-MM-yyyy HH:mm:ss", target = "updatedTime")
    OrderRes toOrderRes(Order order);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    void updateOrder(OrderReq orderReq, @MappingTarget Order order);
}
