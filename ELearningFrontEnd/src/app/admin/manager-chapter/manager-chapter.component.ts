import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import {Chapter} from "../../model/chapter";
import {Lecture} from "../../model/lecture";
import {LectureQuery} from "../../dtos/lecture/lecture.query";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../service/course.service";
import {ChapterService} from "../../service/chapter.service";
import {LectureService} from "../../service/lecture.service";
import {ConfirmationService} from "primeng/api";
import {ChapterReq} from "../../dtos/chapter/chapter.req";
import {animate, style, transition, trigger} from "@angular/animations";
import {ApprovalStatusEnum} from "../../enum/approval.status.enum";

@Component({
    selector: 'app-manager-chapter',
    templateUrl: './manager-chapter.component.html',
    styleUrls: ['./manager-chapter.component.css'],
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
export class ManagerChapterComponent implements OnInit, OnChanges {

    @Input() chapter!: Chapter;
    @Input() approvalStatus: string = '';

    lectures: Lecture[] = [];
    lectureQuery = new LectureQuery();
    lectureCount: number = 0;
    isShowListLecture: boolean = false;

    constructor(private fb: FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private courseService: CourseService,
                protected router: Router,
                private chapterService: ChapterService,
                private lectureService: LectureService,
                private confirmService: ConfirmationService,
                private cdRef: ChangeDetectorRef) {

    }

    ngOnChanges(changes: SimpleChanges): void {

        if(changes['approvalStatus'] ){
            this.lectureQuery.approvalStatus = this.approvalStatus ? this.approvalStatus : undefined;

            this.getLectures();
        }
    }

    ngOnInit(): void {
    }

    getLectures(): void {
        if(!this.chapter || this.chapter.id === null) return;
        this.lectureQuery.chapterId = this.chapter.id;
        this.lectureService.getManagerPage(this.lectureQuery).subscribe({
            next: data => {
                this.lectures = data.content;
                this.lectureCount = data.totalElements;
                this.cdRef.detectChanges();
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });
    }


    toggleDisplayListLecture(): void {
        this.isShowListLecture = !this.isShowListLecture;
    }

    protected readonly ApprovalStatusEnum = ApprovalStatusEnum;
}
