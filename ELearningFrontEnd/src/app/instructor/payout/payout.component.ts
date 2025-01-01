import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {StatisticService} from "../../service/statistic.service";
import {AuthService} from "../../service/auth.service";
import {EarningService} from "../../service/earning.service";
import {Earning} from "../../model/earning";
import {PayoutHistory} from "../../model/payout-history";
import {environment} from "../../environment";
import {StatisticTypeEnum} from "../../enum/statistic.type.enum";

@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.css']
})
export class PayoutComponent implements OnInit {

    earning?: Earning
    payoutHistory: PayoutHistory[] = []
    loggedInUser = this.authService.getUserFromLocalStorage();
    profilePictureApi = environment.profilePictureApi + this.loggedInUser?.profilePicture;
    isLoaded = false;
    title = 'Thống kê thu nhập từ lần rút tiền gần nhất';
    constructor(private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                protected router: Router,
                public statisticService: StatisticService,
                private authService: AuthService,
                private earnService: EarningService) {
    }

    ngOnInit(): void {

        this.getEarning();
        this.getPayoutHistory();

    }

    getPayoutHistory() {
        this.earnService.getPayoutHistory().subscribe({
            next: (data) => {
                this.payoutHistory = data;
            },
            error: error => {
                this.toastr.error(error.error.message, "Error");
            }
        });
    }

    getEarning() {
        this.isLoaded = true;
        this.earnService.getEarning().subscribe({
            next: (data) => {
                this.earning = data;
                this.isLoaded = false;
                this.title += ` đến ${this.earning?.endDate}`;
            },
            error: error => {
                this.toastr.error(error.error.message, "Error");
                this.isLoaded = false;
            }
        });
    }

    roundAndFormatNumber(number: number){
        let roundNumber = Math.round(number);
        const formattedValue = new Intl.NumberFormat('vi-VN').format(roundNumber);
        return `${formattedValue} VND`;
    }

    payout() {
        this.isLoaded = true;
        this.earnService.payout().subscribe({
            next: (data) => {
                this.toastr.success("Chuyển khoản thành công");

                this.getPayoutHistory();
                this.getEarning();
                this.router.navigate(['/instructor/earnings-management/payout-history']);
                this.isLoaded = false
            },
            error: error => {
                this.toastr.error(error.error.message, "Error");
                this.isLoaded = false;
            }
        });
    }

    protected readonly StatisticTypeEnum = StatisticTypeEnum;
    protected readonly console = console;
}
