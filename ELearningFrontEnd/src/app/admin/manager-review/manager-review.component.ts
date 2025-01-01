import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../service/course.service";
import {ChapterService} from "../../service/chapter.service";
import {ConfirmationService} from "primeng/api";
import { ReviewService } from 'src/app/service/review.service';
import { Review } from 'src/app/model/review';
import { ReviewQuery } from 'src/app/dtos/review/review.query';
import {environment} from "../../environment";
import {Course} from "../../model/course";

@Component({
  selector: 'app-manager-review',
  templateUrl: './manager-review.component.html',
  styleUrls: ['./manager-review.component.css']
})
export class ManagerReviewComponent implements OnInit {

    reviews: Review[] = [];
    totalPage: number = 0;
    reviewQuery = new ReviewQuery();
    totalElements: number = 0;
    visiblePages: number[] = [];
    keyword: string = '';
    title: string = 'Danh sách đánh giá của tất cả khóa học';
    deleteForm !:FormGroup
    isOpenDeleteModal: boolean = false;
    deleteId: number = 0;
    sortBy: string = 'createdTime,desc';
    ratingFilter: number = -1;
    courseIdFilter: number = -1;
    constructor(private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private courseService: CourseService,
                protected router: Router,
                private chapterService: ChapterService,
                private confirmService: ConfirmationService,
                private reviewService: ReviewService) {

        this.deleteForm = this.fb.group({
            reason: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.reviewQuery.sort = this.sortBy;
        this.route.queryParamMap.subscribe( params => {
            this.reviewQuery.page = +params.get('page')! || this.reviewQuery.page;
            this.reviewQuery.sort = params.get('sort') || this.reviewQuery.sort;
            this.reviewQuery.keyword = params.get('keyword') || undefined;
            this.reviewQuery.rating = +params.get('rating')! || undefined;
            this.reviewQuery.courseId = +params.get('courseId')! || undefined;
            if(this.reviewQuery.courseId){
                this.courseService.getManagerCourse(this.reviewQuery.courseId).subscribe({
                    next: course => {
                        this.title = 'Danh sách đánh giá của khóa học: ' + course.name;
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            }
            this.keyword = this.reviewQuery.keyword || '';
            this.ratingFilter = this.reviewQuery.rating || -1;

            this.getReviews();
        });
    }

    getReviews(): void {
        this.reviewQuery.size = 12;
        this.reviewService.getManagerPage(this.reviewQuery).subscribe({
            next: data => {
                this.reviews = data.content;
                this.totalPage = data.totalPages;
                this.totalElements = data.totalElements;
                this.visiblePages = this.generatePageArray();
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });
    }

    generatePageArray(): number[] {
        return Array.from({ length: 9 }, (_, i) => 1 + i)
            .filter(num => num >= 1 && num <= this.totalPage);
    }

    updateUrlParams(): void {
        this.router.navigate([], {
                relativeTo: this.route,
                queryParams: this.reviewQuery.queryParams,
            }
        )
    }

    pageChange(page: number): void {
        this.reviewQuery.page = page;
        this.updateUrlParams();
    }

    search(): void {
        this.reviewQuery.keyword = this.keyword;
        this.updateUrlParams();
    }

    deleteReview(): void {

        if(this.deleteForm.invalid){
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
                this.reviewService.deleteByAdmin(this.deleteId, this.deleteForm.value).subscribe({
                    next: () => {
                        this.toastr.success('Xóa đánh giá thành công');
                        this.isOpenDeleteModal = false;
                        this.getReviews();
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            },
            reject: () => {
                this.isOpenDeleteModal = false;
                this.deleteId = 0;
            }
        });
    }

    openDeleteModal(deleteId: number): void {
        this.isOpenDeleteModal = true;
        this.deleteId = deleteId;
    }

    sortChange(){
        this.reviewQuery.sort = this.sortBy;
        this.updateUrlParams();
    }

    ratingFilterChange($event: any){
        this.reviewQuery.rating = this.ratingFilter;
        this.reviewQuery.page = 1;
        this.updateUrlParams();
    }

    courseIdFilterChange(course: Course){
        this.courseIdFilter = course.id;
        this.reviewQuery.courseId = this.courseIdFilter;
        this.title = 'Danh sách đánh giá của khóa học: ' + course.name;
        this.reviewQuery.page = 1;
        this.updateUrlParams();
    }

    clearFilter(){
        this.keyword = '';
        this.ratingFilter = -1;
        this.reviewQuery.keyword = undefined;
        this.reviewQuery.rating = undefined;
        this.reviewQuery.page = 1;
        this.reviewQuery.courseId = -1;
        this.title = 'Danh sách đánh giá của tất cả khóa học';

        this.courseIdFilter = -1;
        this.updateUrlParams();
    }
    protected readonly environment = environment;
}
