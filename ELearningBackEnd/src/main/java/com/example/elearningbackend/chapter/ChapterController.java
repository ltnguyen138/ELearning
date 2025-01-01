package com.example.elearningbackend.chapter;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/chapters")
public class ChapterController {

    private final ChapterService chapterService;

    @GetMapping("/public")
    public Page<ChapterRes> getPageForCustomer(Pageable pageable, ChapterQuery chapterQuery){

        return chapterService.getPublicPage(pageable, chapterQuery);
    }

    @GetMapping("/manager")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'ROOT')")
    public Page<ChapterRes> getPage(Pageable pageable, ChapterQuery chapterQuery){

        return chapterService.getManagerPage(pageable, chapterQuery);
    }

    @GetMapping("/public/{id}")
    public ChapterRes getById(@PathVariable long id){

        return chapterService.getPublicById(id);
    }

    @GetMapping("/manager/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'ROOT')")
    public ChapterRes getByIdForManager(@PathVariable long id){

        return chapterService.getManagerById(id);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'ROOT')")
    public ChapterRes create(@RequestBody ChapterReq chapterReq){

        return chapterService.create(chapterReq);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'ROOT')")
    public ChapterRes update(@PathVariable long id, @RequestBody ChapterReq chapterReq){

        return chapterService.update(id, chapterReq);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'ROOT')")
    public void delete(@PathVariable long id){

        chapterService.delete(id);
    }

    @PutMapping("/swap/{courseId}/{chapterId1}/{chapterId2}")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'ROOT')")
    public void swapOrder(@PathVariable long courseId, @PathVariable long chapterId1, @PathVariable long chapterId2){

        chapterService.swapOrder(courseId, chapterId1, chapterId2);
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'ROOT')")
    public List<ChapterRes> createChaptersAndLectures(@RequestBody List<ChapterReq> chapterReqs){

        return chapterService.createChaptersAndLectures(chapterReqs);
    }

    @GetMapping("/bulk/template")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR', 'ROOT')")
    public Resource getFileCreateChaptersAndLecturesTemplate() throws MalformedURLException {

        return chapterService.getFileCreateChaptersAndLecturesTemplate();
    }

}
