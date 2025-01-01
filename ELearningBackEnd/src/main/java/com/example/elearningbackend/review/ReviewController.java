package com.example.elearningbackend.review;

import com.example.elearningbackend.action.ActionReq;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/manager")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public Page<ReviewRes> getPageForAdmin(Pageable pageable, ReviewQuery reviewQuery){
        return reviewService.getManagerPage(pageable, reviewQuery);
    }

    @GetMapping("/public/{courseId}")
    public Page<ReviewRes> getPageForCustomer(Pageable pageable, ReviewQuery reviewQuery, @PathVariable long courseId){
        return reviewService.getPublicPage(pageable, reviewQuery, courseId);
    }

    @GetMapping("/accountant/{courseId}")
    public ReviewRes getByUserAndCourse(@PathVariable long courseId){
        return reviewService.getByAccountAndCourse(courseId);
    }

    @PostMapping
    public ReviewRes create(@RequestBody ReviewReq reviewReq){
        return reviewService.create(reviewReq);
    }

    @PutMapping("/{id}")
    public ReviewRes update(@PathVariable long id, @RequestBody ReviewReq reviewReq){
        return reviewService.update(id, reviewReq);
    }

    @DeleteMapping("/{id}")
    public void deleteByOwner(@PathVariable long id){
        reviewService.deleteByOwner(id);
    }

    @PutMapping("/{id}/toggle-activation")
    public ReviewRes toggleActivation(@PathVariable long id){
        return reviewService.toggleActivation(id);
    }

    @PutMapping("/manager/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public void deleteByAdmin(@PathVariable long id, @RequestBody ActionReq actionReq){
        reviewService.delete(id, actionReq);
    }

    @PutMapping("/manager/report/{reportId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public void deleteByReport(@PathVariable long reportId, @RequestBody ActionReq actionReq){
        reviewService.deleteByReport(reportId, actionReq);
    }

    @GetMapping("/{id}/ignore-deleted")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public ReviewRes getReviewByIdIgnoreDeleted(@PathVariable long id){
        return reviewService.getReviewByIdIgnoreDeleted(id);
    }
}
