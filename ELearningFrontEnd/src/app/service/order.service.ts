import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import { OrderQuery } from '../dtos/order/order.query';
import { Observable } from 'rxjs';
import {Order} from "../model/order/order";
import {OrderReq} from "../dtos/order/order.req";
import {OrderTrackReq} from "../dtos/order/order.track.req";
import {RefundReq} from "../dtos/order/refund.req";
import {environment} from "../environment";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

    // private apiOrders = 'http://localhost:8080/api/v1/orders';
    // private managerApi = 'http://localhost:8080/api/v1/orders/admin';
    // private publicApi = 'http://localhost:8080/api/v1/orders/public';
    // private customerApi = 'http://localhost:8080/api/v1/orders/customer';
    private apiOrders = environment.api + 'orders';
    private managerApi = environment.api + 'orders/admin';
    private publicApi = environment.api + 'orders/public';
    private customerApi = environment.api + 'orders/customer';

    constructor(private httpCilent: HttpClient,
                private httpUtilsService: HttpUtilsService) {

    }

    getCustomerPage(orderQuery: OrderQuery): Observable<GetResponse> {
        orderQuery.page = orderQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: orderQuery.queryParams
        };
        orderQuery.page = orderQuery.page + 1;
        return this.httpCilent.get<GetResponse>(this.customerApi, httpOptions);
    }

    getManagerPage(orderQuery: OrderQuery): Observable<GetResponse> {
        orderQuery.page = orderQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: orderQuery.queryParams
        };
        orderQuery.page = orderQuery.page + 1;
        return this.httpCilent.get<GetResponse>(this.managerApi, httpOptions);
    }

    getByLoggedCustomer(orderQuery: OrderQuery): Observable<GetResponse> {

        orderQuery.page = orderQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: orderQuery.queryParams
        };
        orderQuery.page = orderQuery.page + 1;
        return this.httpCilent.get<GetResponse>(this.apiOrders + '/accountant', httpOptions);
    }

    getByIdForAdmin(id: number): Observable<Order> {
        return this.httpCilent.get<Order>(this.managerApi + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getByIdForCustomer(id: number): Observable<Order> {
        return this.httpCilent.get<Order>(this.customerApi + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    createOrder(orderReq: OrderReq): Observable<Order> {

        return this.httpCilent.post<Order>(this.apiOrders, orderReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    updateOrderTrack(orderTrackReq: OrderTrackReq, orderId:number): Observable<Order> {
        return this.httpCilent.put<Order>(this.managerApi + '/' + orderId + '/track', orderTrackReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    checkPending(){
        return this.httpCilent.get(this.apiOrders + '/check-pending', {headers: this.httpUtilsService.createRequiresTokenHeader(), responseType: 'text'});
    }

    deletePendingOrder(){
        return this.httpCilent.delete(this.apiOrders + '/delete-pending', {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    refund(refundReq: RefundReq){
        return this.httpCilent.post<Order>(this.apiOrders + '/refund', refundReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }
}

interface GetResponse {
    content: Order[];
    totalPages: number;
    totalElements: number;

}
