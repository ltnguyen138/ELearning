import { Component, OnInit } from '@angular/core';
import {QuestionAnswerService} from "../../../service/question-answer.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../../service/course.service";
import {ChapterService} from "../../../service/chapter.service";
import {ConfirmationService} from "primeng/api";
import {QuestionAnswer} from "../../../model/question-answer";
import {QuestionAnswerQuery} from "../../../dtos/question-answer/question-answer.query";
import {LectureService} from "../../../service/lecture.service";
import {ActionReq} from "../../../dtos/action/action.req";

@Component({
  selector: 'app-question-answer-page',
  templateUrl: './question-answer-page.component.html',
  styleUrls: ['./question-answer-page.component.css']
})
export class QuestionAnswerPageComponent implements OnInit {

    questions: QuestionAnswer[] = [];
    totalPages: number = 0;
    totalElements: number = 0;
    visiblePages: number[] = [];
    keyword: string = '';
    questionQuery = new QuestionAnswerQuery();
    title: string = 'Danh sách tất cả câu hỏi';
    lectureIdFilter: number = -1;
    courseIdFilter: number = -1;
    sortBy: string = 'createdTime,desc';
    deleteForm!: FormGroup;
    isOpenDeleteModal: boolean = false;
    deleteId: number = 0;
    constructor(private questionAnswerService: QuestionAnswerService,
                private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                protected router: Router,
                private confirmService: ConfirmationService,
                private courseService: CourseService,
                private chapterService: ChapterService,
                private lectureService: LectureService,
                ) {
        this.deleteForm = this.fb.group({
            reason: ['', Validators.required]
        });

    }

    ngOnInit(): void {
        this.questionQuery.sort = this.sortBy;
        this.questionQuery.size = 14;
        this.route.queryParamMap.subscribe( params => {
            this.questionQuery.page = +params.get('page')! || this.questionQuery.page;
            this.questionQuery.sort = params.get('sort') || this.questionQuery.sort;
            this.questionQuery.keyword = params.get('keyword') || undefined;
            this.questionQuery.lectureId = +params.get('lectureId')! || undefined;
            this.questionQuery.courseId = +params.get('courseId')! || undefined;
            this.lectureIdFilter = +params.get('lectureId')! || -1;
            this.courseIdFilter = +params.get('courseId')! || -1;
            if(this.courseIdFilter != -1){
                this.courseService.getManagerCourse(this.courseIdFilter).subscribe({
                    next: response => {
                        this.title = 'Danh sách câu hỏi của khóa học ' + response.name;
                    },
                    error: () => {
                        this.toastr.error('Lỗi tải dữ liệu khóa học');
                    }
                });
            }
            if(this.lectureIdFilter != -1){
                this.lectureService.getManagerLecture(this.lectureIdFilter).subscribe({
                    next: response => {
                        this.title = this.title + ' - Bài giảng ' + response.name;
                    },
                    error: () => {
                        this.toastr.error('Lỗi tải dữ liệu bài giảng');
                    }
                });
            }
            this.getQuestions();
        });
    }

    getQuestions(): void {
        this.questionAnswerService.getPage(this.questionQuery).subscribe({
            next: response => {
                this.questions = response.content;
                this.totalElements = response.totalElements;
                this.totalPages = response.totalPages;
                this.visiblePages = this.generatePageArray();
            },
            error: () => {
                this.toastr.error('Lỗi tải dữ liệu câu hỏi');
            }
        });
    }

    generatePageArray(): number[] {
        return Array.from({ length: 9 }, (_, i) => 1 + i)
            .filter(num => num >= 1 && num <= this.totalPages);
    }

    updateUrlParams(): void {
        this.router.navigate([], {
                relativeTo: this.route,
                queryParams: this.questionQuery.queryParams,
            }
        )
    }

    pageChange(page: number): void {
        this.questionQuery.page = page;
        this.updateUrlParams();
    }

    search(): void {
        this.questionQuery.keyword = this.keyword;
        this.updateUrlParams();
    }

    sortChange(){
        this.questionQuery.sort = this.sortBy;
        this.questionQuery.page = 1;
        this.updateUrlParams();
    }

    changeFilterByLectureId(question: QuestionAnswer){
        // @ts-ignore
        this.lectureIdFilter = question.lecture.id;
        this.courseIdFilter = question.course.id;
        this.questionQuery.lectureId = this.lectureIdFilter;
        this.questionQuery.courseId = this.courseIdFilter
        this.questionQuery.page = 1;
        this.title = 'Danh sách câu hỏi của khóa học' + question.course.name + ' - Bài giảng ' + question.lecture.name;
        this.updateUrlParams();

    }

    changeFilterByCourseId(question: QuestionAnswer){
        // @ts-ignore
        this.courseIdFilter = question.course.id;
        this.lectureIdFilter = -1;
        this.questionQuery.courseId = this.courseIdFilter;
        this.questionQuery.lectureId = undefined;
        this.questionQuery.page = 1;
        this.title = 'Danh sách câu hỏi của khóa học' + question.course.name;
        this.updateUrlParams();
    }

    clearFilter(){
        this.questionQuery.lectureId = undefined;
        this.questionQuery.courseId = undefined;
        this.keyword = '';
        this.questionQuery.keyword = undefined;
        this.lectureIdFilter = -1;
        this.courseIdFilter = -1;
        this.questionQuery.page = 1;
        this.title = 'Danh sách tất cả câu hỏi';
        this.updateUrlParams();
    }

    openDeleteModal(id: number): void {
        this.deleteId = id;
        this.isOpenDeleteModal = true;
        this.deleteForm.reset();
    }

    deleteQuestionAnswer(): void {
        if(this.deleteForm.invalid){
            this.toastr.error('Vui lòng nhập lý do xóa');
            return;
        }
        const data: ActionReq = {
            ...this.deleteForm.value
        }
        this.confirmService.confirm({
            header: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn xóa câu hỏi đáp này?',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            accept: () => {
                this.questionAnswerService.delete(this.deleteId, data).subscribe({
                    next: () => {
                        this.toastr.success('Xóa thành công');
                        this.isOpenDeleteModal = false;
                        this.getQuestions();
                    },
                    error: () => {
                        this.toastr.error('Lỗi xóa câu hỏi');
                    }
                });
            }
        });
    }
}
