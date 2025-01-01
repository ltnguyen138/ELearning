import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.css']
})
export class ReportPageComponent implements OnInit {

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