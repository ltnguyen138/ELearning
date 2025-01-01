import {
    AfterViewInit,
    ChangeDetectorRef,
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
import {QuestionAnswerService} from "../../../service/question-answer.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ConfirmationService} from "primeng/api";
import {CourseService} from "../../../service/course.service";
import {ChapterService} from "../../../service/chapter.service";
import {LectureService} from "../../../service/lecture.service";
import {QuestionAnswer} from "../../../model/question-answer";
import {environment} from "../../../environment";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'app-question-answer',
    templateUrl: './question-answer.component.html',
    styleUrls: ['./question-answer.component.css'],
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
export class QuestionAnswerComponent implements OnInit, OnChanges, AfterViewInit {

    @Input() questionAnswer!: QuestionAnswer;
    @Input() isQuestion = false;
    @Output() deleteAnswer = new EventEmitter<number>();
    @Output() deleteQuestionAnswer = new EventEmitter<number>();
    answers: QuestionAnswer[] = [];
    showFullContent: boolean = false;
    @ViewChild('textContent') textContent!: ElementRef;
    showFullText = false;
    isClamped = false;
    isShowAnswer = false;
    deleteId: number = 0;

    constructor(private questionAnswerService: QuestionAnswerService,
                private fb: FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                protected router: Router,
                private confirmService: ConfirmationService,
                private courseService: CourseService,
                private chapterService: ChapterService,
                private lectureService: LectureService,
                private cdRef: ChangeDetectorRef
    ) {
    }

    ngAfterViewInit(): void {
        this.checkClamped();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes['questionAnswer'] && this.questionAnswer){
            this.answers = this.questionAnswer.answers;
        }
    }

    ngOnInit(): void {
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
        this.cdRef.detectChanges();
    }

    onDeleteAnswer(id: number): void {
        this.deleteAnswer.emit(id);
    }
    onDeleteQuestionAnswer(id: number): void {
        this.deleteQuestionAnswer.emit(id);
    }


    protected readonly environment = environment;
}
