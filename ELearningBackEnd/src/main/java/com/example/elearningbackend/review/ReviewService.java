package com.example.elearningbackend.review;

import com.example.elearningbackend.action.ActionReq;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface ReviewService {

    Page<ReviewRes> getManagerPage(Pageable pageable, ReviewQuery reviewQuery);

    Page<ReviewRes> getPublicPage(Pageable pageable, ReviewQuery reviewQuery, long courseId);

    ReviewRes getByAccountAndCourse(long courseId);

    ReviewRes create(ReviewReq reviewReq);

    ReviewRes update(long id, ReviewReq reviewReq);

    void deleteByOwner(long id);

    ReviewRes toggleActivation(long id);

    void delete(long id, ActionReq actionReq);

    void deleteByReport(long reportId, ActionReq actionReq);

    ReviewRes  getReviewByIdIgnoreDeleted(long id);

}
