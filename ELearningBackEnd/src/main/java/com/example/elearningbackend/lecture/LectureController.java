package com.example.elearningbackend.lecture;

import com.example.elearningbackend.action.ActionHistory;
import com.example.elearningbackend.action.ActionReq;
import com.example.elearningbackend.history.approval.ApprovalReq;
import com.example.elearningbackend.history.approval.ApprovalRes;
import com.example.elearningbackend.user.User;
import com.example.elearningbackend.util.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/lectures")
public class LectureController {

    private final LectureService lectureService;

    @GetMapping("/public")
    public Page<LectureRes> getPageForCustomer(Pageable pageable, LectureQuery lectureQuery){
        return lectureService.getPublicPage(pageable, lectureQuery);
    }

    @GetMapping("/manager")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public Page<LectureRes> getPage(Pageable pageable, LectureQuery lectureQuery){
        return lectureService.getManagerPage(pageable, lectureQuery);
    }

    @GetMapping("/manager/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public LectureRes getById(@PathVariable long id){
        return lectureService.getManagerById(id);
    }

    @GetMapping("/public/{id}")
    public LectureRes getPublicById(@PathVariable long id){
        return lectureService.getPublicById(id);
    }

    @GetMapping("/public/count/{courseId}")
    public CountLectureRes countPublicLectureByCourse(@PathVariable long courseId){
        return lectureService.countPublicLectureByCourse(courseId);
    }

    @GetMapping("/manager/count/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public CountLectureRes countLectureByCourse(@PathVariable long courseId){
        return lectureService.countLectureByCourse(courseId);
    }

    @PostMapping("/manager")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public LectureRes create(@RequestBody LectureReq lectureReq){
        return lectureService.create(lectureReq);
    }

    @PutMapping("/manager/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public LectureRes update(@PathVariable long id, @RequestBody LectureReq lectureReq){
        return lectureService.update(id, lectureReq);
    }

    @DeleteMapping("/instructor/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public void deleteByOwner(@PathVariable long id){
        lectureService.deleteByOwner(id);
    }

    @PostMapping("/manager/video/{lectureId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public LectureRes uploadVideo(@PathVariable long lectureId, @RequestPart("video")MultipartFile video) throws IOException {
        return lectureService.uploadVideo(lectureId, video);
    }

    @PostMapping("/manager/document/{lectureId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public LectureRes uploadDocument(@PathVariable long lectureId, @RequestPart("document")MultipartFile document) throws IOException {
        return lectureService.uploadDocument(lectureId, document);
    }

    @PostMapping("/manager/s3-video/{lectureId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public LectureRes uploadS3Video(@PathVariable long lectureId, @RequestPart("video")MultipartFile video) throws IOException {
        return lectureService.uploadS3Video(lectureId, video);
    }

    @PostMapping("/manager/s3-document/{lectureId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public LectureRes uploadS3Document(@PathVariable long lectureId, @RequestPart("document")MultipartFile document) throws IOException {
        return lectureService.uploadS3Document(lectureId, document);
    }

    @GetMapping("/manager/video/{lectureId}")
    public ResponseEntity<Resource> getVideo(@PathVariable("lectureId") long lectureId) throws IOException {

        Resource video = lectureService.getManagerVideo(lectureId);
        return getVideoFile(video);
    }

    @GetMapping("/manager/url-video/{lectureId}")

    public String getManagerVideoUrl(@PathVariable("lectureId") long lectureId) throws IOException {

        return lectureService.getManagerS3Video(lectureId);
    }

    @GetMapping("/manager/url-document/{lectureId}")
    public String getManagerDocumentUrl(@PathVariable("lectureId") long lectureId) throws IOException {

        return lectureService.getManagerS3Document(lectureId);
    }

    @GetMapping("/enrolled/url-video/{lectureId}")
    public String getEnrolledVideoUrl(@PathVariable("lectureId") long lectureId) throws IOException {

        User loggedUser = (User) AuthUtil.getCurrentUser();
        return lectureService.getEnrolledS3Video(lectureId, loggedUser.getId());
    }

    @GetMapping("/enrolled/url-document/{lectureId}")
    public String getEnrolledDocumentUrl(@PathVariable("lectureId") long lectureId) throws IOException {
        User loggedUser = (User) AuthUtil.getCurrentUser();
        return lectureService.getEnrolledS3Document(lectureId, loggedUser.getId());
    }

    @GetMapping("/manager/document/{lectureId}")
    public ResponseEntity<Resource> getDocument(@PathVariable("lectureId") long lectureId) throws IOException {

        Resource document = lectureService.getManagerDocument(lectureId);
        return getDocumentFile(document);
    }

    @GetMapping("/enrolled/video/{lectureId}")
    public ResponseEntity<Resource> getEnrolledVideo(@PathVariable("lectureId") long lectureId) throws IOException {

        Resource video = lectureService.getEnrolledVideo(lectureId);
        return getVideoFile(video);
    }

