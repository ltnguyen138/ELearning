import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {UserService} from "../../service/user.service";
import {TokenService} from "../../service/token.service";
import {CategoryService} from "../../service/category.service";
import {CourseService} from "../../service/course.service";
import {ChapterService} from "../../service/chapter.service";
import {LectureService} from "../../service/lecture.service";
import {CartService} from "../../service/cart.service";
import {User} from "../../model/user";
import {Course} from "../../model/course";
import {Chapter} from "../../model/chapter";
import {ChapterQuery} from "../../dtos/chapter/chapter.query";
import {catchError, Observable, of} from 'rxjs';
import { ReviewService } from 'src/app/service/review.service';
import { QuestionAnswerService } from 'src/app/service/question-answer.service';
import {animate, style, transition, trigger} from "@angular/animations";
import {CourseLevelEnum} from "../../enum/course.level.enum";
import {environment} from "../../environment";
import { UserCourseService } from 'src/app/service/user-course.service';
import {UserCourse} from "../../model/user-course";

@Component({
  selector: 'app-learn-course',
  templateUrl: './learn-course.component.html',
  styleUrls: ['./learn-course.component.css'],
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
export class LearnCourseComponent implements OnInit {

    loggedUser: User | null = null;
    currenCourse?: Course;
    courseAlias: string = '';
    chapters: Chapter[] = [];
    chapterQuery = new ChapterQuery();
    chapterCount: number = 0;
    lectureCount: number = 0;
    selectedTab: string = 'overview';
    lectureId: number = 0;
    currentLectureId: number = 0;
    learnLectureComplate: number[] = [];
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
                private userCourseService: UserCourseService) {
    }

    ngOnInit(): void {
        if (this.route.snapshot.paramMap.has('alias')) {
            this.courseAlias = this.route.snapshot.paramMap.get('alias')!;
            this.loadData();
        } else {
            this.router.navigateByUrl('/');
        }

        this.route.fragment.subscribe(fragment => {
            if (fragment === null) {
                this.selectedTab = 'list-lecture';
            }
            if (fragment === "overview") {
                this.selectedTab = 'overview';
            }
            if (fragment === "review") {
                this.selectedTab = 'review';
            }
            if (fragment === "questions") {
                this.selectedTab = 'questions';
            }
            if(fragment === "note"){
                this.selectedTab = 'note';
            }
        });

        this.route.firstChild?.params.subscribe(params => {
            // debugger;
            this.lectureId = params['id'];
            this.userCourseService.updateCurrentLectureId(this.courseAlias, this.lectureId).subscribe({
                next: data => {
                    this.currentLectureId = data.currentLectureId;

                },
                error: err => {
                    this.toastr.error('Error: ' + err.error);
                }
            });
        });
    }

    getPurchasedCourseByAlias(alias: string): Observable<UserCourse> {

        return this.userCourseService.getByAliasAndUserId(alias).pipe(
            catchError(err => {
                this.toastr.error('Error: ' + err.error.message);
                this.router.navigateByUrl('/');
                return of(thorwError(err));
            })
        );
    }

    getChapter(): void {
        this.chapterService.getPublicPage(this.chapterQuery).subscribe({
            next: data => {
                this.chapters = data.content;
                this.chapterCount = data.totalElements;
            },
            error: err => {
                this.toastr.error('Error: ' + err.error.message);
            }
        });
    }

    getLectureCount() {
        debugger;
        this.lectureService.countLectureByCourseId(this.currenCourse!.id).subscribe({
            next: data => {
                this.lectureCount = data.totalLecture;

            },
            error: error => {
                this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');
            }
        });
    }

    loadData(): void {

        this.getPurchasedCourseByAlias(this.courseAlias).subscribe({

            next: data => {
                this.currenCourse = data.course;
                // if(data.currentLectureId && data.currentLectureId != 0){
                //     this.router.navigate(['/learn', this.currenCourse.alias, data.currentLectureId], {fragment: 'overview'});
                // }
                // debugger;
                this.learnLectureComplate = data.lectures.map(lecture => lecture.lectureId);
                if(data.currentLectureId && data.currentLectureId != 0){
                    this.router.navigate(["/learn/"+this.currenCourse.alias, data.currentLectureId], {fragment: 'overview'});
                }

                this.chapterQuery.courseId = this.currenCourse.id;
                this.getChapter();
                this.getLectureCount();
            },
            error: err => {
                this.toastr.error('Error: ' + err.error.message);
            }
        });

    }


    getSkillLevel(level: string): string {
        return CourseLevelEnum[level as keyof typeof CourseLevelEnum] || 'Unknown';
    }

    getCourseRating() {
        debugger
        if(this.currenCourse){
            return
        }
        this.courseService.getByAlias(this.currenCourse!.alias!).subscribe({
            next: data => {
                this.currenCourse = data;
            },
            error: err => {

            }
        });

    }





    protected readonly environment = environment;
}
function thorwError(err: any): any {
    throw new Error('Function not implemented.');
}

