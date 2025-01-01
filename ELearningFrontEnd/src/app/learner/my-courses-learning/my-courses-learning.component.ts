import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {UserService} from "../../service/user.service";
import {TokenService} from "../../service/token.service";
import {CategoryService} from "../../service/category.service";
import {CourseService} from "../../service/course.service";
import {DiscountService} from "../../service/discount.service";
import {Course} from "../../model/course";
import {CourseQuery} from "../../dtos/course/course.query";
import {Category} from "../../model/category";
import {CategoryQuery} from "../../dtos/category/category.query";
import {UserCourseQuery} from "../../dtos/course/user-course.query";
import {environment} from "../../environment";

@Component({
  selector: 'app-my-courses-learning',
  templateUrl: './my-courses-learning.component.html',
  styleUrls: ['./my-courses-learning.component.css']
})
export class MyCoursesLearningComponent implements OnInit {

    courses: Course[] = [];
    totalPages: number = 0;
    courseQuery = new UserCourseQuery();
    visiblePages: number[] = [];
    sortBy: string = 'updatedTime,desc';
    categories: Category[] = [];
    categoryQuery = new CategoryQuery();
    keyword: string = '';
    categoryIdFilter: number = -1;
    loggedInUser = this.authService.getUserFromLocalStorage();

    constructor(protected router: Router,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private authService: AuthService,
                private userService: UserService,
                private tokenService: TokenService,
                private categoryService: CategoryService,
                private courseService: CourseService,
                private discountService: DiscountService) {

        this.courseQuery.size = 6;
    }

    ngOnInit(): void {

        // @ts-ignore
        this.courseQuery.userId = this.loggedInUser.id;

        this.getCategories();
        this.route.queryParamMap.subscribe( params => {
            this.courseQuery.page = +params.get('page')! || this.courseQuery.page;
            this.courseQuery.sort = params.get('sort') || this.sortBy;
            this.courseQuery.keyword = params.get('keyword') || undefined;
            this.courseQuery.categoryId = +params.get('categoryId')! || undefined;
            this.categoryIdFilter = this.courseQuery.categoryId || -1;
            this.getMyCourses();
        });
    }

    getCategories() {
        this.categoryService.getPublicPage(this.categoryQuery).subscribe({
            next: (res) => {
                this.categories = res.content;
            }
        });
    }

    getMyCourses() {
        this.courseService.getPurchasedPage(this.courseQuery).subscribe({
            next: (res) => {
                this.courses = res.content;
                this.totalPages = res.totalPages;
                this.visiblePages = this.generatePageArray();
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

    generatePageArray(): number[] {
        return Array.from({ length: 9 }, (_, i) => this.courseQuery.page - 4 + i)
            .filter(num => num >= 1 && num <= this.totalPages);
    }

    sortChange(){
        this.courseQuery.sort = this.sortBy;
        this.courseQuery.page = 1;
        this.updateUrlParams();
    }

    search(): void {
        this.courseQuery.keyword = this.keyword;
        this.courseQuery.page = 1;
        this.updateUrlParams();
    }

    onCategoryFilterChange($event: Event){
        this.courseQuery.categoryId = this.categoryIdFilter;
        this.courseQuery.page = 1;
        this.updateUrlParams();
    }

    protected readonly environment = environment;
}
