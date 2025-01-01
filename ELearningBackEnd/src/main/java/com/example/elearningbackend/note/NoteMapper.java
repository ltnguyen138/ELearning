package com.example.elearningbackend.note;

import com.example.elearningbackend.lecture.LectureMapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {LectureMapper.class})
public interface NoteMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    NoteRes toNoteRes(Note note);

    @BeanMapping(nullValuePropertyMappingStrategy = org.mapstruct.NullValuePropertyMappingStrategy.IGNORE)
    Note toNote(NoteReq noteReq);
}
