import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output, SimpleChanges,
    ViewChild
} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {QuestionAnswer} from "../../model/question-answer";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../service/auth.service";
import {QuestionAnswerService} from "../../service/question-answer.service";
import {ConfirmationService} from "primeng/api";
import {ReportService} from "../../service/report.service";
import {QuestionAnswerReq} from "../../dtos/question-answer/question-answer.req";
import {ReportReq} from "../../dtos/report/report.req";
import {EntityNameEnum} from "../../enum/entity.name.enum";
import { environment } from 'src/app/environment';
import {QuestionAnswerQuery} from "../../dtos/question-answer/question-answer.query";

@Component({
    selector: 'app-shared-question',
    templateUrl: './shared-question.component.html',
    styleUrls: ['./shared-question.component.css'],
    animations: [
        trigger('slideToggle', [
            transition(':enter', [
                style({height: '0', opacity: 0}),
                animate('300ms ease-out', style({height: '*', opacity: 1}))
            ]),
            transition(':leave', [
                animate('300ms ease-out', style({height: '0', opacity: 0}))
            ])
        ]),
        trigger('slideToggle2', [
            transition(':enter', [
                style({height: '0', opacity: 0}),
                animate('300ms ease-out', style({height: '*', opacity: 1}))
            ])
        ]),
        trigger('slideToggle3', [
            transition(':enter', [
                style({height: '*', opacity: 0}),
                animate('300ms ease-out', style({height: '90px', opacity: 1}))
            ])
        ]),
    ]
})
export class SharedQuestionComponent implements OnInit, OnChanges, AfterViewInit {

    @Input() question!: QuestionAnswer;
    @Input() lectureId?: number
    @Input() index!: number;
    @Output() deleteQuestion = new EventEmitter<number>();
    @Output() deleteByAdmin = new EventEmitter<number>();
    answers: QuestionAnswer[] = [];
    countAnswer: number = 0;
    showFullContent: boolean = false;
    @ViewChild('textContent') textContent!: ElementRef;
    showFullText = false;
    isClamped = false;
    isShowAnswer = false;
    loggedUser = this.authService.getUserFromLocalStorage();
    answerForm !: FormGroup;
    isShowAnswerForm: boolean = false;
    editQuestionForm !: FormGroup;
    isShowEditQuestionForm: boolean = false;
    reportForm!: FormGroup;
    isOpenReportForm: boolean = false;
    answersQuery: QuestionAnswerQuery = new QuestionAnswerQuery();
    answer: QuestionAnswer[] = [];

    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private authService: AuthService,
                private questionAnswerService: QuestionAnswerService,
                private confirmService: ConfirmationService,
                private reportService: ReportService) {

        this.answerForm = this.fb.group({
            content: ['', [Validators.required]],
        });

        this.editQuestionForm = this.fb.group({
            content: ['', [Validators.required]],
        });
        this.reportForm = this.fb.group({
            reason: ['', Validators.required]
        });
    }

    ngAfterViewInit(): void {
        this.checkClamped();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['question'] && this.question){

            this.editQuestionForm.patchValue({
                content: this.question.content
            });

            this.getAnswer();
        }
    }

    ngOnInit(): void {
    }

    getAnswer()  {
        debugger
        this.answersQuery.size = 1000;
        this.answersQuery.questionId = this.question.id;
        this.answersQuery.courseId = this.question.course.id;
        this.questionAnswerService.getPage(this.answersQuery).subscribe({
            next: data => {
                this.answer = data.content
                this.answers = data.content;
                this.countAnswer = data.totalElements;
            },
            error: error => {
                this.toastr.error('Lấy câu trả lời thất bại');
            }
        });
    }

    toggleText(): void {
        this.showFullText = !this.showFullText;
    }
    checkClamped(): void {
        const element = this.textContent.nativeElement;

        // Chiều cao tối đa của 2 dòng
        const maxHeight = parseFloat(getComputedStyle(element).lineHeight) * 2;

        // Kiểm tra nếu chiều cao thực tế lớn hơn chiều cao tối đa
        if (element.scrollHeight > maxHeight) {
            this.isClamped = true;
        }
    }

    createAnswer(): void {
        if(this.answerForm.invalid){
            this.toastr.error('Vui lòng nhập câu trả lời');
            return;
        }

        const answerReq: QuestionAnswerReq = {
            ...this.answerForm.value,
            questionId: this.question.id,
            userId: this.loggedUser!.id,
            lectureId: this.lectureId
        }

        this.questionAnswerService.create(answerReq).subscribe({
            next: data => {
                this.toastr.success('Trả lời thành công');
                this.answerForm.reset();
                this.isShowAnswerForm = false;
                this.answers.push(data)
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });
    }

    editQuestion(): void {

        if(this.editQuestionForm.invalid){
            this.toastr.error('Vui lòng nhập câu hỏi');
            return;
        }
        const questionReq = {
            ...this.editQuestionForm.value,
            userId: this.loggedUser!.id,
            lectureId: this.lectureId,
        }

        this.questionAnswerService.update(this.question.id, questionReq).subscribe({
            next: data => {
                this.toastr.success('Cập nhật thành công');
                this.question = data;
                this.isShowEditQuestionForm = false;
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });

    }

    onDelQuestion(): void {
        this.deleteQuestion.emit(this.question.id);
    }

    onDelByAdmin(): void {
        this.deleteByAdmin.emit(this.question.id);
    }
    onDelAnswerByAdmin(answerId: number): void {
        this.deleteByAdmin.emit(answerId);
    }

    deleteAnswer(answerId: number): void {

        this.confirmService.confirm({
            header: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn xóa câu hỏi này?',
            icon: "fa-solid fa-triangle-exclamation text-red-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            acceptButtonStyleClass: 'bg-delete-btn text-white hover:delete-btn-h',
            accept: () => {
                this.questionAnswerService.deleteByOwner(answerId).subscribe({
                    next: data => {
                        this.answers = this.answers.filter(answer => answer.id !== answerId);
                        this.toastr.success('Xóa câu hỏi thành công');
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            }
        })
    }

    reportAnswer(): void {
        if(this.reportForm.invalid){
            this.toastr.error('Vui lòng nhập lý do báo cáo');
            return;
        }
        const reportReq: ReportReq = {
            ...this.reportForm.value,
            entityType: EntityNameEnum.QUESTION_ANSWER,
            entityId: this.question.id,
            userId: this.loggedUser!.id
        }
        this.reportService.create(reportReq).subscribe({
            next: data => {
                this.toastr.success('Báo cáo thành công');
                this.isOpenReportForm = false;
            },
            error: error => {
                this.toastr.error('Báo cáo thất bại');
            }
        });
    }

    isRootOrAdmin(): boolean {

        if(!this.loggedUser) return false;
        return this.loggedUser?.role.name === 'ROOT' || this.loggedUser?.role.name === 'ADMIN';
    }
    protected readonly environment = environment;
}
