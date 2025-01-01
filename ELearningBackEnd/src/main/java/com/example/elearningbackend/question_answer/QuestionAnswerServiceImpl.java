package com.example.elearningbackend.question_answer;

import com.example.elearningbackend.action.ActionReq;
import com.example.elearningbackend.common.EntityNameEnum;
import com.example.elearningbackend.course.Course;
import com.example.elearningbackend.course.CourseRepository;
import com.example.elearningbackend.exception.ResourceNotFoundException;
import com.example.elearningbackend.action.ActionHistory;
import com.example.elearningbackend.history.action.ActionHistoryRepository;
import com.example.elearningbackend.history.action.ActionType;
import com.example.elearningbackend.lecture.Lecture;
import com.example.elearningbackend.lecture.LectureRepository;
import com.example.elearningbackend.notification.Notification;
import com.example.elearningbackend.notification.NotificationService;
import com.example.elearningbackend.report.Report;
import com.example.elearningbackend.report.ReportRepository;
import com.example.elearningbackend.report.ReportStatus;
import com.example.elearningbackend.role.UserRole;
import com.example.elearningbackend.user.User;
import com.example.elearningbackend.user.UserRepository;

import com.example.elearningbackend.user.user_course.UserCourseRepository;

import com.example.elearningbackend.util.AuthUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class QuestionAnswerServiceImpl implements QuestionAnswerService{

    private final QuestionAnswerRepository questionAnswerRepository;
    private final QuestionAnswerMapper questionAnswerMapper;
    private final UserRepository userRepository;
    private final LectureRepository lectureRepository;
    private final CourseRepository  courseRepository;
    private final UserCourseRepository userCourseRepository;
    private final ReportRepository reportRepository;
    private final ActionHistoryRepository actionHistoryRepository;
    private final NotificationService notificationService;

    @Override
    public Page<QuestionAnswerRes> getPageByLecture(Pageable pageable, QuestionAnswerQuery questionAnswerQuery) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        User user =
            userRepository
                .findById(loggedInUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if(questionAnswerQuery.getCourseId() == null){
            if(!checkUserAccess(user, (Course) null)){
                throw new ResourceNotFoundException("Access denied");
            }
        }else {
            Course course = courseRepository.findById(questionAnswerQuery.getCourseId()).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
            if(!checkUserAccess(user, course)){
                throw new ResourceNotFoundException("Access denied");
            }
        }
        return questionAnswerRepository.findAll(questionAnswerQuery.toPredicate(), pageable).map(questionAnswerMapper :: toQuestionAnswerRes);
    }

    @Override
    public QuestionAnswerRes getById(long id) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        QuestionAnswer questionAnswer = questionAnswerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Question Answer not found"));
        if(!checkUserAccess(loggedInUser, questionAnswer.getLecture())){
            throw new ResourceNotFoundException("Access denied");
        }
        return questionAnswerMapper.toQuestionAnswerRes(questionAnswer);

    }

    @Transactional
    @Override
    public QuestionAnswerRes create(QuestionAnswerReq questionAnswerReq) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        Lecture lecture = lectureRepository.findById(questionAnswerReq.getLectureId()).orElseThrow(() -> new ResourceNotFoundException("Lecture not found ds"));
        if(!checkUserAccess(loggedInUser, lecture)){
            throw new ResourceNotFoundException("Access denied");
        }

        QuestionAnswer questionAnswer = questionAnswerMapper.toQuestionAnswer(questionAnswerReq);
        questionAnswer.setLecture(lecture);
        questionAnswer.setUser(loggedInUser);
        questionAnswer.setCourse(lecture.getChapter().getCourse());
        questionAnswer.setActivated(true);
        if(questionAnswerReq.getQuestionId() != null){
            QuestionAnswer question = questionAnswerRepository.findById(questionAnswerReq.getQuestionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Question not found"));
            if(question.getQuestion() != null){
                questionAnswer.setQuestion(question.getQuestion());
            }else {
                questionAnswer.setQuestion(question);
            }

        }
        questionAnswer = questionAnswerRepository.save(questionAnswer);
        Notification notification = Notification.builder()
                .title("Bạn có câu hỏi mới")
                .roleNotification("INSTRUCTOR_QA")
                .course(lecture.getChapter().getCourse())
                .user(lecture.getChapter().getCourse().getInstructor())
                .timestamp(LocalDateTime.now())
                .build();

        notificationService.saveNotification(notification);
        notificationService.sendNotification(notification);
        return questionAnswerMapper.toQuestionAnswerRes(questionAnswer);
    }

    @Transactional
    @Override
    public QuestionAnswerRes update(long id, QuestionAnswerReq questionAnswerReq) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        QuestionAnswer questionAnswer = questionAnswerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Question Answer not found"));
        if(questionAnswer.getUser().getId() != loggedInUser.getId()){
            throw new ResourceNotFoundException("Access denied");
        }
        questionAnswer.setContent(questionAnswerReq.getContent());
        questionAnswer = questionAnswerRepository.save(questionAnswer);
        return questionAnswerMapper.toQuestionAnswerRes(questionAnswer);
    }

    @Transactional
    @Override
    public void deleteByOwner(long id) {

        User loggedInUser = (User) AuthUtil.getCurrentUser();
        QuestionAnswer questionAnswer = questionAnswerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Question Answer not found"));
        if(!checkUserAccess(loggedInUser, questionAnswer.getLecture())){
            throw new ResourceNotFoundException("Access denied");
        }
        questionAnswer.setDeleted(true);
        questionAnswerRepository.save(questionAnswer);
    }

    @Transactional
    @Override
    public void delete(long id, ActionReq actionReq) {

        QuestionAnswer questionAnswer = questionAnswerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Question Answer not found"));

        ActionHistory actionHistory = ActionHistory.builder()
                .admin((User) AuthUtil.getCurrentUser())
                .entityName(EntityNameEnum.QUESTION_ANSWER)
                .entityId(questionAnswer.getId())
                .type(ActionType.DELETE)
                .timestamp(LocalDateTime.now())
                .reason(actionReq.getReason())
                .build();
        actionHistoryRepository.save(actionHistory);
        questionAnswer.setDeleted(true);
        questionAnswerRepository.save(questionAnswer);


    }

    @Transactional
    @Override
    public void deleteByReport(long reportId, ActionReq actionReq) {

        Report report = reportRepository.findById(reportId).orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        if(!report.getEntityType().equals(EntityNameEnum.QUESTION_ANSWER)){
            throw new ResourceNotFoundException("Report not found");
        }
        QuestionAnswer questionAnswer = questionAnswerRepository.findById(report.getEntityId()).orElseThrow(() -> new ResourceNotFoundException("Question Answer not found"));
        report.setStatus(ReportStatus.RESOLVED);
        ActionHistory actionHistory = ActionHistory.builder()
                .admin((User) AuthUtil.getCurrentUser())
                .entityName(EntityNameEnum.QUESTION_ANSWER)
                .entityId(questionAnswer.getId())
                .type(ActionType.DELETE)
                .timestamp(LocalDateTime.now())
                .reason(actionReq.getReason())
                .build();
        actionHistoryRepository.save(actionHistory);
        report.setActionHistory(actionHistory);
        reportRepository.save(report);
        questionAnswer.setDeleted(true);
        questionAnswerRepository.save(questionAnswer);
    }

    @Override
    public QuestionAnswerRes getQuestionAnswerByIdIgnoreDeleted(long id) {

        return questionAnswerMapper.toQuestionAnswerRes(questionAnswerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Question Answer not found")));
    }


    public boolean checkUserAccess(User loggedInUser, Lecture lecture){

        if(loggedInUser.getRole().getName().equals(UserRole.ADMIN.toString())||loggedInUser.getRole().getName().equals(UserRole.ROOT.toString())){
            return true;
        }

        if(loggedInUser.getRole().getName().equals(UserRole.INSTRUCTOR.toString())){
            if(lecture.getChapter().getCourse().getInstructor().getId() == loggedInUser.getId()){
                return true;
            }
        }

        if(userCourseRepository.existsByUserIdAndCourseId(loggedInUser.getId(), lecture.getChapter().getCourse().getId())){
            return true;
        }
        return false;
    }

    public boolean checkUserAccess(User loggedInUser, Course course){

        if(loggedInUser.getRole().getName().equals(UserRole.ADMIN.toString())||loggedInUser.getRole().getName().equals(UserRole.ROOT.toString())){
            return true;
        }

        if(loggedInUser.getRole().getName().equals(UserRole.INSTRUCTOR.toString())){
            if(course.getInstructor().getId() == loggedInUser.getId()){
                return true;
            }
        }
        if(userCourseRepository.existsByUserIdAndCourseId(loggedInUser.getId(), course.getId())){
            return true;
        }
        return false;
    }


}
