import { Injectable } from '@angular/core';
import {environment} from "../environment";
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import {Observable} from "rxjs";
import { User } from '../model/user';
import {UserQuery} from "../dtos/user/user.query";
import {Category} from "../model/category";

@Injectable({
  providedIn: 'root'
})
export class UserService {

    private apiAuth = environment.api + 'users';
    private publicApi = environment.api + 'users/public/';
    constructor(private http:HttpClient,
                private httpUtilsService: HttpUtilsService) {

    }

    uploadProfilePicture(file: File, userId:number): Observable<User> {
        const formData = new FormData();
        formData.append('image', file);
        return this.http.post<User>(this.apiAuth + '/upload-profile-picture/'+userId, formData, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getUser(id: number): Observable<User> {
        return this.http.get<User>(this.publicApi  + id);
    }

    getPage(userQuery: UserQuery): Observable<GetResponse> {
        userQuery.page = userQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: userQuery.queryParams
        };
        userQuery.page = userQuery.page + 1;
        return this.http.get<GetResponse>(this.apiAuth, httpOptions);
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete(this.apiAuth + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    toggleActivation(id: number): Observable<User> {
        return this.http.patch<User>(this.apiAuth +'/' + id + '/toggle-activation' , null, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getProfilePictureUrl(profilePicture: string)  {
        return this.http.get(this.apiAuth + '/profile-picture-url/' + profilePicture, { responseType: 'text' });
    }
}

interface GetResponse {
    content: User[];
    totalPages: number;
}