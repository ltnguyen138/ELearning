import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import {environment} from "../environment";
import {StatisticReq} from "../dtos/statistic/statistic.req";
import {StatisticRes} from "../dtos/statistic/statisticRes";
import {DashboardCartRes} from "../dtos/statistic/dashboard-cart.res";

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

    api = environment.api + 'statistic';
    constructor(
        private httpClient: HttpClient,
        private httpUtilsService: HttpUtilsService
    ) { }

    getStatisticCompleteOrder(statisticReq: StatisticReq) {
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: statisticReq.queryParams
        };
        return this.httpClient.get<StatisticRes[]>(this.api + '/get-statistic-complete-order', httpOptions );
    }

    getStatisticRefundOrder(statisticReq: StatisticReq) {
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: statisticReq.queryParams
        };
        return this.httpClient.get<StatisticRes[]>(this.api + '/get-statistic-refunded-order', httpOptions );
    }

    getRevenueCart(instructorId: number | null) {

        if(instructorId == null) {
            const httpOptions = {
                headers: this.httpUtilsService.createRequiresTokenHeader(),
            };
            return this.httpClient.get<DashboardCartRes>(this.api + '/get-revenue-cart', httpOptions );
        }else {
            const httpOptions = {
                headers: this.httpUtilsService.createRequiresTokenHeader(),
                params: {
                    instructorId: instructorId.toString()
                }
            };
            return this.httpClient.get<DashboardCartRes>(this.api + '/get-revenue-cart' , httpOptions );
        }
    }

    getCourseCart(instructorId: number | null) {

        if(instructorId == null) {
            const httpOptions = {
                headers: this.httpUtilsService.createRequiresTokenHeader(),
            };
            return this.httpClient.get<DashboardCartRes>(this.api + '/get-course-cart', httpOptions );
        }else {
            const httpOptions = {
                headers: this.httpUtilsService.createRequiresTokenHeader(),
                params: {
                    instructorId: instructorId.toString()
                }
            };
            return this.httpClient.get<DashboardCartRes>(this.api + '/get-course-cart', httpOptions);
        }
    }

    getUserCart() {

        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
        }
        return this.httpClient.get<DashboardCartRes>(this.api + '/get-user-cart', httpOptions);
    }

    getCategoryCourseStatistic(instructorId: number | null) {
        if(instructorId == null) {
            const httpOptions = {
                headers: this.httpUtilsService.createRequiresTokenHeader(),
            };
            return this.httpClient.get<StatisticRes[]>(this.api + '/get-category-course-statistic', httpOptions );
        }else {
            const httpOptions = {
                headers: this.httpUtilsService.createRequiresTokenHeader(),
                params: {
                    instructorId: instructorId.toString()
                }
            };
            return this.httpClient.get<StatisticRes[]>(this.api + '/get-category-course-statistic', httpOptions);
        }
    }

}
