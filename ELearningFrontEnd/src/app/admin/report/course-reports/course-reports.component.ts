import { Component, OnInit } from '@angular/core';
import {Report} from "../../../model/report";
import {ReportQuery} from "../../../dtos/report/report.query";
import {ReportStatus} from "../../../enum/report.status";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../../service/course.service";
import {ChapterService} from "../../../service/chapter.service";
import {ConfirmationService} from "primeng/api";
import {ReviewService} from "../../../service/review.service";
import {ReportService} from "../../../service/report.service";
import {QuestionAnswer} from "../../../model/question-answer";
import {ReportActionReq} from "../../../dtos/report/report-action.req";
import {EntityNameEnum} from "../../../enum/entity.name.enum";
import {ActionTypeEnum} from "../../../enum/action.type.enum";
import {Course} from "../../../model/course";
import {ApprovalStatusEnum} from "../../../enum/approval.status.enum";

@Component({
  selector: 'app-course-reports',
  templateUrl: './course-reports.component.html',
  styleUrls: ['./course-reports.component.css']
})
export class CourseReportsComponent implements OnInit {

    reports: Report[] = [];
    reportQuery = new ReportQuery();
    totalPages: number = 0;
    visiblePages: number[] = [];
    reason: string = '';
    statusFilter: string = '';
    reportStatus: String[] = Object.values(ReportStatus);
    sortBy: string = 'timestamp,desc';
    courseIdFilter: number = -1;
    courseNameFilter: string = '';
    title: string = '';
    selectedReportsId: Set<number> = new Set();
    reasonForm !:FormGroup
    isOpenDeleteModal: boolean = false;
    actionType: string = '';

    constructor(private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private courseService: CourseService,
                protected router: Router,
                private chapterService: ChapterService,
                private confirmService: ConfirmationService,
                private reviewService: ReviewService,
                protected reportService: ReportService) {

        this.reasonForm = this.fb.group({
            reason: ['', [Validators.required]]
        });

    }

    ngOnInit(): void {
        if(this.route.snapshot.queryParamMap.get('entityId') != null){
            // @ts-ignore
            this.courseService.getCourseByIdIgnoreDeleted(+this.route.snapshot.queryParamMap.get('entityId')).subscribe({
                next: course => {
                    this.courseNameFilter = course.name;
                    this.title = 'Đang lọc theo báo cáo theo đánh giá: ' + this.courseNameFilter;
                }
            });

        }
        this.route.queryParamMap.subscribe( params => {
            this.reportQuery.page = +params.get('page')! || this.reportQuery.page;
            this.reportQuery.sort = params.get('sort') || this.sortBy;
            this.reportQuery.reason = params.get('reason') || undefined;
            this.reportQuery.status = params.get('status') || undefined;
            this.reportQuery.entityId = +params.get('entityId')! || undefined;
            this.reason = this.reportQuery.reason || '';
            this.statusFilter = this.reportQuery.status || '';
            this.courseIdFilter = this.reportQuery.entityId || -1;
            this.loadReports();
        });
    }

    loadReports(){
        this.reportQuery.size = 5;
        this.reportService.getReportCourse(this.reportQuery).subscribe({
            next: page => {
                this.reports = page.content;
                this.totalPages = page.totalPages;
                this.visiblePages = this.generatePageArray();
            }
        });
    }
    generatePageArray(): number[] {
        return Array.from({ length: 9 }, (_, i) => 1 + i)
            .filter(num => num >= 1 && num <= this.totalPages);
    }

    updateUrlParams(): void {
        this.router.navigate([], {
                relativeTo: this.route,
                queryParams: this.reportQuery.queryParams,
            }
        )
    }

    pageChange(page: number): void {
        this.reportQuery.page = page;
        this.updateUrlParams();
    }

    search(): void {
        this.reportQuery.reason = this.reason;
        this.reportQuery.page = 1;
        this.updateUrlParams();
    }

    changeReportStatusFilter(): void {
        this.reportQuery.status = this.statusFilter;
        this.reportQuery.page = 1;
        this.updateUrlParams();
    }

    sortByChange(): void {
        this.reportQuery.sort = this.sortBy;
        this.reportQuery.page = 1;
        this.updateUrlParams();
    }
    clearFilter(): void {
        this.reportQuery.reason = undefined;
        this.reportQuery.status = undefined;
        this.reason = '';
        this.statusFilter = '';
        this.reportQuery.page = 1;
        this.reportQuery.entityId = undefined;
        this.courseIdFilter = -1;
        this.courseNameFilter = '';
        this.title = '';
        this.selectedReportsId.clear();
        this.updateUrlParams();
    }

