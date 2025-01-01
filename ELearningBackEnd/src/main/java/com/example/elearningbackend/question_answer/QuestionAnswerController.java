package com.example.elearningbackend.question_answer;

import com.example.elearningbackend.action.ActionReq;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin("http://localhost:4200")
@RequestMapping("/api/v1/question-answers")
public class QuestionAnswerController {

    private final QuestionAnswerService questionAnswerService;

    @GetMapping()
    public Page<QuestionAnswerRes> getPageByLecture(Pageable pageable, QuestionAnswerQuery questionAnswerQuery) {
        return questionAnswerService.getPageByLecture(pageable, questionAnswerQuery);
    }

    @GetMapping("/{id}")
    public QuestionAnswerRes getById(@PathVariable long id) {
        return questionAnswerService.getById(id);
    }

    @PostMapping
    public QuestionAnswerRes create(@RequestBody QuestionAnswerReq questionAnswerReq) {
        return questionAnswerService.create(questionAnswerReq);
    }

    @PutMapping("/{id}")
    public QuestionAnswerRes update(@PathVariable long id, @RequestBody QuestionAnswerReq questionAnswerReq) {
        return questionAnswerService.update(id, questionAnswerReq);
    }

    @DeleteMapping("/{id}")
    public void deleteByOwner(@PathVariable long id) {
        questionAnswerService.deleteByOwner(id);
    }

    @PutMapping("/manager/{id}")
    public void delete(@PathVariable long id, @RequestBody ActionReq actionReq) {
        questionAnswerService.delete(id, actionReq);
    }

    @PutMapping("/manager/report/{reportId}")
    public void deleteByReport(@PathVariable long reportId, @RequestBody ActionReq actionReq) {
        questionAnswerService.deleteByReport(reportId, actionReq);
    }

    @GetMapping("/{id}/ignore-deleted")
    @PreAuthorize("hasAnyRole('ADMIN', 'ROOT')")
    public QuestionAnswerRes getQuestionAnswerByIdIgnoreDeleted(@PathVariable long id) {
        return questionAnswerService.getQuestionAnswerByIdIgnoreDeleted(id);
    }
}
