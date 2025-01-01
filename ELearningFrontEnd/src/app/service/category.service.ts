import { Injectable } from '@angular/core';
import {environment} from "../environment";
import { HttpClient } from '@angular/common/http';
import { HttpUtilsService } from './http-utils.service';
import {CategoryQuery} from "../dtos/category/category.query";
import {Category} from "../model/category";
import {Observable} from "rxjs";
import {CategoryReq} from "../dtos/category/category.req";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

    private publicApi = environment.api + 'categories/public';
    private managerApi = environment.api + 'categories/manager';
    private apiCategories = environment.api + 'categories';
    constructor(
        private httpClient: HttpClient,
        private httpUtilsService: HttpUtilsService
    ) { }

    getPublicPage(categoryQuery: CategoryQuery): Observable<GetResponse> {
        categoryQuery.page = categoryQuery.page - 1;
        let params = categoryQuery.queryParams;
        categoryQuery.page = categoryQuery.page + 1;
        return this.httpClient.get<GetResponse>(this.publicApi, {params});
    }

    getManagerPage(categoryQuery: CategoryQuery): Observable<GetResponse> {
        categoryQuery.page = categoryQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: categoryQuery.queryParams
        };


        categoryQuery.page = categoryQuery.page + 1;
        return this.httpClient.get<GetResponse>(this.managerApi, httpOptions);
    }

    updateCategory(categoryReq: CategoryReq, categoryId:number): Observable<Category> {

        return this.httpClient.put<Category>(this.apiCategories + '/' + categoryId, categoryReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    createCategory(categoryReq: CategoryReq): Observable<Category> {
        return this.httpClient.post<Category>(this.apiCategories, categoryReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getCategory(id: number): Observable<Category> {
        return this.httpClient.get<Category>(this.managerApi + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteCategory(id: number): Observable<any> {
        return this.httpClient.delete(this.apiCategories + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    toggleActivation(id: number): Observable<Category> {
        return this.httpClient.patch<Category>(
                this.apiCategories + '/toggle-activation/' + id,
                null,
                {headers: this.httpUtilsService.createRequiresTokenHeader()}
            );
    }
    approveTemporary(id: number): Observable<Category> {
        return this.httpClient.patch<Category>(
                this.apiCategories + '/approve-temporary/' + id,
                null,
                {headers: this.httpUtilsService.createRequiresTokenHeader()}
            );
    }

}
interface GetResponse {
    content: Category[];
    totalPages: number;
}
