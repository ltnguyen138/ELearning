import {Component, OnInit} from '@angular/core';
import {Earning} from "../../model/earning";
import {PayoutHistory} from "../../model/payout-history";
import {environment} from "../../environment";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {StatisticService} from "../../service/statistic.service";
import {AuthService} from "../../service/auth.service";
import {EarningService} from "../../service/earning.service";
import {DiscountTypeEnum} from "../../enum/discount.type.enum";

@Component({
  selector: 'app-payout-history',
  templateUrl: './payout-history.component.html',
  styleUrls: ['./payout-history.component.css']
})
export class PayoutHistoryComponent implements OnInit{

    payoutHistorys: PayoutHistory[] = []
    loggedInUser = this.authService.getUserFromLocalStorage();
    totalPayout = 0;
    constructor(private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                protected router: Router,
                public statisticService: StatisticService,
                private authService: AuthService,
                private earnService: EarningService) {
    }

    ngOnInit(): void {
        this.getPayoutHistory();
    }

    getPayoutHistory() {
        this.earnService.getPayoutHistory().subscribe({
            next: (data) => {
                this.payoutHistorys = data;
                this.totalPayout = this.payoutHistorys.reduce((acc, payoutHistory) => acc + payoutHistory.amount, 0);
            },
            error: error => {
                this.toastr.error(error.error.message, "Error");
            }
        });
    }

    roundAndFormatNumber(number: number){
        let roundNumber = Math.round(number);
        const formattedValue = new Intl.NumberFormat('vi-VN').format(roundNumber);
        return `${formattedValue} VND`;
    }


    protected readonly DiscountTypeEnum = DiscountTypeEnum;
}
