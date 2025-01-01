import {Component, OnInit} from '@angular/core';
import {Chapter} from "../../model/chapter";
import {ChapterQuery} from "../../dtos/chapter/chapter.query";
import {Course} from "../../model/course";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../service/course.service";
import {ChapterService} from "../../service/chapter.service";
import {ConfirmationService} from "primeng/api";
import {ApprovalStatusEnum} from "../../enum/approval.status.enum";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-manager-course-content',
  templateUrl: './manager-course-content.component.html',
  styleUrls: ['./manager-course-content.component.css']
})
export class ManagerCourseContentComponent implements OnInit {

    chapters: Chapter[] = [];
    chapterQuery = new ChapterQuery();
    course!: Course;
    approvalStatus: string = '';
    constructor(private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private courseService: CourseService,
                protected router: Router,
                private chapterService: ChapterService,
                private confirmService: ConfirmationService) {
    }
    ngOnInit(): void {

        this.route.parent?.paramMap.subscribe(paramMap => {
            if (paramMap.has('id')) {
                this.courseService.getManagerCourse(+paramMap.get('id')!).subscribe({
                    next: data => {
                        this.course = data;
                        this.chapterQuery.courseId = this.course.id;
                        this.getChapters();
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
        this.chapterService.getManagerPage(this.chapterQuery).subscribe({
            next: data => {
                this.chapters = data.content;

            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });
    }



    protected readonly ApprovalStatusEnum = ApprovalStatusEnum;
}
