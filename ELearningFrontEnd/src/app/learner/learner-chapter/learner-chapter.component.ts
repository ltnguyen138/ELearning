import { Component, Input, OnInit } from '@angular/core';
import { Chapter } from 'src/app/model/chapter';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import { LectureService } from 'src/app/service/lecture.service';
import {Lecture} from "../../model/lecture";
import {LectureQuery} from "../../dtos/lecture/lecture.query";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-learner-chapter',
  templateUrl: './learner-chapter.component.html',
  styleUrls: ['./learner-chapter.component.css'],
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
export class LearnerChapterComponent implements OnInit {

    @Input() chapter!: Chapter ;
    @Input() learnLectureComplate: number[] = [];
    lectures: Lecture[] = [];
    lectureQuery = new LectureQuery();
    lectureCount: number = 0;
    isShowListLecture: boolean = false;
    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private lectureService: LectureService,) {

    }
    ngOnInit(): void {


        this.getLectureByChapterId();
    }

    getLectureByChapterId() {
        if(!this.chapter || this.chapter.id === null) return;
        this.lectureQuery.chapterId = this.chapter.id;

        this.lectureService.getPublicPage(this.lectureQuery).subscribe({
            next: data => {
                this.lectures = data.content;
                this.lectureCount = data.totalElements;

            },
            error: err => {
                this.toastr.error('Không tìm thấy bài giảng', 'Lỗi');
            }
        });
    }
}
