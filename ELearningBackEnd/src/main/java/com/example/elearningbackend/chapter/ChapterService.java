package com.example.elearningbackend.chapter;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.util.List;

@Service
public interface ChapterService {

    Page<ChapterRes> getPublicPage(Pageable pageable, ChapterQuery chapterQuery);

    Page<ChapterRes> getManagerPage(Pageable pageable, ChapterQuery chapterQuery);

    ChapterRes getManagerById(long id);

    ChapterRes getPublicById(long id);

    ChapterRes create(ChapterReq chapterReq);

    ChapterRes update(long id, ChapterReq chapterReq);

    void delete(long id);

    void swapOrder(long courseId, long chapterId1, long chapterId2);

    List<ChapterRes> createChaptersAndLectures(List<ChapterReq> chapterReqs);

    Resource getFileCreateChaptersAndLecturesTemplate() throws MalformedURLException;
}
