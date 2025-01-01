import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CategoryService} from "../../service/category.service";
import {ConfirmationService} from "primeng/api";
import { CourseService } from 'src/app/service/course.service';
import {Course} from "../../model/course";
import {CourseQuery} from "../../dtos/course/course.query";
import {Category} from "../../model/category";
import {CategoryQuery} from "../../dtos/category/category.query";
import {CourseLevelEnum} from "../../enum/course.level.enum";
import {ApprovalStatusEnum, getApprovalStatusEnum} from "../../enum/approval.status.enum";
import {User} from "../../model/user";

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit{

    courses: Course[] = [];
    totalPages: number = 0;
    courseQuery = new CourseQuery();
    visiblePages: number[] = [];
    sortBy: string = 'createdTime,desc';
    categories: Category[] = [];
    categoryQuery = new CategoryQuery();
    skillLevels = Object.entries(CourseLevelEnum).map(([key, value]) => ({
        key,
        value
    }));
    catagoryFilter?: number = -1;
    moderationRequestedFilter?: boolean;
    approvalStatusFilter?: string = '';
    keyword: string = '';
    totalCourses: number = 0;
    instructorIdFilter: number = -1;
    instructorNameFilter?: string;
    title = 'Danh sách khóa học';
    constructor(protected router: Router,
                private toastr: ToastrService,
                protected route: ActivatedRoute,
                private categoryService: CategoryService,
                private confirmService: ConfirmationService,
                private  courseService: CourseService) {

    }

    ngOnInit(): void {

        this.courseQuery.size = 5;
        this.route.queryParamMap.subscribe( params => {

            this.courseQuery.page = +params.get('page')! || this.courseQuery.page;
            this.courseQuery.sort = params.get('sort') || this.sortBy;
            this.courseQuery.keyword = params.get('keyword') || undefined;
            this.courseQuery.categoryId = +params.get('categoryId')! || undefined;
            this.courseQuery.moderationRequested = params.get('moderationRequested') === 'true' || params.get('moderationRequested') === 'false'
                ? params.get('moderationRequested') === 'true'
                : undefined;
            this.courseQuery.approvalStatus = params.get('approvalStatus') || undefined;
            this.keyword = this.courseQuery.keyword || '';
            this.catagoryFilter = this.courseQuery.categoryId || -1;
            this.moderationRequestedFilter = this.courseQuery.moderationRequested;
            this.approvalStatusFilter = this.courseQuery.approvalStatus || '';
            this.courseQuery.instructorName = params.get('instructorName') || undefined;
            this.courseQuery.instructorId = +params.get('instructorId')! || -1;
            this.instructorNameFilter = this.courseQuery.instructorName || undefined;
            this.instructorIdFilter = this.courseQuery.instructorId || -1;
            this.title = this.courseQuery.instructorName ? 'Danh sách khóa học của giảng viên ' + this.courseQuery.instructorName : 'Danh sách khóa học';
            this.getCourses();
        });
        this.getCategories();
    }

    getCourseLevel(skillLevel: string): string {
        return CourseLevelEnum[skillLevel as keyof typeof CourseLevelEnum] || 'Unknown';
    }

    getCourses(){
        this.courseService.getManagerPage(this.courseQuery).subscribe({
            next: data => {
                this.courses = data.content;
                this.totalPages = data.totalPages;
                this.visiblePages = this.generatePageArray();
                this.totalCourses = data.totalElements;
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
    getCategories() {
        this.categoryService.getManagerPage(this.categoryQuery).subscribe({
            next: data => {
                this.categories = data.content;
            },
            error: err => {
                this.toastr.error('Lỗi: ' + "Không thể lấy danh sách danh mục");
            }
        });
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
        this.courseQuery.page = 1;
        this.updateUrlParams();
    }

    moderationRequestedFilterChange($event: any) {
        this.courseQuery.moderationRequested = this.moderationRequestedFilter;
        this.courseQuery.page = 1;
        this.updateUrlParams();
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

    instructorFilterChange(instructor: User) {

        this.courseQuery.instructorId = instructor.id;
        this.instructorIdFilter = instructor.id;
        this.courseQuery.instructorName = instructor.fullName;
        this.instructorNameFilter = instructor.fullName;

        this.courseQuery.page = 1;
        this.title = 'Danh sách khóa học của giảng viên ' + instructor.fullName;
        this.updateUrlParams();
    }

    clearFilter() {
        this.keyword = '';
        this.catagoryFilter = -1;
        this.moderationRequestedFilter = undefined;
        this.approvalStatusFilter = '';
        this.courseQuery.keyword = undefined;
        this.courseQuery.categoryId = undefined;
        this.courseQuery.moderationRequested = undefined;
        this.courseQuery.approvalStatus = undefined;
        this.courseQuery.page = 1;
        this.instructorNameFilter = undefined;
        this.instructorIdFilter = -1;
        this.courseQuery.instructorId = undefined;
        this.courseQuery.instructorName = undefined;
        this.updateUrlParams();
    }

    sortChange() {
        this.courseQuery.sort = this.sortBy;
        this.courseQuery.page = 1;
        this.updateUrlParams();
    }

    protected readonly ApprovalStatusEnum = ApprovalStatusEnum;
    protected readonly getApprovalStatusEnum = getApprovalStatusEnum;
}
