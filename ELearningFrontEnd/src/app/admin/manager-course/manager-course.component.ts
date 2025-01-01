import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-manager-course',
  templateUrl: './manager-course.component.html',
  styleUrls: ['./manager-course.component.css']
})
export class ManagerCourseComponent implements OnInit {

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
