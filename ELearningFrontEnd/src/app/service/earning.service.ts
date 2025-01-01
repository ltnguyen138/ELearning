import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import {environment} from "../environment";
import {Observable} from "rxjs";
import {PayoutHistory} from "../model/payout-history";
import {Earning} from "../model/earning";

@Injectable({
  providedIn: 'root'
})
export class EarningService {

    private api = environment.api + 'earning';
    constructor(private httpCilent: HttpClient,
                private httpUtilsService: HttpUtilsService) { }

    getPayoutHistory(): Observable<PayoutHistory[]>{
        return this.httpCilent.get<PayoutHistory[]>(this.api + '/get-payout-history', {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getEarning(){
        return this.httpCilent.get<Earning>(this.api + '/get-earning', {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    payout(){
        return this.httpCilent.get<PayoutHistory>(this.api + '/payout', {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }
}
