import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../service/course.service";
import {CategoryService} from "../../service/category.service";
import {ConfirmationService} from "primeng/api";
import {LectureService} from "../../service/lecture.service";
import {Course} from "../../model/course";
import {Chapter} from "../../model/chapter";
import {ChapterQuery} from "../../dtos/chapter/chapter.query";
import {ChapterService} from "../../service/chapter.service";
import { UserCourseService } from 'src/app/service/user-course.service';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-learner-statistics',
  templateUrl: './learner-statistics.component.html',
  styleUrls: ['./learner-statistics.component.css'],
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
export class LearnerStatisticsComponent implements OnInit {

    courseId?: number
    chapters: Chapter[] = [];
    chapterQuery = new ChapterQuery();
    course?: Course;
    countLearnerComplete: number = 0;
    isShowListCompleteLearner: boolean = false;

    constructor(private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private courseService: CourseService,
                protected router: Router,
                private categoryService: CategoryService,
                private confirmationService: ConfirmationService,
                private lectureService: LectureService,
                private chapterService: ChapterService,
                private userCourseService: UserCourseService) {

    }

    ngOnInit(): void {

        this.route.parent?.paramMap.subscribe(paramMap => {
            if (paramMap.has('id')) {
                this.courseService.getInstructorCourse(+paramMap.get('id')!).subscribe({
                    next: data => {
                        this.course = data;
                        this.chapterQuery.courseId = this.course.id;
                        this.getChapters();
                        this.countLearnerCompleteCourse();
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                        this.router.navigate(['/instructor/courses']);
                    }
                });
            }
        });

    }

    getChapters(): void {

        this.chapterService.getPublicPage(this.chapterQuery).subscribe({
            next: data => {
                this.chapters = data.content;
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });
    }

    countLearnerCompleteCourse(): void {
        this.userCourseService.countLearnerComplete(this.course!.id!).subscribe({
            next: data => {
                this.countLearnerComplete = data;
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });
    }
}
