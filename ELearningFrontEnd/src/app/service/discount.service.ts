import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import { DiscountQuery } from '../dtos/discount/discount.query';
import {DiscountReq} from "../dtos/discount/discount.req";
import {Course} from "../model/course";
import { Discount } from '../model/discount';
import {OrderItem} from "../dtos/order/order.item";
import {environment} from "../environment";

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

    // apiDiscounts = 'http://localhost:8080/api/v1/discounts';
    // publicApi = 'http://localhost:8080/api/v1/discounts/public';
    // managerApi = 'http://localhost:8080/api/v1/discounts/manager';
    private apiDiscounts = environment.api + 'discounts';
    private publicApi = environment.api + 'discounts/public';
    private managerApi = environment.api + 'discounts/manager';
    constructor(private httpCilent: HttpClient,
                private httpUtilsService: HttpUtilsService) { }

    getPublicPage(discountQuery: DiscountQuery) {
        discountQuery.page = discountQuery.page - 1;
        let params = discountQuery.queryParams;
        discountQuery.page = discountQuery.page + 1;
        return this.httpCilent.get<GetResponse>(this.publicApi, {params});
    }

    getManagerPage(discountQuery: DiscountQuery) {
        discountQuery.page = discountQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: discountQuery.queryParams
        };
        discountQuery.page = discountQuery.page + 1;
        return this.httpCilent.get<GetResponse>(this.managerApi, httpOptions);
    }

    getById(id: number) {

        return this.httpCilent.get<Discount>(this.apiDiscounts + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getGlobalCanUseDiscounts() {

        return this.httpCilent.get<Discount | null>(this.publicApi + '/global/can-use',);
    }

    createGlobalDiscount(discountReq: DiscountReq) {

        return this.httpCilent.post<Discount>(this.apiDiscounts + '/global', discountReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    createCourseDiscount(discountReq: DiscountReq, courseId: number) {

        return this.httpCilent.post<Discount>(this.apiDiscounts + '/course/' + courseId, discountReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    updateDiscount(discountReq: DiscountReq, discountId: number) {

            return this.httpCilent.put<Discount>(this.apiDiscounts + '/' + discountId, discountReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteDiscount(id: number) {
        return this.httpCilent.delete(this.apiDiscounts + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    toggleDiscount(discountId: number) {
        return this.httpCilent.put<Discount>(this.apiDiscounts + '/' + discountId + '/toggle-activation', null, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    applyDiscount(code: string, courseId: number) {
        return this.httpCilent.get<OrderItem>(this.publicApi + '/apply/' + code + '/' + courseId);
    }
}

interface GetResponse {

    content: Discount[];
    totalPages: number;
    totalElements: number;
}


