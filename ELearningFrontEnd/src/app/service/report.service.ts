import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import {environment} from "../environment";
import { ReportQuery } from '../dtos/report/report.query';
import {Report} from "../model/report";
import {ReportReq} from "../dtos/report/report.req";
import {ReportActionReq} from "../dtos/report/report-action.req";

@Injectable({
  providedIn: 'root'
})
export class ReportService {

    public api = environment.api + 'reports';
    constructor(
        private httpClient: HttpClient,
        private httpUtilsService: HttpUtilsService
    ) { }

    getPage(reportQuery: ReportQuery) {

        reportQuery.page = reportQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: reportQuery.queryParams
        };
        reportQuery.page = reportQuery.page + 1;
        return this.httpClient.get<GetResponse>(this.api, httpOptions);
    }

    getById(id: number) {
        return this.httpClient.get<Report>(this.api + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    // dismissReport(id: number) {
    //     return this.httpClient.patch<Report>(this.api + '/dismiss/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    // }

    create(reportReq: ReportReq) {
        return this.httpClient.post<Report>(this.api, reportReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    blockUser(reportActionReq: ReportActionReq) {
        return this.httpClient.put<any>(this.api + '/block-user', reportActionReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteReview(reportActionReq: ReportActionReq) {
        return this.httpClient.put<any>(this.api + '/delete-review', reportActionReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteQuestionAnswer(reportActionReq: ReportActionReq) {
        return this.httpClient.put<any>(this.api + '/delete-question-answer', reportActionReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteCourse(reportActionReq: ReportActionReq) {
        return this.httpClient.put<any>(this.api + '/delete-course', reportActionReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    rejectCourse(reportActionReq: ReportActionReq) {
        return this.httpClient.put<any>(this.api + '/reject-course', reportActionReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getReportCourse(reportQuery: ReportQuery) {
        reportQuery.page = reportQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: reportQuery.queryParams
        };
        reportQuery.page = reportQuery.page + 1;
        return this.httpClient.get<GetResponse>(this.api + '/course', httpOptions);
    }

    getReportReview(reportQuery: ReportQuery) {
        reportQuery.page = reportQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: reportQuery.queryParams
        };
        reportQuery.page = reportQuery.page + 1;
        return this.httpClient.get<GetResponse>(this.api + '/review', httpOptions);
    }

    getReportQuestionAnswer(reportQuery: ReportQuery) {
        reportQuery.page = reportQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: reportQuery.queryParams
        };
        reportQuery.page = reportQuery.page + 1;
        return this.httpClient.get<GetResponse>(this.api + '/question-answer', httpOptions);
    }

    getReportCourseById(id: number) {
        return this.httpClient.get<Report>(this.api + '/course/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getReportReviewById(id: number) {
        return this.httpClient.get<Report>(this.api + '/review/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getReportQuestionAnswerById(id: number) {
        return this.httpClient.get<Report>(this.api + '/question-answer/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    dismissReport(reportActionReq: ReportActionReq){
        return this.httpClient.put<any>(this.api + '/dismiss', reportActionReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    checkReportStatus(reports: Report[], status: string) {
        let result = false;
        reports.forEach(report => {
            if (report.status === status) {
                result = true;
            }
        });
        return result;
    }
}

interface GetResponse {
    content: Report[];
    totalPages: number;
    totalElements: number;
}
