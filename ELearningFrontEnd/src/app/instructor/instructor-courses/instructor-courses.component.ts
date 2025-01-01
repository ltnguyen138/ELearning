import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../service/user.service";
import {ConfirmationService} from "primeng/api";
import {AuthService} from "../../service/auth.service";
import {CourseService} from "../../service/course.service";
import { Course } from 'src/app/model/course';
import {CourseQuery} from "../../dtos/course/course.query";
import {CourseLevelEnum} from "../../enum/course.level.enum";
import {User} from "../../model/user";
import {ApprovalStatusEnum, getApprovalStatusEnum} from "../../enum/approval.status.enum";
import {CategoryQuery} from "../../dtos/category/category.query";
import {CategoryService} from "../../service/category.service";
import {Category} from "../../model/category";

@Component({
  selector: 'app-instructor-courses',
  templateUrl: './instructor-courses.component.html',
  styleUrls: ['./instructor-courses.component.css']
})
export class InstructorCoursesComponent implements OnInit {

    courses: Course[] = [];
    courseQuery = new CourseQuery();
    totalPages: number = 0;
    visiblePages: number[] = [];
    keyword: string = '';
    activated?: boolean ;
    sortBy: string = 'createdTime,desc';
    loggedInUser:User|null = this.authService.getUserFromLocalStorage();
    totalCourse: number = 0;
    countPublishedCourse: number = 0;
    approvalStatusFilter?: string = '';
    categoryQuery = new CategoryQuery();
    categories: Category[] = [];
    catagoryFilter?: number = -1;
    getCourseLevel(skillLevel: string): string {
        return this.CourseLevelEnum[skillLevel as keyof typeof CourseLevelEnum] || 'Unknown';
    }

    constructor(protected router: Router,
                private toastr: ToastrService,
                protected route: ActivatedRoute,
                private userService: UserService,
                private confirmService: ConfirmationService,
                private courseService: CourseService,
                private authService: AuthService,
                private categoryService: CategoryService, ) { }

    ngOnInit(): void {
        this.courseQuery.size = 5;
        this.route.queryParamMap.subscribe( params => {
            this.courseQuery.page = +params.get('page')! || this.courseQuery.page;
            this.courseQuery.sort = params.get('sort') || this.courseQuery.sort;
            this.courseQuery.keyword = params.get('keyword') || undefined;
            this.courseQuery.categoryId = +params.get('categoryId')! || undefined;
            this.courseQuery.activated = params.get('activated') === 'true' || params.get('activated') === 'false'
                ? params.get('activated') === 'true'
                : undefined ;
            this.courseQuery.approvalStatus = params.get('approvalStatus') || undefined;
            this.approvalStatusFilter = this.courseQuery.approvalStatus || '';
            this.catagoryFilter = this.courseQuery.categoryId || -1;
            this.getCourses();
        });
        this.getCategories();
    }

    getCategories() {
        this.categoryService.getPublicPage(this.categoryQuery).subscribe({
            next: data => {
                this.categories = data.content;
            },
            error: err => {
                this.toastr.error('Lỗi: ' + "Không thể lấy danh sách danh mục");
            }
        });
    }
    getCourses(){
        if(this.loggedInUser == null){
            return;
        }else {
            this.courseQuery.instructorId = this.loggedInUser.id;
        }

        this.courseService.getManagerPage(this.courseQuery).subscribe({
            next: data => {
                this.courses = data.content;
                this.totalPages = data.totalPages;
                this.visiblePages = this.generatePageArray();
                this.totalCourse = data.totalElements;
                this.countPublishedCourses();
            },
            error: err => {
                this.toastr.error('Lỗi: ' + "Không thể lấy danh sách khóa học");
            }
        });
    }

    generatePageArray(): number[] {

        return Array.from({ length: 9 }, (_, i) => this.courseQuery.page - 4 + i)
            .filter(num => num >= 1 && num <= this.totalPages);
    }

    updateUrlParams() {
        this.router.navigate([], {
                relativeTo: this.route,
                queryParams: this.courseQuery.queryParams,
            }
        )
    }

    pageChange(page: number) {
        this.courseQuery.page = page;
        this.updateUrlParams();
    }

    search() {
        this.courseQuery.keyword = this.keyword;
        this.updateUrlParams();
    }
    activatedChange($event: Event) {
        this.courseQuery.activated = this.activated;
        this.courseQuery.page = 1;
        this.updateUrlParams();
    }

    deleteCourse(courseId: number) {
        this.confirmService.confirm({
            message: 'Bạn có chắc muốn xóa khóa học này?',
            accept: () => {
                this.courseService.deleteByOwner(courseId).subscribe({
                    next: () => {
                        this.toastr.success('Xóa khóa học thành công');
                        this.getCourses();
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            }
        });
    }
    sortChange() {
        this.courseQuery.sort = this.sortBy;
        this.courseQuery.page = 1;
        this.updateUrlParams();
    }

    countPublishedCourses(){
        this.courseService.countPurchasedCourses(this.courseQuery).subscribe({
            next: data => {
                this.countPublishedCourse = data;
            },
            error: err => {
                this.toastr.error('Lỗi: ' + "Không thể lấy danh sách khóa học");
            }
        });
    }
    roundAndFormatNumber(number: number | undefined): string {
        if(number == undefined){
            return '0 VND';
        }
        let roundNumber = Math.round(number);
        const formattedValue = new Intl.NumberFormat('vi-VN').format(roundNumber);
        return `${formattedValue} VND`;
    }

    approvalStatusFilterChange($event: any) {
        this.courseQuery.approvalStatus = this.approvalStatusFilter;
        this.courseQuery.page = 1;
        this.updateUrlParams();
    }
    categoryFilterChange($event: any) {
        this.courseQuery.categoryId = this.catagoryFilter;
        this.courseQuery.page = 1;
        this.updateUrlParams();
    }

    protected readonly CourseLevelEnum = CourseLevelEnum;
    protected readonly getApprovalStatusEnum = getApprovalStatusEnum;
    protected readonly ApprovalStatusEnum = ApprovalStatusEnum;
}
