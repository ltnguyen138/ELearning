import {Component, OnInit} from '@angular/core';
import {StatisticReq} from "../../dtos/statistic/statistic.req";
import {StatisticRes} from "../../dtos/statistic/statisticRes";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {StatisticService} from "../../service/statistic.service";
import {AuthService} from "../../service/auth.service";
import {StatisticTimeLineTypeEnum} from "../../enum/statistic.time-line-type.enum";
import { ApprovalStatusEnum, getApprovalStatusEnum } from 'src/app/enum/approval.status.enum';
import { StatisticTypeEnum } from 'src/app/enum/statistic.type.enum';
import {UserService} from "../../service/user.service";
import {User} from "../../model/user";
import {CourseService} from "../../service/course.service";
import {CourseQuery} from "../../dtos/course/course.query";

@Component({
  selector: 'app-instructor-statistic',
  templateUrl: './instructor-statistic.component.html',
  styleUrls: ['./instructor-statistic.component.css']
})
export class InstructorStatisticComponent implements OnInit{

    statisticReq = new StatisticReq();
    statistics: StatisticRes[] = [];
    timeLine: string = '7day';
    title: string = '';
    charMinWidth: boolean = false;
    startDate: Date|undefined;
    endDate: Date|undefined;
    maxDateStartDate: Date = new Date();
    maxDateEndDate: Date = new Date();
    minDateEndDate: Date = new Date();
    isShowCustonmDate: boolean = false;
    isShowCustomMonth: boolean = false;
    isShowCustomYear: boolean = false;
    typeStatistic: string = 'ORDER';
    totalPrice: number = 0;
    totalDiscount: number = 0;
    totalFinalPrice: number = 0;
    AvgPrice: string = '';
    AvgDiscount: string = '';
    AvgFinalPrice: string = '';
    totalOrder: number = 0;
    totalCourse: number = 0;
    isLoaded = false;
    refunded: boolean = false;
    instructorId: number = 0;
    instructor?: User
    courseQuery = new CourseQuery();
    countPublishedCourse: number = 0;
    constructor(private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                protected router: Router,
                public statisticService: StatisticService,
                private authService: AuthService,
                private courseService: CourseService,
                private userService: UserService) {
    }

