import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import {Course} from "../model/course";
import { CourseQuery } from '../dtos/course/course.query';
import { Observable } from 'rxjs';
import {CourseReq} from "../dtos/course/course.req";
import {ApprovalReq} from "../dtos/approval/approval.req";
import {ApprovalHistory} from "../model/approval-history";
import {UserCourseQuery} from "../dtos/course/user-course.query";
import {ActionReq} from "../dtos/action/action.req";
import {environment} from "../environment";

@Injectable({
  providedIn: 'root'
})
export class CourseService {

    // private apiCourses = 'http://localhost:8080/api/v1/courses';
    // private managerApi = 'http://localhost:8080/api/v1/courses/manager';
    // private publicApi = 'http://localhost:8080/api/v1/courses/public';
    // private instructorApi = 'http://localhost:8080/api/v1/courses/instructor';
    private apiCourses = environment.api + 'courses';
    private managerApi = environment.api + 'courses/manager';
    private publicApi = environment.api + 'courses/public';
    private instructorApi = environment.api + 'courses/instructor';
    constructor(private httpCilent: HttpClient,
                private httpUtilsService: HttpUtilsService) { }

    getPublicPage(courseQuery: CourseQuery): Observable<GetResponse> {

        courseQuery.page = courseQuery.page - 1;
        let params = courseQuery.queryParams;
        courseQuery.page = courseQuery.page + 1;
        return this.httpCilent.get<GetResponse>(this.publicApi, {params});
    }

    getManagerPage(courseQuery: CourseQuery): Observable<GetResponse> {
        courseQuery.page = courseQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: courseQuery.queryParams
        };
        courseQuery.page = courseQuery.page + 1;
        return this.httpCilent.get<GetResponse>(this.managerApi, httpOptions);
    }



    getManagerCourse(id: number): Observable<Course> {
        return this.httpCilent.get<Course>(this.managerApi + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getInstructorCourse(id: number): Observable<Course> {
        return this.httpCilent.get<Course>(this.instructorApi + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getByAlias(alias: string): Observable<Course> {
        return this.httpCilent.get<Course>(this.publicApi + '/' + alias);
    }

    createCourse(courseReq: CourseReq): Observable<Course> {

        return this.httpCilent.post<Course>(this.apiCourses, courseReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    updateCourse(courseReq: CourseReq, courseId:number): Observable<Course> {
        return this.httpCilent.put<Course>(this.apiCourses + '/' + courseId, courseReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteByOwner(id: number): Observable<any> {
        return this.httpCilent.delete(this.apiCourses + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    uploadImage(file: File, courseId: number): Observable<Course> {
        const formData = new FormData();
        formData.append('image', file);
        return this.httpCilent.post<Course>(this.apiCourses + '/' + courseId + '/image', formData, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getPurchasedCourses(): Observable<Course[]> {
        return this.httpCilent.get<Course[]>(this.apiCourses + '/purchased', {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getPurchasedPage(courseQuery: UserCourseQuery): Observable<GetResponse> {
        courseQuery.page = courseQuery.page - 1;
        let params = courseQuery.queryParams;
        courseQuery.page = courseQuery.page + 1;
        return this.httpCilent.get<GetResponse>(this.apiCourses + '/purchased/page', {params, headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getPurchasedCourseByAlias(alias: string): Observable<Course> {
        return this.httpCilent.get<Course>(this.apiCourses + '/purchased/' + alias, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    toggleModeration(courseId: number): Observable<Course> {
        return this.httpCilent.patch<Course>(this.apiCourses + '/' + courseId + '/request-moderation', {}, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    approval(courseId:number, approvalReq: ApprovalReq): Observable<Course> {
        return this.httpCilent.post<Course>(this.apiCourses + '/' + courseId + '/approval', approvalReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteCourse(courseId: number, actionReq: ActionReq): Observable<any> {
        return this.httpCilent.put(this.managerApi + '/' + courseId , actionReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteByReport(reportId: number, actionReq: ApprovalReq): Observable<any> {
        return this.httpCilent.put(this.managerApi + '/report/' + reportId, actionReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    blockCourse(reportId: number): Observable<any> {
        return this.httpCilent.patch(this.managerApi + '/block/' + reportId , {}, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    toggleActivation(courseId: number): Observable<Course> {
        return this.httpCilent.patch<Course>(this.apiCourses + '/' + courseId + '/toggle-activation', {}, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    rejectByReport(reportId: number, actionReq: ApprovalReq): Observable<any> {
        return this.httpCilent.put(this.managerApi + '/report/' + reportId + '/reject', actionReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getCourseByIdIgnoreDeleted(courseId: number): Observable<Course> {
        return this.httpCilent.get<Course>(this.apiCourses + '/' + courseId + '/ignore-deleted', {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    countPurchasedCourses(courseQuery: CourseQuery): Observable<any> {
        courseQuery.page = courseQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: courseQuery.queryParams
        };
        courseQuery.page = courseQuery.page + 1;
        return this.httpCilent.get<any>(this.apiCourses + '/count/purchased', httpOptions);
    }
}
interface GetResponse {
    content: Course[];
    totalPages: number;
    totalElements: number;
}

