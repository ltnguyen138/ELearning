import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import {environment} from "../environment";
import { ReviewQuery } from '../dtos/review/review.query';
import {Review} from "../model/review";
import {ReviewReq} from "../dtos/review/review.req";
import {ActionReq} from "../dtos/action/action.req";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

    reviewApi = environment.api + 'reviews';
    managerApi = environment.api + 'reviews/manager';
    publicApi = environment.api + 'reviews/public';

    constructor(
        private httpClient: HttpClient,
        private httpUtilsService: HttpUtilsService
    ) { }

    getManagerPage(reviewQuery: ReviewQuery) {

        reviewQuery.page = reviewQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: reviewQuery.queryParams
        };
        reviewQuery.page = reviewQuery.page + 1;
        return this.httpClient.get<GetResponse>(this.managerApi, httpOptions);
    }

    getPublicPage(reviewQuery: ReviewQuery) {

        reviewQuery.page = reviewQuery.page - 1;
        let params = reviewQuery.queryParams;
        reviewQuery.page = reviewQuery.page + 1;
        return this.httpClient.get<GetResponse>(this.publicApi, {params});
    }

    getPublicByCourseId(courseId: number, reviewQuery: ReviewQuery) {
        reviewQuery.page = reviewQuery.page - 1;
        let params = reviewQuery.queryParams;
        reviewQuery.page = reviewQuery.page + 1;
        return this.httpClient.get<GetResponse>(this.publicApi +'/' +   courseId, {params: params});
    }

    getByUserAndCourseId(courseId: number) {

            return this.httpClient.get<Review | null>(this.reviewApi + '/accountant/' + courseId, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    create(reviewReq: ReviewReq) {
        return this.httpClient.post<Review>(this.reviewApi, reviewReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    update(reviewReq: ReviewReq, reviewId: number) {
        return this.httpClient.put<Review>(this.reviewApi + '/' + reviewId, reviewReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteByOwner(reviewId: number) {
        return this.httpClient.delete(this.reviewApi + '/' + reviewId, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteByAdmin(reviewId: number, actionReq: ActionReq) {
        return this.httpClient.put(this.managerApi + '/' + reviewId, actionReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteByReport(reportId: number,  actionReq: ActionReq) {
        return this.httpClient.put(this.managerApi + '/report/' + reportId, actionReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getReviewByIdIgnoreDeleted(reviewId: number) {
        return this.httpClient.get<Review>(this.reviewApi + '/' + reviewId + '/ignore-deleted', {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }
}

interface GetResponse {
    content: Review[];
    totalPages: number;
    totalElements: number;
}
