import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-earning-management',
  templateUrl: './earning-management.component.html',
  styleUrls: ['./earning-management.component.css']
})
export class EarningManagementComponent implements OnInit {

    currentUrl: string = '';
    constructor(protected router: Router) { }

    ngOnInit(): void {

        this.router.events.subscribe((event) => {
            this.currentUrl = this.router.url;
        });
    }

    isCurrentUrl(url: string): boolean {
        if(url == 'payout'){
            if(this.currentUrl.includes('payout-history')){
                return false;
            }
        }
        return this.currentUrl.includes(url);
    }
}
