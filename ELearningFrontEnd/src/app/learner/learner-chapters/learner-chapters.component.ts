import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {UserService} from "../../service/user.service";
import {TokenService} from "../../service/token.service";
import {CategoryService} from "../../service/category.service";
import {CourseService} from "../../service/course.service";
import {Category} from "../../model/category";
import {Chapter} from "../../model/chapter";
import { ChapterQuery } from 'src/app/dtos/chapter/chapter.query';
import { ChapterService } from 'src/app/service/chapter.service';
import {Course} from "../../model/course";

@Component({
  selector: 'app-learner-chapters',
  templateUrl: './learner-chapters.component.html',
  styleUrls: ['./learner-chapters.component.css']
})
export class LearnerChaptersComponent implements OnInit{

    chapters: Chapter[] = [];
    chapterQuery = new ChapterQuery();
    @Input() course!: Course;
    constructor(protected router: Router,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private authService: AuthService,
                private userService: UserService,
                private tokenService: TokenService,
                private chapterService: ChapterService,
                private courseService: CourseService) {

        this.chapterQuery.size = 100;
    }

    ngOnInit(): void {

        debugger;

        if(this.course.id){
            this.chapterQuery.courseId = this.course.id;
            this.getChaptersByCourseId();
        }

    }

    getChaptersByCourseId() {

        this.chapterService.getPublicPage(this.chapterQuery).subscribe({
            next: data => {
                this.chapters = data.content;
            },
            error: err => {
                this.toastr.error('Error: ' + err.error.message);
            }
        });

    }


}
