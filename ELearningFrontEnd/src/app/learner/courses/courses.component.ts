import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {UserService} from "../../service/user.service";
import {TokenService} from "../../service/token.service";
import {CategoryService} from "../../service/category.service";
import {CourseService} from "../../service/course.service";
import {Course} from "../../model/course";
import { CourseQuery } from 'src/app/dtos/course/course.query';
import {environment} from "../../environment";
import { CategoryQuery } from 'src/app/dtos/category/category.query';
import {Category} from "../../model/category";
import {CourseLevelEnum} from "../../enum/course.level.enum";
import {animate, style, transition, trigger} from "@angular/animations";
import {DiscountService} from "../../service/discount.service";
import {Discount} from "../../model/discount";
import {catchError, of} from "rxjs";

@Component({
    selector: 'app-courses',
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.component.css'],
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
export class CoursesComponent implements OnInit{

    courses: Course[] = [];
    totalPages: number = 0;
    courseQuery = new CourseQuery();
    visiblePages: number[] = [];
    sortBy: string = 'id,asc';
    categories: Category[] = [];
    categoryQuery = new CategoryQuery();
    categoryAlias?: string
    priceFilter?: string;
    ratingFilter?: number;
    skillLevelFilter?: string;
    skillLevels = Object.entries(CourseLevelEnum).map(([key, value]) => ({
        key,
        value
    }));
    isShowCategoryFilter: boolean = false;
    isShowPriceFilter: boolean = false;
    isShowRatingFilter: boolean = false;
    isShowSkillLevelFilter: boolean = false;
    isOpenMobileFilter: boolean = false;
    globalDiscount: Discount | null = null;

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

        this.route.queryParamMap.subscribe( params => {
            this.courseQuery.page = +params.get('page')! || this.courseQuery.page;
            this.courseQuery.sort = params.get('sort') || this.courseQuery.sort;
            if(this.courseQuery.sort ===null || this.courseQuery.sort === 'id,asc'){
                this.sortBy = '';
            }else {
                this.sortBy = this.courseQuery.sort;
            }
            this.courseQuery.keyword = params.get('keyword') || undefined;
            this.courseQuery.alias = params.get('alias') || undefined;
            this.loadData();
        });
        this.getCategories();
    }

    getGlobalDiscountCanUse() {
        return this.discountService.getGlobalCanUseDiscounts().pipe(
            catchError(err => {
                this.toastr.error('Error: ' + err.error.message);
                return of(null);
            })
        );
    }

    loadData() {
        if(this.globalDiscount !== null && this.globalDiscount){
            this.getcourses();
            return;
        }
        this.getGlobalDiscountCanUse().subscribe({
            next: data => {
                this.globalDiscount = data;
                this.getcourses();
            },
            error: err => {
                this.toastr.error('Error: ' + err.error.message);
            }
        });
    }

    getCourseLevel(skillLevel: string): string {
        return this.skillLevels.find(x => x.key === skillLevel)?.value || 'Unknown Level';
    }
    getcourses() {
        this.courseService.getPublicPage(this.courseQuery).subscribe({
            next: data => {
                this.courses = data.content;
                this.totalPages = data.totalPages;
                this.visiblePages = this.generatePageArray();
                if(this.globalDiscount !== null && this.globalDiscount){
                    this.courses.forEach(course => {
                        course.discountPrice = course.price * this.globalDiscount!.discount /100
                    });
                }
            },
            error: error => {
                this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');
            }
        });

    }

    getCategories() {

        this.categoryService.getPublicPage(this.categoryQuery).subscribe({
            next: data => {
                this.categories = data.content;
            },
            error: error => {
                this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');
            }
        });
    }

    updateUrlParams() {
        debugger;
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

    sortChange($event: Event){
        this.courseQuery.sort = this.sortBy;
        this.courseQuery.page = 1;
        this.updateUrlParams();
    }

    onCategoryFilterChange($event: Event){
        this.courseQuery.alias = this.categoryAlias;
        this.courseQuery.page = 1;
        this.updateUrlParams();
    }

    onPriceFilterChange($event: Event){
        if(this.priceFilter === '0-200000') {
            this.courseQuery.minPrice = 0;
            this.courseQuery.maxPrice = 200000;
        }
        if(this.priceFilter === '200000-1000000') {
            this.courseQuery.minPrice = 200000;
            this.courseQuery.maxPrice = 1000000;
        }
        if(this.priceFilter === '1000000') {
            this.courseQuery.minPrice = 1000000;
            this.courseQuery.maxPrice = 99999999;
        }
        this.courseQuery.page = 1;
        this.updateUrlParams();
    }

    onRatingFilterChange($event: Event){
        this.courseQuery.averageRating = this.ratingFilter;
        this.courseQuery.page = 1;
        this.updateUrlParams();
    }

    onSkillLevelFilterChange($event: Event){
        this.courseQuery.skillLevel = this.skillLevelFilter;
        this.courseQuery.page = 1;
        this.updateUrlParams();
    }

    clearFilter(){
        this.courseQuery.alias = undefined;
        this.courseQuery.keyword = undefined;
        this.courseQuery.minPrice = undefined;
        this.courseQuery.maxPrice = undefined;
        this.courseQuery.skillLevel = undefined;
        this.courseQuery.averageRating = undefined;
        this.courseQuery.sort = 'id,asc';
        this.courseQuery.page = 1;
        this.updateUrlParams();
    }

    protected readonly environment = environment;
}