    courseNameFilterChange(course: Course): void {
        this.reportQuery.entityId = course.id;
        this.courseIdFilter = course.id;
        this.courseNameFilter = course.name;
        this.title = 'Đang lọc theo báo cáo theo đánh giá: ' + this.courseNameFilter;
        this.reportQuery.page = 1;
        this.updateUrlParams();
    }

    toggleSelection(report: Report){

        if(this.selectedReportsId.has(report.id)){
            this.selectedReportsId.delete(report.id);
        }else{
            this.selectedReportsId.add(report.id);
        }
    }

    toggleAllSelection(){
        if(this.selectedReportsId.size == this.reports.length){
            this.selectedReportsId.clear();
        }else{
            this.reports.forEach(report => {
                this.selectedReportsId.add(report.id);
            });
        }
    }

    openDeleteModal(actionType: string){
        this.reasonForm.reset();
        this.actionType = actionType;
        this.isOpenDeleteModal = true;
    }

    deleteCourse(reportActionReq: ReportActionReq): void {
        reportActionReq.entityType = EntityNameEnum.COURSE;
        reportActionReq.actionType = ActionTypeEnum.DELETE;
        this.confirmService.confirm({
            message: 'Bạn có chắc chắn muốn xóa khóa học này?',
            header: 'Xác nhận',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            accept: () => {
                this.reportService.deleteCourse(reportActionReq).subscribe({
                    next: () => {
                        this.toastr.success('Xóa khóa học thành công');
                        this.isOpenDeleteModal = false;
                        this.loadReports();
                        this.selectedReportsId.clear();
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            }
        });
    }

    rejecCourse(reportActionReq: ReportActionReq): void {
        reportActionReq.entityType = EntityNameEnum.COURSE;
        reportActionReq.actionType = ActionTypeEnum.REJECTED;
        this.confirmService.confirm({
            message: 'Bạn có chắc chắn muốn HỦY phê duyệt khóa học này?',
            header: 'Xác nhận',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            accept: () => {
                this.reportService.rejectCourse(reportActionReq).subscribe({
                    next: () => {
                        this.toastr.success('Từ chối xóa khóa học thành công');
                        this.isOpenDeleteModal = false;
                        this.loadReports();
                        this.selectedReportsId.clear();
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            }
        });
    }

    blockUser(reportActionReq: ReportActionReq): void {
        reportActionReq.entityType = EntityNameEnum.USER;
        reportActionReq.actionType = ActionTypeEnum.BLOCK;
        this.confirmService.confirm({
            message: 'Bạn có chắc chắn muốn chặn giảng viên này?',
            header: 'Xác nhận',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            accept: () => {
                this.reportService.blockUser(reportActionReq).subscribe({
                    next: () => {
                        this.toastr.success('Chặn người dùng thành công');
                        this.isOpenDeleteModal = false;
                        this.loadReports();
                        this.selectedReportsId.clear();
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            }
        });
    }

    dismissReport(reportActionReq: ReportActionReq): void {
        reportActionReq.entityType = EntityNameEnum.QUESTION_ANSWER;
        reportActionReq.actionType = ActionTypeEnum.DISMISS;
        this.confirmService.confirm({
            message: 'Bạn có chắc chắn muốn bỏ qua các báo cáo này?',
            header: 'Xác nhận',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            accept: () => {
                this.reportService.dismissReport(reportActionReq).subscribe({
                    next: () => {
                        this.toastr.success('Bỏ qua báo cáo thành công');
                        this.isOpenDeleteModal = false;
                        this.loadReports();
                        this.selectedReportsId.clear();
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            }
        });
    }

    actionReports(){
        if(this.reasonForm.invalid){
            this.toastr.error('Vui lòng nhập lý do');
            return;
        }

        const  data: ReportActionReq = {
            ...this.reasonForm.value,
            ids: Array.from(this.selectedReportsId),
            entityId: this.courseIdFilter,

        }

        if(this.actionType == 'DELETE_COURSE'){
            this.deleteCourse(data);
        }else if(this.actionType == 'BLOCK_USER'){
            this.blockUser(data);
        }else if(this.actionType == 'IGNORE_REPORT') {
            this.dismissReport(data);
        }else if(this.actionType == 'REJECT_COURSE') {
            this.rejecCourse(data);
        }
    }

    protected readonly ReportStatus = ReportStatus;
    protected readonly ActionTypeEnum = ActionTypeEnum;
    protected readonly ApprovalStatusEnum = ApprovalStatusEnum;
}
