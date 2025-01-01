package com.example.elearningbackend.lecture;

import com.example.elearningbackend.action.ActionHistory;
import com.example.elearningbackend.action.ActionReq;
import com.example.elearningbackend.history.approval.ApprovalReq;
import com.example.elearningbackend.history.approval.ApprovalRes;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public interface LectureService {

    Page<LectureRes> getPublicPage(Pageable pageable, LectureQuery lectureQuery);

    Page<LectureRes> getManagerPage(Pageable pageable, LectureQuery lectureQuery);

    LectureRes create(LectureReq lectureReq);

    LectureRes update(long id, LectureReq lectureReq);

    void deleteByOwner(long id);

    ActionHistory delete(long id, ActionReq actionReq);

    void deleteByReport(long reporterId, ActionReq actionReq);

    LectureRes getManagerById(long id);

    LectureRes getPublicById(long id);

    LectureRes toggleActivation(long id, ActionReq actionReq);

    void blockByReport(long reporterId, ActionReq actionReq);

    LectureRes uploadVideo(long lectureId, MultipartFile video) throws IOException;

    LectureRes uploadDocument(long lectureId, MultipartFile document) throws IOException;

    void deleteVideo(long lectureId) throws IOException;

    void deleteDocument(long lectureId) throws IOException;

    Resource getManagerVideo(long lectureId) throws IOException;

    Resource getManagerDocument(long lectureId) throws IOException;

    Resource getEnrolledVideo(long lectureId) throws IOException;

    Resource getEnrolledDocument(long lectureId) throws IOException;

    LectureRes uploadS3Video(long lectureId, MultipartFile video) throws IOException;

    LectureRes uploadS3Document(long lectureId, MultipartFile document) throws IOException;

    void deleteS3Video(long lectureId) throws IOException;

    void deleteS3Document(long lectureId) throws IOException;

    String getManagerS3Video(long lectureId) throws IOException;

    String getManagerS3Document(long lectureId) throws IOException;

    String getEnrolledS3Video(long lectureId, long userId) throws IOException;

    String getEnrolledS3Document(long lectureId, long userId) throws IOException;

    CountLectureRes countPublicLectureByCourse(long courseId);

    CountLectureRes countLectureByCourse(long courseId);

    LectureRes approve(long id, ApprovalReq approvalReq);

    boolean containsPendingApprovalLectures(long courseId);

    long getLectureCountByStatus(long courseId, String status);

    float getLectureVideoDurationByStatus(long courseId, String status);

    float getLectureVideoDurationByStatus(long courseId);

    LectureRes rejectByReport(long reporterId, ActionReq actionReq);

    void swapOrder(long chapterId, long lectureId1, long lectureId2);

    Page<LearnerCompleteLectureRes> getLearnerCompleteLecture(Pageable pageable, LectureQuery lectureQuery);
}
