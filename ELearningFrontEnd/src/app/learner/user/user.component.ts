import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {UserService} from "../../service/user.service";
import {TokenService} from "../../service/token.service";
import {User} from "../../model/user";
import {Course} from "../../model/course";
import { CourseQuery } from 'src/app/dtos/course/course.query';
import { CourseService } from 'src/app/service/course.service';
import {environment} from "../../environment";
import {CourseLevelEnum} from "../../enum/course.level.enum";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    userId: number = 0;
    user!: User;
    courses: Course[] = [];
    courseCount: number = 0;
    courseQuery = new CourseQuery();
    totalPages: number = 0;
    visiblePages: number[] = [];
    skillLevels = Object.entries(CourseLevelEnum).map(([key, value]) => ({
        key,
        value
    }))
    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private authService: AuthService,
                private userService: UserService,
                private tokenService: TokenService,
                private courseService: CourseService) {

        this.courseQuery.size = 6;
    }

    ngOnInit(): void {
        if (this.route.snapshot.paramMap.has('id')) {
            this.userId = +this.route.snapshot.paramMap.get('id')!;
            this.getUser();
        }
    }

    getUser() {
        this.userService.getUser(this.userId).subscribe({
            next: data => {
                this.user = data;
                this.getCoursesByUserId(this.userId);
            },
            error: err => {
                this.toastr.error('Error: ' + err.error.message);
                this.router.navigate(['/']);
            }
        });
    }

    getCoursesByUserId(userId: number) {
        this.courseQuery.instructorId = userId;

        this.courseQuery.sort = 'createdTime,desc';
        this.courseService.getPublicPage(this.courseQuery).subscribe({
            next: data => {
                this.courses = data.content;
                this.courseCount = data.totalElements;
                this.totalPages = data.totalPages;
                this.visiblePages = this.generatePageArray();
            },
            error: err => {
                this.toastr.error('Error: ' + err.error.message);
            }
        });

    }

    generatePageArray(): number[] {
        return Array.from({ length: 9 }, (_, i) => this.courseQuery.page - 4 + i)
            .filter(num => num >= 1 && num <= this.totalPages);
    }

    getCourseLevel(skillLevel: string): string {
        return this.skillLevels.find(x => x.key === skillLevel)?.value || 'Unknown Level';
    }

    pageChange(page: number) {
        this.courseQuery.page = page;
        this.getCoursesByUserId(this.userId);
    }

    protected readonly environment = environment;
}