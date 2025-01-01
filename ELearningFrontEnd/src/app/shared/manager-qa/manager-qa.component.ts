import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {Chapter} from "../../model/chapter";
import {ChapterQuery} from "../../dtos/chapter/chapter.query";
import {Course} from "../../model/course";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../service/course.service";
import {ChapterService} from "../../service/chapter.service";
import {ConfirmationService} from "primeng/api";
import {QuestionAnswerQuery} from "../../dtos/question-answer/question-answer.query";
import {QuestionAnswer} from "../../model/question-answer";
import { AuthService } from 'src/app/service/auth.service';
import {QuestionAnswerService} from "../../service/question-answer.service";
import {QuestionAnswerReq} from "../../dtos/question-answer/question-answer.req";

@Component({
    selector: 'app-manager-qa',
    templateUrl: './manager-qa.component.html',
    styleUrls: ['./manager-qa.component.css'],
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
export class ManagerQaComponent implements OnInit {

    course?: Course;
    courseId?: number
    lectureId?: number
    chapters: Chapter[] = [];
    chapterQuery = new ChapterQuery();

    totalPages: number = 0;
    visiblePages: number[] = [];
    questionQuery = new QuestionAnswerQuery();
    questions: QuestionAnswer[] = [];
    keywords: string = '';
    lectureIdFilter: number = -1;
    totalQuestions: number = 0;
    searchKey: string = '';
    questionForm !: FormGroup;
    isShowQuestionForm: boolean = false;
    loggedUser = this.authService.getUserFromLocalStorage();
    adminDeleteForm !:FormGroup
    isOpenAdminDeleteModal: boolean = false;
    deleteId: number = 0;

    constructor(private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private courseService: CourseService,
                protected router: Router,
                private chapterService: ChapterService,
                private confirmService: ConfirmationService,
                private authService: AuthService,
                private questionAnswerService: QuestionAnswerService,
    ) {
        this.questionQuery.size = 5;
        this.questionForm = this.fb.group({
            content: ['', [Validators.required]]
        });

        this.adminDeleteForm = this.fb.group({
            reason: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {

        this.route.parent?.paramMap.subscribe(paramMap => {
            if (paramMap.has('id')) {
                this.courseId = +paramMap.get('id')!;
                if(this.loggedUser?.role.name === 'INSTRUCTOR') {
                    this.courseService.getInstructorCourse(+paramMap.get('id')!).subscribe({
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
                } else if (this.loggedUser?.role.name === 'ADMIN' || this.loggedUser?.role.name === 'ROOT') {
                    this.courseService.getManagerCourse(+paramMap.get('id')!).subscribe({
                        next: data => {
                            this.course = data;
                            this.chapterQuery.courseId = this.course.id;
                            this.getChapters();
                        },
                        error: err => {
                            this.toastr.error('Lỗi: ' + err.error.message);
                            this.router.navigate(['/admin/courses']);
                        }
                    });
                }

            }
        });

        this.route.queryParams.subscribe(params => {

            this.questionQuery.page = params['page'] || 1;
            this.keywords = params['keyword'] || '';
            this.questionQuery.keyword = this.keywords;

            this.lectureId = params['lectureId'];
            if(this.lectureIdFilter != -1) {
                this.questionQuery.lectureId = this.lectureId || -1;
                this.lectureIdFilter = this.lectureId || -1;
            }
            this.getQuestions();
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

    getQuestions(){
        this.questionQuery.courseId = this.courseId || -1;

        this.questionAnswerService.getPage(this.questionQuery).subscribe({
            next: response => {
                this.totalQuestions = response.totalElements;
                this.totalPages = response.totalPages;
                this.questions = response.content;
                this.visiblePages = this.generatePageArray();
            },
            error: err => {
                console.log(err);
            }
        });
    }

    searchQuestions(){
        this.questionQuery.page = 1;
        this.questionQuery.keyword = this.keywords;
        this.searchKey = this.keywords;
        this.questions = [];
        this.getQuestions();
    }

    changeFilterByLectureId(){
        this.questionQuery.page = 1;
        this.questionQuery.lectureId = this.lectureIdFilter;
        this.questions = [];
        this.getQuestions();
    }

    clearFilter(){
        this.questionQuery.page = 1;
        this.questionQuery.lectureId = -1;
        this.questionQuery.keyword = '';
        this.keywords = '';
        this.searchKey = '';
        this.questions = [];
        this.updateUrlParams();
    }

    createQuestion(){

        if(this.questionForm.invalid){
            this.toastr.error('Vui lòng nhập nội dung câu hỏi');
            return;
        }

        const questionReq: QuestionAnswerReq = {
            ...this.questionForm.value,
            questionId: null,
            userId: this.loggedUser!.id!,
            lectureId: this.lectureId
        }

        this.questionAnswerService.create(questionReq).subscribe({
            next: response => {
                this.toastr.success('Đã tạo câu hỏi');
                this.questions = [];
                this.getQuestions();
                this.questionForm.reset();
                this.isShowQuestionForm = false;
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);

            }
        });
    }

    deleteQuestion(questionId: number){

        this.confirmService.confirm({
            header: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn xóa câu hỏi này?',
            icon: "fa-solid fa-triangle-exclamation text-red-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            acceptButtonStyleClass: 'bg-delete-btn text-white hover:delete-btn-h',
            accept: () => {
                this.questionAnswerService.deleteByOwner(questionId).subscribe({
                    next: data => {
                        this.questions = this.questions.filter(question => question.id !== questionId);
                        this.toastr.success('Xóa câu hỏi thành công');
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            }
        })
    }



    pageChange(page: number) {
        this.questionQuery.page = page;
        this.updateUrlParams();
    }
    updateUrlParams() {
        this.router.navigate([], {
                relativeTo: this.route,
                queryParams: this.questionQuery.queryParams,
            }
        )
    }
    generatePageArray(): number[] {
        return Array.from({ length: 9 }, (_, i) => this.questionQuery.page - 4 + i)
            .filter(num => num >= 1 && num <= this.totalPages);
    }



    openAdminDeleteModal(deleteId: number): void {
        this.isOpenAdminDeleteModal = true;
        this.deleteId = deleteId;
    }

    deleteByAdmin(): void {

        if(this.adminDeleteForm.invalid){
            this.toastr.error('Vui lòng nhập lý do xóa');
            return;
        }
        this.confirmService.confirm({
            message: 'Bạn có chắc chắn muốn xóa đánh giá này?',
            header: 'Xác nhận',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            accept: () => {
                this.questionAnswerService.delete(this.deleteId, this.adminDeleteForm.value).subscribe({
                    next: () => {
                        this.toastr.success('Xóa đánh giá thành công');
                        this.isOpenAdminDeleteModal = false;
                        this.clearFilter();
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            },
            reject: () => {
                this.isOpenAdminDeleteModal = false;
                this.deleteId = 0;
            }
        });
    }
}
