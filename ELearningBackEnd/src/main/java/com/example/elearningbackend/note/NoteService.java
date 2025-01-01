package com.example.elearningbackend.note;

import com.example.elearningbackend.exception.ResourceNotFoundException;
import com.example.elearningbackend.lecture.Lecture;
import com.example.elearningbackend.lecture.LectureRepository;
import com.example.elearningbackend.user.User;
import com.example.elearningbackend.user.user_course.UserCourse;
import com.example.elearningbackend.user.user_course.UserCourseRepository;
import com.example.elearningbackend.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final NoteMapper noteMapper;
    private final LectureRepository lectureRepository;
    private final UserCourseRepository userCourseRepository;


    public  NoteRes create(NoteReq noteReq) {

        User loggedUser = (User) AuthUtil.getCurrentUser();
        Note note = noteMapper.toNote(noteReq);
        Lecture lecture = lectureRepository.findById(noteReq.getLectureId()).orElseThrow(() -> new RuntimeException("Lecture not found"));
        UserCourse userCourse = userCourseRepository.findByCourseAliasAndUserId(noteReq.getCourseAlias(), loggedUser.getId());
        if(userCourse == null) {
            throw new RuntimeException("User course not found");
        }
        if(!checkUserAccess(loggedUser, lecture)){
            throw new RuntimeException("Bạn không có quyền ghi chú cho bài giảng này");
        }
        note.setUserCourse(userCourse);
        note.setLecture(lecture);
        note.setCreatedAt(LocalDateTime.now());
        return noteMapper.toNoteRes(noteRepository.save(note));
    }

    public Page<NoteRes> getNote(Pageable pageable, NoteQuery noteQuery) {

        User loggedUser = (User) AuthUtil.getCurrentUser();
        noteQuery.setUserId(loggedUser.getId());
        return noteRepository.findAll(noteQuery.toPredicate(), pageable).map(noteMapper::toNoteRes);
    }

    public void delete(long id) {

        User loggedUser = (User) AuthUtil.getCurrentUser();
        Note note = noteRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ghi chú không tồn tại"));
        if(note.getUserCourse().getUser().getId() != loggedUser.getId()){
            throw new RuntimeException("Bạn không có quyền xóa ghi chú này");
        }
        noteRepository.deleteById(id);
    }

    public NoteRes update(long id, NoteReq noteReq) {

        User loggedUser = (User) AuthUtil.getCurrentUser();
        Note note = noteRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ghi chú không tồn tại"));
        if(note.getUserCourse().getUser().getId() != loggedUser.getId()){
            throw new RuntimeException("Bạn không có quyền sửa ghi chú này");
        }
        note.setTitle(noteReq.getTitle());
        note.setDuration(noteReq.getDuration());
        return noteMapper.toNoteRes(noteRepository.save(note));
    }

  public boolean checkUserAccess(User user, Lecture lecture) {
        return userCourseRepository.existsByUserIdAndCourseId(user.getId(), lecture.getChapter().getCourse().getId());
    }
}
