import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-instructor-course-detail',
  templateUrl: './instructor-course-detail.component.html',
  styleUrls: ['./instructor-course-detail.component.css']
})
export class InstructorCourseDetailComponent implements OnInit {

    currentUrl: string = '';
    constructor(protected router: Router) { }

    ngOnInit(): void {

        this.router.events.subscribe((event) => {
            this.currentUrl = this.router.url;
        });
    }

    isCurrentUrl(url: string): boolean {
        return this.currentUrl.includes(url);
    }
}
