import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import {OrderReq} from "../dtos/order/order.req";
import {environment} from "../environment";

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

    // private api = 'http://localhost:8080/api/v1/paypal';
    private api = environment.api + 'paypal';
    constructor(
        private httpClient: HttpClient,
        private httpUtilsService: HttpUtilsService
    ) { }

    // Hàm gửi yêu cầu thanh toán
    createPayment(orderReq: OrderReq){

        return this.httpClient.post(this.api + '/payment/create', orderReq, {headers: this.httpUtilsService.createRequiresTokenHeader(), responseType: 'text'});
    }

    executePayment(paymentId: string, payerId: string){
        const url = this.api + '/payment/success?paymentId=' + paymentId + '&PayerID=' + payerId;
        return this.httpClient.get(url, {headers: this.httpUtilsService.createRequiresTokenHeader(), responseType: 'text'});
    }
}