    @GetMapping("/enrolled/document/{lectureId}")
    public ResponseEntity<Resource> getEnrolledDocument(@PathVariable("lectureId") long lectureId) throws IOException {

        Resource document = lectureService.getEnrolledDocument(lectureId);
        return getDocumentFile(document);
    }

    @DeleteMapping("/manager/video/{lectureId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public void deleteVideo(@PathVariable long lectureId) throws IOException {
        lectureService.deleteVideo(lectureId);
    }

    @DeleteMapping("/manager/document/{lectureId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public void deleteDocument(@PathVariable long lectureId) throws IOException {
        lectureService.deleteDocument(lectureId);
    }

    @DeleteMapping("/manager/s3-video/{lectureId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public void deleteS3Video(@PathVariable long lectureId) throws IOException {
        lectureService.deleteS3Video(lectureId);
    }

    @DeleteMapping("/manager/s3-document/{lectureId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public void deleteS3Document(@PathVariable long lectureId) throws IOException {
        lectureService.deleteS3Document(lectureId);
    }

    @PutMapping("/manager/report/{reporterId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public void deleteByReport(@PathVariable long reporterId, @RequestBody ActionReq actionReq){
        lectureService.deleteByReport(reporterId, actionReq);
    }

    @PatchMapping("/manager/{id}/toggle-activation")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public LectureRes toggleActivation(@PathVariable long id, @RequestBody ActionReq actionReq){
        return lectureService.toggleActivation(id, actionReq);
    }

    @PostMapping("/manager/{id}/approval")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public LectureRes approve(@PathVariable long id, @RequestBody ApprovalReq approvalReq){
        return lectureService.approve(id, approvalReq);
    }

    @PatchMapping("/manager/block/{reporterId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public void blockByReport(@PathVariable long reporterId, @RequestBody ActionReq actionReq){
        lectureService.blockByReport(reporterId, actionReq);
    }

    @PutMapping("/manager/delete/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public ActionHistory delete(@PathVariable long id, @RequestBody ActionReq actionReq){
        return lectureService.delete(id, actionReq);
    }

    @GetMapping("/manager/pending-approval/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public boolean containsPendingApprovalLectures(@PathVariable long courseId, @RequestBody ActionReq actionReq){
        return lectureService.containsPendingApprovalLectures(courseId);
    }

    @GetMapping("/manager/count/{courseId}/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT',  'INSTRUCTOR')")
    public long getLectureCountByStatus(@PathVariable long courseId, @PathVariable String status){
        return lectureService.getLectureCountByStatus(courseId, status);
    }

    @GetMapping("/public/video-duration/{courseId}/{status}")
    public float getLectureVideoDurationByStatus(@PathVariable long courseId, @PathVariable String status){
        return lectureService.getLectureVideoDurationByStatus(courseId, status);
    }

    @GetMapping("/manager/video-duration/{courseId}")
    public float getLectureVideoDuration(@PathVariable long courseId){
        return lectureService.getLectureVideoDurationByStatus(courseId);
    }

    @PutMapping("/manager/report/{reporterId}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public LectureRes rejectByReport(@PathVariable long reporterId, @RequestBody ActionReq actionReq){
        return lectureService.rejectByReport(reporterId, actionReq);
    }

    private ResponseEntity<Resource> getVideoFile(Resource video) throws IOException {

        if(!video.exists() && !video.isReadable()){
            throw new RuntimeException("Could not read the file!");
        }
        String contentType = Files.probeContentType(video.getFile().toPath());
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(video);
    }

    private ResponseEntity<Resource> getDocumentFile(Resource document) throws IOException {

        if(!document.exists() && !document.isReadable()){
            throw new RuntimeException("Could not read the file!");
        }
        String contentType = Files.probeContentType(document.getFile().toPath());
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        String documentName = document.getFilename();

        if (documentName.endsWith(".pdf")) {
            contentType = "application/pdf";
        }
        if (documentName.endsWith(".txt")) {
            contentType = "text/plain";
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header("Content-Disposition", "inline; filename=\"" + documentName + "\"")
                .body(document);
    }

    @PutMapping("/swap/{chapterId}/{lectureId1}/{lectureId2}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public void swapOrder(@PathVariable long chapterId, @PathVariable long lectureId1, @PathVariable long lectureId2){
        lectureService.swapOrder(chapterId, lectureId1, lectureId2);
    }

    @GetMapping("/manager/lecture-complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT', 'INSTRUCTOR')")
    public Page<LearnerCompleteLectureRes> getLearnerCompleteLecture(Pageable pageable, LectureQuery lectureQuery){
        return lectureService.getLearnerCompleteLecture(pageable, lectureQuery);
    }

}
