import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {UserService} from "../../service/user.service";
import {TokenService} from "../../service/token.service";
import {CategoryService} from "../../service/category.service";
import {CourseService} from "../../service/course.service";
import {Course} from "../../model/course";
import {User} from "../../model/user";
import {environment} from "../../environment";
import { ChapterService } from 'src/app/service/chapter.service';
import {Chapter} from "../../model/chapter";
import { ChapterQuery } from 'src/app/dtos/chapter/chapter.query';
import { LectureService } from 'src/app/service/lecture.service';
import { CartService } from 'src/app/service/cart.service';
import {RatingStarComponent} from "../../components/rating-star/rating-star.component";
import {catchError, forkJoin, of } from 'rxjs';
import {ReviewService} from "../../service/review.service";
import {Review} from "../../model/review";
import {ReviewQuery} from "../../dtos/review/review.query";
import {ReportReq} from "../../dtos/report/report.req";
import {EntityNameEnum} from "../../enum/entity.name.enum";
import {ReportService} from "../../service/report.service";
import {Discount} from "../../model/discount";
import {DiscountService} from "../../service/discount.service";
import {CourseQuery} from "../../dtos/course/course.query";

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
})
export class CourseDetailComponent implements OnInit {

    purchasedCourse: Course[] = [];
    isPurchase: boolean = false;
    currenCourse?: Course;
    courseAlias: string = '';
    loggedUser: User | null = null;
    chapters: Chapter[] = [];
    chapterQuery = new ChapterQuery();
    chapterCount: number = 0;
    lectureCount: number = 0;
    review: Review[] = [];
    totalReviewPage: number = 0;
    reviewQuery = new ReviewQuery();
    reportForm!: FormGroup;
    isOpenReportForm: boolean = false;
    globalDiscount: Discount | null = null;
    courseQuery: CourseQuery = new CourseQuery();
    courseQuery2: CourseQuery = new CourseQuery();
    courses: Course[] = [];
    courses2: Course[] = [];
    @ViewChild('courseList', { static: false }) courseList!: ElementRef;
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
                private reportService: ReportService,
                private discountService: DiscountService) {

        this.reportForm = this.fb.group({
            reason: ['', Validators.required]
        });
    }

    ngOnInit(): void {

        if (this.route.snapshot.paramMap.has('alias')) {
            this.courseAlias = this.route.snapshot.paramMap.get('alias')!;
            if(this.tokenService.getToken() === null) {
                this.getCourseByAlias(this.courseAlias);

            }else {
                this.getCourseAndUserData().subscribe({
                    next: ({ course, user }) => {
                        if (!course) {
                            this.router.navigate(['/home']); // Điều hướng nếu không tìm thấy khóa học
                            return;
                        }

                        this.currenCourse = course;
                        this.chapterQuery.courseId = this.currenCourse.id;
                        this.getChapters();
                        this.getLectureCount();

                        if (user) {
                            this.loggedUser = user;
                            this.getPurchasedCourse(() => {
                                if (this.purchasedCourse.length > 0) {
                                    this.purchasedCourse.forEach(course => {
                                        if (course.id === this.currenCourse?.id) {
                                            this.isPurchase = true;
                                        }
                                    });
                                }
                            });
                        }
                        this.getGlobalDiscountCanUse();
                    },
                    error: () => {
                        this.toastr.error('Có lỗi xảy ra trong quá trình tải dữ liệu', 'Lỗi');
                    }
                })

            }
            // Sử dụng forkJoin để thực hiện cả hai hàm song song, bắt lỗi riêng cho từng Observable
;
        } else {
            this.toastr.error('Không tìm thấy khóa học', 'Lỗi');
            this.router.navigate(['/home']);
        }
    }

    getCourseAndUserData() {
        return forkJoin({
            course: this.courseService.getByAlias(this.courseAlias).pipe(
                catchError(error => {
                    this.toastr.error('Có lỗi khi tải khóa học, vui lòng thử lại sau', 'Lỗi');
                    return of(null); // Trả về null nếu lỗi xảy ra
                })
            ),
            user: this.authService.getLoggedUser().pipe(
                catchError(error => {
                    this.toastr.error('Có lỗi khi tải thông tin người dùng, vui lòng thử lại sau', 'Lỗi');
                    return of(null); // Trả về null nếu lỗi xảy ra
                })
            )
        });
    }


    getCourseByAlias(alias: string) {

        this.courseService.getByAlias(alias).subscribe({
            next: data => {
                this.currenCourse = data;
                this.chapterQuery.courseId = this.currenCourse.id;
                this.getGlobalDiscountCanUse();
                this.getChapters();
                this.getLectureCount();

            },
            error: error => {
                this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau df', 'Lỗi');
            }
        });
    }

    getLoggedUser() {
        if (this.tokenService.getToken() === null) {
            return;
        }
        this.authService.getLoggedUser().subscribe({
            next: data => {
                this.loggedUser = data;

            },
            error: error => {
                this.loggedUser = null;
            }
        });

    }

    getPurchasedCourse(callback: () => void) {
        this.courseService.getPurchasedCourses().subscribe({
            next: data => {
                this.purchasedCourse = data;
                callback();
            },
            error: () => {
                this.toastr.error('Có lỗi xảy ra khi tải danh sách khóa học đã mua, vui lòng thử lại sau', 'Lỗi');
            }
        });
    }

    getChapters() {

        this.chapterService.getPublicPage(this.chapterQuery).subscribe({

            next: data => {
                this.chapters = data.content;
                this.chapterCount = data.totalElements;
            },
            error: error => {
                this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');
            }
        });

    }

    getLectureCount() {
        this.lectureService.countLectureByCourseId(this.currenCourse!.id).subscribe({
            next: data => {
                this.lectureCount = data.totalLecture;
            },
            error: error => {
                this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');
            }
        });
    }

    addToCart() {
        this.cartService.addToCart(this.currenCourse!);
    }

    reportAnswer(): void {
        if(this.reportForm.invalid){
            this.toastr.error('Vui lòng nhập lý do báo cáo');
            return;
        }
        const reportReq: ReportReq = {
            ...this.reportForm.value,
            entityType: EntityNameEnum.COURSE,
            entityId: this.currenCourse!.id,
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
    getGlobalDiscountCanUse() {
        this.discountService.getGlobalCanUseDiscounts().subscribe({
            next: data => {
                this.globalDiscount = data;
                console.log("Global discount data:", data);
                if (this.currenCourse) {
                    this.currenCourse.discountPrice = this.currenCourse.price * (this.globalDiscount?.discount || 0) / 100;
                    this.getCourseByInstructorId(this.currenCourse!.instructor.id);
                    this.getCourseByCategoryId(this.currenCourse!.category.id);
                }

            },
            error: err => {
                console.error('Error fetching global discount:', err);
                this.toastr.error('Error: ' + (err?.error?.message || 'An error occurred'));
                this.getCourseByInstructorId(this.currenCourse!.instructor.id);
                this.getCourseByCategoryId(this.currenCourse!.category.id);
            }
        });
    }

    roundAndFormatNumber(number: number| undefined){
        if(number == undefined){
            return '';
        }
        let roundNumber = Math.round(number);
        const formattedValue = new Intl.NumberFormat('vi-VN').format(roundNumber);
        return `${formattedValue} VND`;
    }
    roundAndFormatDiscount(number1: number| undefined, number2: number| undefined){
        if(number1 == undefined || number2 == undefined){
            return '';
        }

        let roundNumber = Math.round(number1 - number2);
        const formattedValue = new Intl.NumberFormat('vi-VN').format(roundNumber);
        return `${formattedValue} VND`;
    }

    getCourseByInstructorId(instructorId: number) {

        this.courseQuery.instructorId = instructorId;
        this.courseQuery.size = 4
        this.courseQuery.sort = 'createdTime,asc';
        this.courseService.getPublicPage(this.courseQuery).subscribe({
            next: data => {
                this.courses = data.content;
                if(this.globalDiscount !==null && this.globalDiscount){
                    this.courses.forEach(course => {
                        course.discountPrice = course.price * this.globalDiscount!.discount / 100;
                    });
                }
            },
            error: error => {
                this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');
            }
        });
    }

    getCourseByCategoryId(categoryId: number) {

        this.courseQuery2.categoryId = categoryId;
        this.courseQuery2.size = 8
        this.courseQuery2.sort = 'createdTime,asc';
        this.courseService.getPublicPage(this.courseQuery2).subscribe({
            next: data => {
                this.courses2 = data.content;
                if(this.globalDiscount !==null && this.globalDiscount){
                    this.courses2.forEach(course => {
                        course.discountPrice = course.price * this.globalDiscount!.discount / 100;
                    });
                }
            },
            error: error => {
                this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');
            }
        });
    }

    scrollLeft() {
        this.courseList.nativeElement.scrollBy({
            left: -500, // Cuộn sang trái 300px
            behavior: 'smooth'
        });
    }

    scrollRight() {
        this.courseList.nativeElement.scrollBy({
            left: 500, // Cuộn sang phải 300px
            behavior: 'smooth'
        });
    }

    protected readonly environment = environment;
}
