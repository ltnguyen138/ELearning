import {Component, Input} from '@angular/core';
import {Chapter} from "../../model/chapter";
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../service/course.service";
import {ChapterService} from "../../service/chapter.service";
import {LectureService} from "../../service/lecture.service";
import {ConfirmationService} from "primeng/api";
import {Lecture} from "../../model/lecture";
import {LectureQuery} from "../../dtos/lecture/lecture.query";
import {LearnerCompleteLectureRes} from "../../dtos/lecture/learner-complete-lecture.res";
import {animate, style, transition, trigger} from "@angular/animations";
import {ApprovalStatusEnum} from "../../enum/approval.status.enum";

@Component({
    selector: 'app-list-complete-learner',
    templateUrl: './list-complete-learner.component.html',
    styleUrls: ['./list-complete-learner.component.css'],
    animations: [
        trigger('slideToggle', [
            transition(':enter', [
                style({ height: '0', opacity: 0 }),
                animate('300ms ease-out', style({ height: '*', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('300ms ease-out', style({ height: '0', opacity: 0 }))
            ])
        ])
    ]
})
export class ListCompleteLearnerComponent {

    @Input() chapter!: Chapter;
    @Input() index!: number;
    lectures: LearnerCompleteLectureRes[] = [];
    lectureQuery = new LectureQuery();
    isShowListLecture: boolean = false;
    constructor(private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private courseService: CourseService,
                protected router: Router,
                private chapterService: ChapterService,
                private lectureService: LectureService,
                ) {
    }

    ngOnInit(): void {

        this.getLectures();
    }

    getLectures(): void {

        if(!this.chapter || this.chapter.id === null) return;
        this.lectureQuery.chapterId = this.chapter.id;
        this.lectureService.getLearnerCompleteLecture(this.lectureQuery).subscribe({
            next: data => {
                this.lectures = data.content;
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });
    }

    protected readonly ApprovalStatusEnum = ApprovalStatusEnum;
}
