import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {QuestionAnswer} from "../../model/question-answer";
import {environment} from "../../environment";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../service/auth.service";
import {UserService} from "../../service/user.service";
import {TokenService} from "../../service/token.service";
import {CategoryService} from "../../service/category.service";
import {CourseService} from "../../service/course.service";
import {ChapterService} from "../../service/chapter.service";
import {LectureService} from "../../service/lecture.service";
import {CartService} from "../../service/cart.service";
import {ReviewService} from "../../service/review.service";
import {QuestionAnswerService} from "../../service/question-answer.service";
import {QuestionAnswerReq} from "../../dtos/question-answer/question-answer.req";
import {animate, style, transition, trigger} from "@angular/animations";
import { ReportService } from 'src/app/service/report.service';
import {ReportReq} from "../../dtos/report/report.req";
import {EntityNameEnum} from "../../enum/entity.name.enum";

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css'],
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
export class AnswersComponent implements OnInit,  AfterViewInit, OnChanges{

    @Input() answer!: QuestionAnswer;
    @Input() questionId!: number;
    @Input() lectureId?: number
    @ViewChild('textContent') textContent!: ElementRef;
    @Output() deleteAnswer = new EventEmitter<number>();
    showFullText = false;
    isClamped = false;
    editAnswerForm !: FormGroup;
    isShowEditAnswerForm: boolean = false;
    loggedUser = this.authService.getUserFromLocalStorage();
    reportForm!: FormGroup;
    isOpenReportForm: boolean = false;
    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private authService: AuthService,
                private userService: UserService,
                private tokenService: TokenService,
                private categoryService: CategoryService,
                private courseService: CourseService,
                private chapterService: ChapterService,
                private lectureService: LectureService,
                private cartService: CartService,
                private reviewService: ReviewService,
                private questionAnswerService: QuestionAnswerService,
                private reportService: ReportService) {

        this.editAnswerForm = this.fb.group({
            content: ['', Validators.required],
        });

        this.reportForm = this.fb.group({
            reason: ['', Validators.required]
        });

    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['answer'] && this.answer){
            this.editAnswerForm.patchValue({
                content: this.answer.content
            });
        }
    }
    ngAfterViewInit(): void {
        this.checkClamped();
    }


    ngOnInit(): void {
    }

    editAnswer(): void {

        if(this.editAnswerForm.invalid){
            this.toastr.error('Vui lòng nhập nội dung câu trả lời');
            return;
        }
        const answerReq: QuestionAnswerReq = {
            ...this.editAnswerForm.value,
            lectureId: this.lectureId,
            userId: this.loggedUser!.id,
            questionId: this.questionId
        }
        this.questionAnswerService.update(this.answer.id, answerReq).subscribe({
            next: data => {
                this.toastr.success('Cập nhật câu trả lời thành công');
                this.isShowEditAnswerForm = false;
                this.answer = data;
            },
            error: error => {
                this.toastr.error('Cập nhật câu trả lời thất bại');
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

    onDeleteAnswer(): void {

        this.deleteAnswer.emit(this.answer.id);
    }

    reportAnswer(): void {
        if(this.reportForm.invalid){
            this.toastr.error('Vui lòng nhập lý do báo cáo');
            return;
        }
        const reportReq: ReportReq = {
            ...this.reportForm.value,
            entityType: EntityNameEnum.QUESTION_ANSWER,
            entityId: this.answer.id,
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

    protected readonly environment = environment;
}
