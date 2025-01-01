import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Course} from "../../model/course";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Form, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {QuestionAnswerService} from "../../service/question-answer.service";
import {QuestionAnswerQuery} from "../../dtos/question-answer/question-answer.query";
import {QuestionAnswer} from "../../model/question-answer";
import {environment} from "../../environment";
import {QuestionAnswerReq} from "../../dtos/question-answer/question-answer.req";
import {animate, style, transition, trigger} from "@angular/animations";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-question-answers',
  templateUrl: './question-answers.component.html',
  styleUrls: ['./question-answers.component.css'],
    animations: [
        trigger('slideToggle', [
            transition(':enter', [
                style({height: '0', opacity: 0}),
                animate('300ms ease-out', style({height: '*', opacity: 1}))
            ]),
            transition(':leave', [
                animate('300ms ease-out', style({height: '0', opacity: 0}))
            ])
        ])
    ]
})
export class QuestionAnswersComponent implements OnInit, OnChanges{

    @Input() course?: Course
    @Input() lectureId?: number
    totalPages: number = 0;
    visiblePages: number[] = [];
    questionQuery = new QuestionAnswerQuery();
    questions: QuestionAnswer[] = [];
    keywords: string = '';
    lectureIdFilter: number = -1;
    totalQuestions: number = 0;
    searchKey: string = '';
    questionForm !: FormGroup;
    isShowQuestionForm: boolean = false;
    loggedUser = this.authService.getUserFromLocalStorage();

    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private authService: AuthService,
                private questionAnswerService: QuestionAnswerService,
                private confirmService: ConfirmationService,
                private cdRef: ChangeDetectorRef) {

        this.questionQuery.size = 5;
        this.questionForm = this.fb.group({
            content: ['', [Validators.required]]
        });

    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['course'] && this.course) {
            // Cập nhật courseId từ course được truyền vào
            this.questionQuery.courseId = this.course.id;

            // Gọi API để lấy câu hỏi
            this.getQuestions();
        }
    }

    ngOnInit(): void {
        this.route.firstChild?.params.subscribe(params => {
            this.lectureId = params['id'];
            if(this.lectureIdFilter != -1) {
                this.questionQuery.lectureId = this.lectureId || -1;
                this.lectureIdFilter = this.lectureId || -1;
            }
            console.log('lectureId: ', this.lectureId);
            if(this.course) {
                this.getQuestions();
            }
        });
    }



    getQuestions(){

        this.questionAnswerService.getPage(this.questionQuery).subscribe({
            next: response => {
                this.totalQuestions = response.totalElements;
                this.totalPages = response.totalPages;
                this.questions = response.content;
                this.cdRef.detectChanges();
            },
            error: err => {
                console.log(err);
            }
        });
    }

    getMoreQuestions(){
        this.questionQuery.page++;
        this.questionAnswerService.getPage(this.questionQuery).subscribe({
            next: response => {
                this.questions.push(...response.content);
                this.cdRef.detectChanges();
            },
            error: err => {
                console.log(err);
            }
        });
    }

    searchQuestions(){
        this.questionQuery.page = 1;
        this.questionQuery.keyword = this.keywords;
        this.searchKey = this.keywords;
        this.questions = [];
        this.getQuestions();
    }

    changeFilterByLectureId(){
        this.questionQuery.page = 1;
        this.questionQuery.lectureId = this.lectureIdFilter;
        this.questions = [];
        this.getQuestions();
    }

    clearFilter(){
        this.questionQuery.page = 1;
        this.questionQuery.lectureId = -1;
        this.questionQuery.keyword = '';
        this.keywords = '';
        this.searchKey = '';
        this.questions = [];
        this.getQuestions();
    }

    createQuestion(){

        if(this.questionForm.invalid){
            this.toastr.error('Vui lòng nhập nội dung câu hỏi');
            return;
        }

        const questionReq: QuestionAnswerReq = {
            ...this.questionForm.value,
            questionId: null,
            userId: this.loggedUser!.id!,
            lectureId: this.lectureId
        }

        this.questionAnswerService.create(questionReq).subscribe({
            next: response => {
                this.toastr.success('Đã tạo câu hỏi');
                this.questions = [];
                this.getQuestions();
                this.questionForm.reset();
                this.isShowQuestionForm = false;
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);

            }
        });
    }

    deleteQuestion(questionId: number){

        this.confirmService.confirm({
            header: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn xóa câu hỏi này?',
            icon: "fa-solid fa-triangle-exclamation text-red-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            acceptButtonStyleClass: 'bg-delete-btn text-white hover:delete-btn-h',
            accept: () => {
                this.questionAnswerService.deleteByOwner(questionId).subscribe({
                    next: data => {
                        this.questions = this.questions.filter(question => question.id !== questionId);
                        this.toastr.success('Xóa câu hỏi thành công');
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            }
        })
    }
    protected readonly environment = environment;
}
