import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Course} from "../../model/course";
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
import {Review} from 'src/app/model/review';
import {ReviewQuery} from "../../dtos/review/review.query";
import {environment} from "../../environment";
import {ReviewReq} from "../../dtos/review/review.req";
import {ReportService} from "../../service/report.service";
import {ReportReq} from "../../dtos/report/report.req";
import {EntityNameEnum} from "../../enum/entity.name.enum";

@Component({
    selector: 'app-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit, OnChanges {
    @Input() course?: Course
    @Input() isPurchase: boolean = false;
    isViewReview: boolean = true;
    reviews: Review[] = [];
    totalPages: number = 0;
    visiblePages: number[] = [];
    reviewQuery = new ReviewQuery();
    myRating: number = 5;
    reviewForm !: FormGroup
    loggedUser = this.authService.getUserFromLocalStorage();
    rating ?: number= -1;
    myReview: Review | undefined | null;
    hoverRating: number = 5;
    reportForm!: FormGroup;
    isOpenReportForm: boolean = false;
    reportReviewId: number = 0;
    @Output() saveReviewSuccsecs = new EventEmitter<boolean>();
    ratingFilter: number = -1;
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
                private reportService: ReportService) {

        this.reviewForm = this.fb.group({
            comment: [''],
            rating: [0]
        });

        this.reportForm = this.fb.group({
            reason: ['', Validators.required]
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['course'] && this.course) {
            this.getReviews();
            this.getMyRating();
        }
    }

    ngOnInit(): void {
        this.reviewQuery.size = 8;

    }

    generatePageArray(): number[] {
        return Array.from({ length: 9 }, (_, i) => this.reviewQuery.page - 4 + i)
            .filter(num => num >= 1 && num <= this.totalPages);
    }


    pageChange(page: number) {
        this.reviewQuery.page = page;
        this.getReviews()
    }

    ratingFilterChange($event: any){
        this.reviewQuery.rating = this.ratingFilter;
        this.reviewQuery.page = 1;
        this.getReviews();
    }

    search() {
        this.reviewQuery.comment = this.keyword;
        this.reviewQuery.page = 1;
        this.getReviews();
    }

    getReviews() {
        this.reviewQuery.size = 4;
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

    getMyRating() {
        if(this.loggedUser === null) {
            return;
        }
        this.reviewService.getByUserAndCourseId(this.course!.id!).subscribe({
            next: data => {
                if(data != null) {
                    this.myReview = data;
                    this.myRating = data.rating!;
                    this.hoverRating = data.rating!;
                    if(this.myRating == 0){
                        this.myRating = 1;
                    }
                    this.reviewForm.patchValue({
                        comment: data.comment,
                        rating: data.rating
                    });
                }
            },
            error: err => {
                this.toastr.error('Lỗi: ' + "Không thể lấy danh sách review");
            }
        });

    }

    saveReview() {

        const reviewReq: ReviewReq = {

            ...this.reviewForm.value,
            rating: this.myRating,
            courseId: this.course!.id!,
            userId: this.loggedUser!.id!
        }
        if (this.myReview) {
            this.reviewService.update(reviewReq, this.myReview.id).subscribe({
                next: data => {
                    this.toastr.success('Cập nhật review thành công');
                    this.getReviews();
                    this.getMyRating();
                    this.getCourseRating();
                    this.saveReviewSuccsecs.emit(true);
                },
                error: err => {
                    this.toastr.error('Lỗi: ' + "Không thể cập nhật review");
                }
            });
        } else {
            this.reviewService.create(reviewReq).subscribe({
                next: data => {
                    this.toastr.success('Tạo review thành công');
                    this.getReviews();
                    this.getMyRating();
                    this.getCourseRating();
                    this.saveReviewSuccsecs.emit(true);
                },
                error: err => {
                    this.toastr.error('Lỗi: ' + "Không thể tạo review");
                }
            });
        }
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

    getCourseRating() {
        debugger
        if(!this.course){
            return
        }
        this.courseService.getByAlias(this.course!.alias!).subscribe({
            next: data => {
                this.course!.averageRating = data.averageRating;
                debugger
            },
            error: err => {

            }
        });

    }

    openReportForm(reviewId: number): void {
        this.isOpenReportForm = true;
        this.reportForm.reset();
        this.reportReviewId = reviewId;
    }
    protected readonly environment = environment;
}
