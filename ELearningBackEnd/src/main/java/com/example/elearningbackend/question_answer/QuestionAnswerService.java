package com.example.elearningbackend.question_answer;

import com.example.elearningbackend.action.ActionReq;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public interface QuestionAnswerService {

    Page<QuestionAnswerRes> getPageByLecture(Pageable pageable, QuestionAnswerQuery questionAnswerQuery);

    QuestionAnswerRes getById(long id);

    QuestionAnswerRes create(QuestionAnswerReq questionAnswerReq);

    QuestionAnswerRes update(long id, QuestionAnswerReq questionAnswerReq);

    void deleteByOwner(long id);

    void delete(long id, ActionReq actionReq);

    void deleteByReport(long reportId, ActionReq actionReq);

    QuestionAnswerRes getQuestionAnswerByIdIgnoreDeleted(long id);
}
