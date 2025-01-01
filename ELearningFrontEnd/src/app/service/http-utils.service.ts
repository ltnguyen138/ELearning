import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpUtilsService {

    constructor() { }

    createRequiresTokenHeader() {
        return new HttpHeaders({'x-requires-token': 'true'});
    }
}
