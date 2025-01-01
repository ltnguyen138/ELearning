import { Component, OnInit } from '@angular/core';
import {Review} from "../../model/review";
import {ReviewQuery} from "../../dtos/review/review.query";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {UserService} from "../../service/user.service";
import {TokenService} from "../../service/token.service";
import {CategoryService} from "../../service/category.service";
import {CourseService} from "../../service/course.service";
import {ChapterService} from "../../service/chapter.service";
import {LectureService} from "../../service/lecture.service";
import {CartService} from "../../service/cart.service";
import {ReviewService} from "../../service/review.service";
import {QuestionAnswerService} from "../../service/question-answer.service";
import {ReportService} from "../../service/report.service";
import {Course} from "../../model/course";
import {ReportReq} from "../../dtos/report/report.req";
import {EntityNameEnum} from "../../enum/entity.name.enum";
import { environment } from 'src/app/environment';
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-shared-manager-reviews',
  templateUrl: './shared-manager-reviews.component.html',
  styleUrls: ['./shared-manager-reviews.component.css']
})
export class SharedManagerReviewsComponent implements OnInit {

    course?: Course;
    courseId?: number
    reviews: Review[] = [];
    totalPages: number = 0;
    visiblePages: number[] = [];
    reviewQuery = new ReviewQuery();
    loggedUser = this.authService.getUserFromLocalStorage();
    reportReviewId: number = 0;
    reportForm!: FormGroup;
    isOpenReportForm: boolean = false;
    countReview: number = 0;
    rating ?: number= -1;
    deleteForm !:FormGroup
    isOpenDeleteModal: boolean = false;
    sortBy: string = 'createdTime,desc';
    ratingFilter: number = -1;
    deleteId: number = 0;
    keyword: string = '';

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
                private reportService: ReportService,
                private confirmService: ConfirmationService) {


        this.reportForm = this.fb.group({
            reason: ['', Validators.required]
        });

        this.deleteForm = this.fb.group({
            reason: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.reviewQuery.size = 800;
        this.route.parent?.paramMap.subscribe(paramMap => {
            if (paramMap.has('id')) {
                this.courseId = +paramMap.get('id')!;
                if(this.loggedUser?.role.name === 'INSTRUCTOR') {
                    this.courseService.getInstructorCourse(+paramMap.get('id')!).subscribe({
                        next: data => {
                            this.course = data;
                            this.getReviews();
                        },
                        error: err => {
                            this.toastr.error('Lỗi: ' + err.error.message);
                            this.router.navigate(['/instructor/courses']);
                        }
                    });
                }else if (this.loggedUser?.role.name === 'ADMIN' || this.loggedUser?.role.name === 'ROOT') {
                    this.courseService.getManagerCourse(+paramMap.get('id')!).subscribe({
                        next: data => {
                            this.course = data;
                            this.getReviews();
                        },
                        error: err => {
                            this.toastr.error('Lỗi: ' + err.error.message);
                            this.router.navigate(['/admin/courses']);
                        }
                    });
                }

            }
        });

        this.route.queryParamMap.subscribe( params => {
            this.reviewQuery.page = +params.get('page')! || this.reviewQuery.page;
            this.reviewQuery.sort = params.get('sort') || this.reviewQuery.sort;
            this.reviewQuery.comment = params.get('comment') || undefined;
            this.reviewQuery.rating = +params.get('rating')! || undefined;
            this.reviewQuery.courseId = +params.get('courseId')! || undefined;
            debugger;
            this.keyword = this.reviewQuery.comment || '';
            this.ratingFilter = this.reviewQuery.rating || -1;

            this.getReviews();
        });
    }

    getReviews() {

        this.reviewQuery.sort = 'createdTime,desc';
        this.reviewService.getPublicByCourseId(this.course!.id!, this.reviewQuery).subscribe({
            next: data => {
                this.reviews = data.content;
                this.totalPages = data.totalPages;
                this.visiblePages = this.generatePageArray();
            },
            error: err => {
                this.toastr.error('Lỗi: ' + "Không thể lấy danh sách review ");
            }
        });
    }

    reportAnswer(): void {
        if(this.reportForm.invalid){
            this.toastr.error('Vui lòng nhập lý do báo cáo');
            return;
        }
        const reportReq: ReportReq = {
            ...this.reportForm.value,
            entityType: EntityNameEnum.REVIEW,
            entityId: this.reportReviewId,
            userId: this.loggedUser!.id
        }
        this.reportService.create(reportReq).subscribe({
            next: data => {
                this.toastr.success('Báo cáo thành công');
                this.isOpenReportForm = false;
            },
            error: error => {
                this.toastr.error('Báo cáo thất bại');
            }
        });
    }

    openReportForm(reviewId: number): void {
        this.isOpenReportForm = true;
        this.reportForm.reset();
        this.reportReviewId = reviewId;
    }

    generatePageArray(): number[] {
        return Array.from({ length: 9 }, (_, i) => this.reviewQuery.page - 4 + i)
            .filter(num => num >= 1 && num <= this.totalPages);
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
        this.reviewQuery.comment = this.keyword;
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


    clearFilter(){
        this.keyword = '';
        this.ratingFilter = -1;
        this.reviewQuery.comment = undefined;
        this.reviewQuery.rating = undefined;
        this.reviewQuery.page = 1;
        this.reviewQuery.courseId = -1;



        this.updateUrlParams();
    }

    isRootOrAdmin(): boolean {

        if(!this.loggedUser) return false;
        return this.loggedUser?.role.name === 'ROOT' || this.loggedUser?.role.name === 'ADMIN';
    }



    protected readonly environment = environment;
}
