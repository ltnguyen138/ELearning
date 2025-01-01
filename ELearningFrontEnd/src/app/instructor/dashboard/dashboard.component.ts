import {Component, OnInit} from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import {DashboardCartRes} from "../../dtos/statistic/dashboard-cart.res";
import {StatisticRes} from "../../dtos/statistic/statisticRes";
import {StatisticReq} from "../../dtos/statistic/statistic.req";
import {CourseQuery} from "../../dtos/course/course.query";
import {Course} from "../../model/course";
import {StatisticService} from "../../service/statistic.service";
import {CourseService} from "../../service/course.service";
import {ActivatedRoute, Router} from "@angular/router";
import { getApprovalStatusEnum } from 'src/app/enum/approval.status.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

    loggedInUser = this.authService.getUserFromLocalStorage();
    revenueCart?: DashboardCartRes
    courseCart?: DashboardCartRes
    userCart?: DashboardCartRes
    revenueStatistics: StatisticRes[] = []
    categoryCourseStatistics: StatisticRes[] = []
    statisticReq = new StatisticReq();
    courseQuery = new CourseQuery();
    courses: Course[] = [];
    userId: number | null = null;
    constructor(
        private authService: AuthService,
        public statisticService: StatisticService,
        public courseService: CourseService,
        public route: ActivatedRoute,
        public router: Router
    ) {}

    ngOnInit(): void {
        this.userId = this.loggedInUser ? this.loggedInUser.id : null;
        this.getCourseCart();
        this.getRevenueCart();
        this.getRevenueStatistics();
        this.getCategoryCourseStatistics();
        this.getModerationRequestCourse();
    }

    getRevenueCart() {
        this.statisticService.getRevenueCart(this.userId).subscribe({
            next: (res) => {
                this.revenueCart = res;
            },
            error: (err) => {
                console.log(err);
            }
        })
    }

    getCourseCart() {
        this.statisticService.getCourseCart(this.userId).subscribe({
            next: (res) => {
                this.courseCart = res;
            },
            error: (err) => {
                console.log(err);
            }
        })
    }


    getCategoryCourseStatistics(){



        this.statisticService.getCategoryCourseStatistic(this.userId).subscribe({
            next: (res) => {
                this.categoryCourseStatistics = res;
            },
            error: (err) => {
                console.log(err);
            }
        });
    }

    getRevenueStatistics() {

        let currentDate = new Date();
        this.statisticReq.startDate = new Date(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000).toDateString();
        this.statisticReq.endDate = currentDate.toDateString();
        this.statisticReq.instructorId = this.loggedInUser!.id;

        this.statisticService.getStatisticCompleteOrder(this.statisticReq).subscribe({
            next: (res) => {
                this.revenueStatistics = res;
            },
            error: (err) => {
                console.log(err);
            }
        })
    }

    getModerationRequestCourse() {


        this.courseQuery.sort = 'updatedTime';
        this.courseQuery.size = 6;
        this.courseQuery.instructorId = this.loggedInUser!.id;
        this.courseService.getManagerPage(this.courseQuery).subscribe({
            next: (res) => {
                this.courses = res.content;
            },
            error: (err) => {
                console.log(err);
            }
        })
    }

    roundAndFormatNumber(number: number| undefined){
        if(number == undefined){
            return '';
        }
        let roundNumber = Math.round(number);
        const formattedValue = new Intl.NumberFormat('vi-VN').format(roundNumber);
        return `${formattedValue} VND`;
    }

    gotoModerationRequest( courseId: number){

        let url = '/instructor/courses/detail/' + courseId;
        this.router.navigate([url]);

    }

    protected readonly getApprovalStatusEnum = getApprovalStatusEnum;

}
