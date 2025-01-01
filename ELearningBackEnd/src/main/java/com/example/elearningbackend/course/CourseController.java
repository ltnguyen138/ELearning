package com.example.elearningbackend.course;

import com.example.elearningbackend.action.ActionReq;
import com.example.elearningbackend.history.approval.ApprovalReq;
import com.example.elearningbackend.history.approval.ApprovalRes;
import com.example.elearningbackend.user.user_course.UserCourseQuery;
import com.example.elearningbackend.user.user_course.UserCourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/courses")
public class CourseController {

    private final CourseService courseService;
    private final UserCourseService userCourseService;

    @GetMapping("/manager")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public Page<CourseRes> getPageForAdmin(Pageable pageable, CourseQuery courseQuery){
        return courseService.getManagerPage(pageable, courseQuery);
    }

    @GetMapping("/public")
    public Page<CourseRes> getPageForCustomer(Pageable pageable, CourseQuery courseQuery){
        return courseService.getPublicPage(pageable, courseQuery);
    }

    @GetMapping("/manager/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public CourseRes getById(@PathVariable long id){
        return courseService.getManagerById(id);
    }

    @GetMapping("/instructor/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public CourseRes getInstructorById(@PathVariable long id){
        return courseService.getInstructorById(id);
    }

    @GetMapping("/public/{alias}")
    public CourseRes getByAlias(@PathVariable String alias){
        return courseService.getPublicByCourseAlias(alias);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public CourseRes create(@RequestBody CourseReq courseReq){
        return courseService.create(courseReq);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public CourseRes update(@PathVariable long id, @RequestBody CourseReq courseReq){
        return courseService.update(id, courseReq);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public void deleteByOwner(@PathVariable long id){
        courseService.deleteByOwner(id);
    }

    @PostMapping(value = "/{courseId}/image")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public CourseRes uploadImage(@PathVariable long courseId, @RequestPart("image") MultipartFile image) throws IOException {

        return courseService.uploadImage(courseId, image);
    }

    @GetMapping("/image/{imageName}")
    public ResponseEntity<UrlResource> getImage(@PathVariable String imageName) throws IOException {

        return ResponseEntity.ok()
                .contentType(imageName.endsWith(".png") ? MediaType.IMAGE_PNG : MediaType.IMAGE_JPEG)
                .body(courseService.getImage(imageName));
    }

    @GetMapping("/purchased")
    public List<CourseShortRes> getPurchasedCourses(){
        return userCourseService.findAllByUserId();
    }

    @GetMapping("/purchased/page")
    public Page<CourseRes> getPurchasedCourses(Pageable pageable, UserCourseQuery userCourseQuery){
        return userCourseService.getPageForCustomer(pageable, userCourseQuery);
    }

//    @GetMapping("/purchased/{alias}")
//    public CourseRes getPurchasedCourseByAlias(@PathVariable String alias){
//        return userCourseService.getByAliasAndUserId(alias);
//    }

    @PatchMapping("/{id}/request-moderation")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public CourseRes toggleModeration(@PathVariable long id){
        return courseService.toggleModeration(id);
    }

    @PostMapping("/{id}/approval")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public CourseRes approve(@PathVariable long id, @RequestBody ApprovalReq approvalReq){
        return courseService.approve(id, approvalReq);
    }

    @PutMapping("/manager/{id}")
    @PreAuthorize("hasAnyRole('ROOT')")
    public void delete(@PathVariable long id, @RequestBody ActionReq actionReq){
        courseService.delete(id, actionReq);
    }

    @PutMapping("/manager/report/{reportId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public void deleteByReport(@PathVariable long reportId, @RequestBody ActionReq actionReq){
        courseService.deleteByReport(reportId, actionReq);
    }

    @PatchMapping("/manager/block/{reportId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public CourseRes block(@PathVariable long reportId, @RequestBody ActionReq actionReq){
        return courseService.block(reportId, actionReq);
    }

    @PatchMapping("/{id}/toggle-activation")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public CourseRes toggleActivation(@PathVariable long id, @RequestBody ActionReq actionReq){
        return courseService.toggleActivation(id, actionReq);
    }

    @PutMapping("/manager/report/{reportId}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public CourseRes rejectByReport(@PathVariable long reportId, @RequestBody ActionReq actionReq){
        return courseService.rejectByReport(reportId, actionReq);
    }

    @GetMapping("/{id}/ignore-deleted")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public CourseRes getCourseByIdIgnoreDeleted(@PathVariable long id) {
        return courseService.getCourseByIdIgnoreDeleted(id);
    }

    @GetMapping("/count/purchased")
    public long countPurchasedCourses(CourseQuery courseQuery){
        return courseService.countPuschasedCourses(courseQuery);
    }
}
