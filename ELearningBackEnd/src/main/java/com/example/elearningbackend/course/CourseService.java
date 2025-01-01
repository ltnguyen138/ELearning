package com.example.elearningbackend.course;

import com.example.elearningbackend.action.ActionReq;
import com.example.elearningbackend.history.approval.ApprovalReq;
import com.example.elearningbackend.history.approval.ApprovalRes;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public interface CourseService {

    Page<CourseRes> getManagerPage(Pageable pageable, CourseQuery courseQuery);

    Page<CourseRes> getInstructorPage(Pageable pageable, CourseQuery courseQuery);

    Page<CourseRes> getPublicPage(Pageable pageable, CourseQuery courseQuery);

    CourseRes getManagerById(long id);

    CourseRes getInstructorById(long id);

    CourseRes getPublicByCourseName(String courseName);

    CourseRes getPublicByCourseAlias(String courseAlias);

    CourseRes create(CourseReq courseReq);

    CourseRes update(long id, CourseReq courseReq);

    void deleteByOwner(long id);

   CourseRes uploadImage(long courseId, MultipartFile image) throws IOException;

   UrlResource getImage(String imageName) throws IOException;

   CourseRes toggleActivation(long id, ActionReq actionReq);

   CourseRes toggleModeration(long id);

   CourseRes approve(long courseId, ApprovalReq approvalReq);

    void delete(long id, ActionReq actionReq);

    void deleteByReport(long reportId , ActionReq actionReq);

    CourseRes block(long id, ActionReq actionReq);

    CourseRes rejectByReport(long reportId, ActionReq actionReq);

    CourseRes getCourseByIdIgnoreDeleted(long id);

    long countPuschasedCourses(CourseQuery courseQuery);


}