    ngOnInit(): void {


        let currentDate = new Date();
        this.statisticReq.startDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000).toDateString();
        this.statisticReq.endDate = currentDate.toISOString();
        this.route.queryParamMap.subscribe( params => {
            if(this.route.snapshot.paramMap.has('id')){
                this.instructorId = +this.route.snapshot.paramMap.get('id')!;
                this.statisticReq.instructorId = this.instructorId;
                this.courseQuery.instructorId = this.instructorId;
                this.courseQuery.size = 1;
                this.getInstructor();
                this.getCourses();
                this.countPublishedCourses();
            }
            this.statisticReq.startDate = params.get('startDate') || new Date(currentDate.getTime() - 6 * 24 * 60 * 60 * 1000).toDateString();

            this.statisticReq.endDate = params.get('endDate') || currentDate.toDateString();

            this.statisticReq.timeLineType = params.get('timeLineType') || this.statisticReq.timeLineType;
            this.statisticReq.statisticType = params.get('statisticType') || this.statisticReq.statisticType;
            this.statisticReq.timeLine = params.get('timeLine') || this.statisticReq.timeLine;
            this.timeLine = this.statisticReq.timeLine;
            this.typeStatistic = this.statisticReq.statisticType;
            this.statisticReq.refunded = params.get('refunded') === 'true' || params.get('refunded') === 'false'
                ? params.get('refunded') === 'true'
                : false;
            this.refunded = this.statisticReq.refunded;
            if(this.timeLine === 'customDay') {
                this.isShowCustonmDate = true;
                this.startDate = this.statisticReq.startDate ? new Date(this.convetDateToISO(this.statisticReq.startDate)) : undefined;
                this.endDate = this.statisticReq.endDate ? new Date(this.convetDateToISO(this.statisticReq.endDate)) : undefined;
            }
            if(this.timeLine === 'customMonth') {
                this.isShowCustomMonth = true;
                this.startDate = this.statisticReq.startDate ? new Date(this.convetDateToISO(this.statisticReq.startDate)) : undefined;
                this.endDate = this.statisticReq.endDate ? new Date(this.convetDateToISO(this.statisticReq.endDate)) : undefined;
            }
            if(this.timeLine === 'customYear') {
                this.isShowCustomYear = true;
                this.startDate = this.statisticReq.startDate ? new Date(this.convetDateToISO(this.statisticReq.startDate)) : undefined;
                this.endDate = this.statisticReq.endDate ? new Date(this.convetDateToISO(this.statisticReq.endDate)) : undefined;
            }
            this.getStatistic();
        });
    }

    getStatistic() {
        this.isLoaded = true;
        this.statisticService.getStatisticCompleteOrder(this.statisticReq).subscribe({
            next: data => {
                this.statistics = data;
                if(this.statistics.length <5){
                    this.charMinWidth = true;
                }else {
                    this.charMinWidth = false;
                }

                this.totalPrice = this.statistics.map(statistic => statistic.totalPrice).reduce((a, b) => a + b, 0);
                this.totalDiscount = this.statistics.map(statistic => statistic.globalDiscount+ statistic.courseDiscount).reduce((a, b) => a + b, 0);
                this.totalFinalPrice = this.statistics.map(statistic => statistic.finalPrice).reduce((a, b) => a + b, 0);
                this.calculateAvgPrice();
                if(this.statisticReq.statisticType == StatisticTypeEnum.ORDER){
                    this.totalOrder = this.statistics.map(statistic => statistic.countOrders).reduce((a, b) => a + b, 0);
                }else{
                    this.totalCourse = this.statistics.map(statistic => statistic.countCourse).reduce((a, b) => a + b, 0);
                    console.log(this.totalCourse);
                    console.log(this.statistics);
                }
                setTimeout(() => {
                    this.isLoaded = false;
                }, 100);

            },
            error: err => {
                this.isLoaded = false;
                this.toastr.error('Lỗi: ' + "Không thể lấy thống kê");
            }
        });
    }

    convertDate(date: string): string {

        let newDate = new Date(date);

        if (isNaN(newDate.getTime())) {

            return date;
        }
        const shortDateFormat = /^\d{2}-\d{2}-\d{4}$/;
        if(shortDateFormat.test(date)) {
            return date;
        }
        const day = ('0' + newDate.getDate()).slice(-2);   // Lấy ngày và thêm '0' nếu cần
        const month = ('0' + (newDate.getMonth() + 1)).slice(-2);  // Lấy tháng (tháng bắt đầu từ 0, nên cần cộng 1)
        const year = newDate.getFullYear();
        return `${day}-${month}-${year}`;
    }

    convetDateToISO(date: string): string {
        const shortDateFormat = /^\d{2}-\d{2}-\d{4}$/;
        if(!shortDateFormat.test(date)) {
            return date;
        }
        const day = date.split('-')[0];
        const month = date.split('-')[1];
        const year = date.split('-')[2];
        return `${month}-${day}-${year}`;
    }

    changeTimeLine() {
        if(this.timeLine === 'today') {
            this.statisticReq.timeLineType = StatisticTimeLineTypeEnum.DAY;
            this.statisticReq.startDate = new Date().toDateString();
            this.statisticReq.endDate = new Date().toDateString();
            this.statisticReq.timeLine = 'today';
            this.isShowCustonmDate = false;
            this.isShowCustomYear = false;
            this.isShowCustomMonth = false;
            this.updateUrlParams();
        }
        if(this.timeLine === '7day') {
            this.statisticReq.timeLineType = StatisticTimeLineTypeEnum.DAY;
            this.statisticReq.startDate = new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000).toDateString();
            console.log(this.statisticReq.startDate);
            this.statisticReq.endDate = new Date().toDateString();
            this.statisticReq.timeLine = '7day';
            this.isShowCustonmDate = false;
            this.isShowCustomYear = false;
            this.isShowCustomMonth = false;
            this.updateUrlParams();
        }
        if(this.timeLine === '30day') {
            this.statisticReq.timeLineType = StatisticTimeLineTypeEnum.DAY;
            this.statisticReq.startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toString();
            this.statisticReq.endDate  = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toString()
            this.statisticReq.timeLine = '30day';
            this.isShowCustonmDate = false;
            this.isShowCustomYear = false;
            this.isShowCustomMonth = false;
            this.updateUrlParams();
        }
        if(this.timeLine === 'year') {
            this.statisticReq.timeLineType = StatisticTimeLineTypeEnum.MONTH;
            this.statisticReq.startDate = new Date(new Date().getFullYear(), 0, 1).toString();
            this.statisticReq.endDate = new Date(new Date().getFullYear(), 11, 1).toString();
            this.statisticReq.timeLine = 'year';
            this.isShowCustonmDate = false;
            this.isShowCustomYear = false;
            this.isShowCustomMonth = false;
            this.updateUrlParams();
        }
        if(this.timeLine === 'customDay') {
            this.startDate = undefined;
            this.endDate = undefined;
            this.isShowCustomMonth = false;
            this.isShowCustomYear = false;
            this.statisticReq.timeLine = 'customDay';
            this.isShowCustonmDate = true;
        }
        if(this.timeLine === 'customMonth') {
            this.startDate = undefined;
            this.endDate = undefined;
            this.isShowCustonmDate = false;
            this.isShowCustomYear = false;
            this.statisticReq.timeLine = 'customMonth';
            this.isShowCustomMonth = true;
        }
        if(this.timeLine === 'customYear') {
            this.startDate = undefined;
            this.endDate = undefined;
            this.isShowCustonmDate = false;
            this.isShowCustomMonth = false;
            this.statisticReq.timeLine = 'customYear';
            this.isShowCustomYear = true;
        }

    }

    updateUrlParams() {
        this.router.navigate([], {
                relativeTo: this.route,
                queryParams: this.statisticReq.queryParams,
            }
        )
    }

    getTitle() {
        if (this.statisticReq.statisticType === 'ORDER') {

            if(this.statisticReq.refunded) {
                this.title = 'Biểu đồ hoàn tiền từ';
            }else {
                this.title = 'Biểu đồ doanh số từ';
            }
        }else if (this.statisticReq.statisticType === 'COURSE') {
            if(this.statisticReq.refunded) {
                this.title = 'Bảng thống kê hoàn tiền theo khóa học từ';
            }else {
                this.title = 'Bảng thống kê doanh số theo khóa học từ';
            }
        }else if (this.statisticReq.statisticType === 'CATEGORY') {
            if(this.statisticReq.refunded) {
                this.title = 'Biểu đồ hoàn tiền theo chủ đề từ';
            }else {
                this.title = 'Biểu đồ doanh số theo chủ đề từ';
            }
        }

        if (this.statisticReq.timeLineType === 'DAY') {
            const startDate = this.convertDate(this.statisticReq.startDate!);
            const endDate = this.convertDate(this.statisticReq.endDate!);
            this.title += ` ${startDate} đến ${endDate}`;
        }else if (this.statisticReq.timeLineType === 'MONTH') {
            const startDate = this.convertDate(this.statisticReq.startDate!);
            const endDate = this.convertDate(this.statisticReq.endDate!);
            const startMonth = startDate.split('-')[1]+'-'+startDate.split('-')[2];
            const endMonth = endDate.split('-')[1]+'-'+endDate.split('-')[2];
            this.title += ` tháng ${startMonth} đến tháng ${endMonth}`;
        }else if (this.statisticReq.timeLineType === 'YEAR') {
            const startDate = this.convertDate(this.statisticReq.startDate!);
            const endDate = this.convertDate(this.statisticReq.endDate!);
            const startYear = startDate.split('-')[2];
            const endYear = endDate.split('-')[2];
            this.title += ` năm ${startYear} đến năm ${endYear}`;
        }
        return this.title;
    }

    getTableTitle() {
        let title = '';
        if(this.statisticReq.refunded) {
            title = 'Thống kê hoàn tiền từ';
        }else {
            title = 'Thống kê doanh số từ';
        }

        if (this.statisticReq.timeLineType === 'DAY') {
            const startDate = this.convertDate(this.statisticReq.startDate!);
            const endDate = this.convertDate(this.statisticReq.endDate!);
            title += ` ${startDate} đến ${endDate}`;
        }else if (this.statisticReq.timeLineType === 'MONTH') {
            const startDate = this.convertDate(this.statisticReq.startDate!);
            const endDate = this.convertDate(this.statisticReq.endDate!);
            const startMonth = startDate.split('-')[1]+'-'+startDate.split('-')[2];
            const endMonth = endDate.split('-')[1]+'-'+endDate.split('-')[2];
            title += ` tháng ${startMonth} đến tháng ${endMonth}`;
        }else if (this.statisticReq.timeLineType === 'YEAR') {
            const startDate = this.convertDate(this.statisticReq.startDate!);
            const endDate = this.convertDate(this.statisticReq.endDate!);
            const startYear = startDate.split('-')[2];
            const endYear = endDate.split('-')[2];
            title += ` năm ${startYear} đến năm ${endYear}`;
        }
        return title;
    }

    viewCustomTimeStatistic() {

        if(this.timeLine === 'customDay') {
            if(this.startDate === undefined || this.endDate === undefined) {
                this.toastr.error('Vui lòng chọn ngày bắt đầu và kết thúc');
                return;
            }
            this.statisticReq.timeLineType = StatisticTimeLineTypeEnum.DAY;
            this.statisticReq.startDate = this.startDate!.toDateString();
            this.statisticReq.endDate = this.endDate!.toDateString();
            this.updateUrlParams();
        }else if(this.timeLine === 'customMonth') {
            if(this.startDate === undefined || this.endDate === undefined) {
                this.toastr.error('Vui lòng chọn tháng bắt đầu và kết thúc');
                return;
            }
            this.statisticReq.timeLineType = StatisticTimeLineTypeEnum.MONTH;
            this.statisticReq.startDate = this.startDate!.toDateString();
            this.statisticReq.endDate = this.endDate!.toDateString();
            this.updateUrlParams();
        }else if(this.timeLine === 'customYear') {
            if (this.startDate === undefined || this.endDate === undefined) {
                this.toastr.error('Vui lòng chọn năm bắt đầu và kết thúc');
                return;
            }
            this.statisticReq.timeLineType = StatisticTimeLineTypeEnum.YEAR;
            this.statisticReq.startDate = this.startDate!.toDateString();
            this.statisticReq.endDate = this.endDate!.toDateString();
            this.updateUrlParams();
        }
    }

    onstartDateSelect(event: any) {
        let date = new Date(this.startDate!.getTime()+ 30*24*60*60*1000);
        this.minDateEndDate = this.startDate!;
        if(date.getTime() > new Date().getTime()) {
            this.maxDateEndDate = new Date();
        }else {
            this.maxDateEndDate = date;
        }

        if(this.endDate && this.endDate!.getTime()-this.startDate!.getTime() < 0) {
            this.endDate = undefined;
        }

        if(this.endDate && ((this.endDate.getTime()-this.startDate!.getTime())/ (1000 * 60 * 60 * 24)) >30) {
            this.endDate = undefined;
        }
    }


    onstartDateSelectMonth(event: any) {

        const date = new Date(this.startDate!);
        date.setMonth(date.getMonth() + 12);
        this.minDateEndDate = this.startDate!;

        if (date.getTime() > new Date().getTime()) {
            this.maxDateEndDate = new Date();
        } else {
            this.maxDateEndDate = date;
        }

        if(this.endDate && this.endDate!.getTime()-this.startDate!.getTime() < 0) {
            this.endDate = undefined;
        }

        if (this.endDate) {
            const startYear = this.startDate!.getFullYear();
            const startMonth = this.startDate!.getMonth();
            const endYear = this.endDate.getFullYear();
            const endMonth = this.endDate.getMonth();

            const monthDiff = (endYear - startYear) * 12 + (endMonth - startMonth);

            if (monthDiff > 11) {
                this.endDate = undefined;
            }
        }
    }

    onstartDateSelectYear(event: any) {
        const date = new Date(this.startDate!);
        date.setFullYear(date.getFullYear() + 10);
        this.minDateEndDate = this.startDate!;

        if (date.getTime() > new Date().getTime()) {
            this.maxDateEndDate = new Date();
        } else {
            this.maxDateEndDate = date;
        }

        if(this.endDate && this.endDate!.getTime()-this.startDate!.getTime() < 0) {
            this.endDate = undefined;
        }

        if (this.endDate) {
            const startYear = this.startDate!.getFullYear();
            const endYear = this.endDate.getFullYear();

            if (endYear - startYear > 9) {
                this.endDate = undefined;
            }
        }

    }

    changStatisticType() {
        this.statisticReq.statisticType = this.typeStatistic;
        this.updateUrlParams();
    }

    roundAndFormatNumber(number: number){
        let roundNumber = Math.round(number);
        const formattedValue = new Intl.NumberFormat('vi-VN').format(roundNumber);
        return `${formattedValue} VND`;
    }

    calculateAvgPrice() {
        let dv = '';
        let spaceTime = 1
        let startDate = new Date(this.convetDateToISO(this.statisticReq.startDate!));
        let endDate = new Date(this.convetDateToISO(this.statisticReq.endDate!));
        if(this.statisticReq.timeLineType === 'DAY') {
            dv = 'ngày';

            const diffInMs = Math.abs(startDate.getTime()- endDate.getTime());
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24) +1;
            spaceTime = diffInDays;
        }else if(this.statisticReq.timeLineType === 'MONTH') {
            dv = 'tháng';
            spaceTime = (endDate.getFullYear() - startDate.getFullYear())*12 + (endDate.getMonth() - startDate.getMonth()) + 1;
            console.log(spaceTime);
        }else if(this.statisticReq.timeLineType === 'YEAR') {
            dv = 'năm';
            spaceTime = endDate.getFullYear() - startDate.getFullYear() + 1;
        }

        this.AvgPrice = `${this.roundAndFormatNumber(this.totalPrice/spaceTime)} / ${dv}`;
        this.AvgDiscount = `${this.roundAndFormatNumber(this.totalDiscount/spaceTime)} / ${dv}`;
        this.AvgFinalPrice = `${this.roundAndFormatNumber(this.totalFinalPrice/spaceTime)} / ${dv}`;

    }

    changeRefunded() {
        this.statisticReq.refunded = this.refunded;
        this.updateUrlParams();
    }

    getInstructor() {

        this.userService.getUser(this.instructorId).subscribe({
            next: data => {
                this.instructor = data;
            },
            error: err => {
                this.toastr.error('Lỗi: ' + "Không thể lấy thông tin giảng viên");
            }
        });
    }

    getCourses(){



        this.courseService.getManagerPage(this.courseQuery).subscribe({
            next: data => {
                this.totalCourse = data.totalElements;

            },
            error: err => {
                this.toastr.error('Lỗi: ' + "Không thể lấy danh sách khóa học");
            }
        });
    }

    countPublishedCourses(){
        this.courseService.countPurchasedCourses(this.courseQuery).subscribe({
            next: data => {
                this.countPublishedCourse = data;
            },
            error: err => {
                this.toastr.error('Lỗi: ' + "Không thể lấy danh sách khóa học");
            }
        });
    }

    protected readonly ApprovalStatusEnum = ApprovalStatusEnum;
    protected readonly StatisticTypeEnum = StatisticTypeEnum;
    protected readonly getApprovalStatusEnum = getApprovalStatusEnum;
}
