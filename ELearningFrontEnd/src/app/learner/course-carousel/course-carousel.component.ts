import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {UserService} from "../../service/user.service";
import {TokenService} from "../../service/token.service";
import {CategoryService} from "../../service/category.service";
import { CourseService } from 'src/app/service/course.service';
import { Course } from 'src/app/model/course';
import { CourseQuery } from 'src/app/dtos/course/course.query';
import {environment} from "../../environment";
import {RatingStarComponent} from "../../components/rating-star/rating-star.component";
import {Discount} from "../../model/discount";

@Component({
  selector: 'app-course-carousel',
  templateUrl: './course-carousel.component.html',
  styleUrls: ['./course-carousel.component.css'],
})
export class CourseCarouselComponent implements OnInit{

    @ViewChild('courseList', { static: false }) courseList!: ElementRef;
    @Input() categoryAlias?: string;
    @Input() sortBy?: string;
    @Input() globalDiscount?: Discount| null;
    courses: Course[] = [];
    courseQuery = new CourseQuery();
    rating: number[] = [1, 2, 3, 4, 5];

    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private authService: AuthService,
                private userService: UserService,
                private tokenService: TokenService,
                private categoryService: CategoryService,
                private courseService: CourseService) {
    }

    ngOnInit(): void {

        if(this.categoryAlias){
            this.courseQuery.alias = this.categoryAlias;
        }
        if(this.sortBy){
            this.courseQuery.sort = this.sortBy;
            console.log(this.courseQuery.sort);
        }
        this.getcourses();
    }

    getcourses() {
        this.courseQuery.size = 9;

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
    protected readonly RouterLink = RouterLink;
}
