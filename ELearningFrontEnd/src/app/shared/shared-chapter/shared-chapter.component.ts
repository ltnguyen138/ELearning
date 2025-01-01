import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Chapter} from "../../model/chapter";
import {LectureQuery} from "../../dtos/lecture/lecture.query";
import {Lecture} from "../../model/lecture";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../service/course.service";
import {ChapterService} from "../../service/chapter.service";
import {LectureService} from "../../service/lecture.service";
import {QuestionAnswerQuery} from "../../dtos/question-answer/question-answer.query";
import {QuestionAnswerService} from "../../service/question-answer.service";

@Component({
    selector: 'app-shared-chapter',
    templateUrl: './shared-chapter.component.html',
    styleUrls: ['./shared-chapter.component.css'],
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
export class SharedChapterComponent implements  OnInit, OnChanges{

    @Input() chapter!: Chapter;
    @Input() index!: number;
    lectures: Lecture[] = [];
    lectureQuery = new LectureQuery();
    isShowListLecture: boolean = false;

    constructor(private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private courseService: CourseService,
                protected router: Router,
                private chapterService: ChapterService,
                private lectureService: LectureService,
                private questionAnswerService: QuestionAnswerService) { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {

        if(changes['chapter'] && this.chapter.id !== null){
            this.getLectures();
        }
    }




    getLectures(): void {
        if(!this.chapter || this.chapter.id === null) return;
        this.lectureQuery.chapterId = this.chapter.id;
        this.lectureService.getManagerPage(this.lectureQuery).subscribe({
            next: data => {
                this.lectures = data.content;
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });
    }

    linkQa(lectureId: number | null): void {
        if(lectureId === null) return;
        this.router.navigate([],{
            relativeTo: this.route,
            queryParams: {lectureId: lectureId},
            queryParamsHandling: 'merge'
        })
    }
}
