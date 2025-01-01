package com.example.elearningbackend.order.track;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface OrderTrackMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    OrderTrack toOrderTrack(OrderTrackReq orderTrackReq);

    @Mapping(dateFormat = "dd-MM-yyyy HH:mm:ss", target = "updateTime")
    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    OrderTrackRes toOrderTrackRes(OrderTrack orderTrack);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    void updateOrderTrack(OrderTrackReq orderTrackReq, @MappingTarget OrderTrack orderTrack);
}
