import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import { environment } from '../environment';
import { QuestionAnswerQuery } from '../dtos/question-answer/question-answer.query';
import {Observable, throwError} from 'rxjs';
import {QuestionAnswer} from "../model/question-answer";
import {QuestionAnswerReq} from "../dtos/question-answer/question-answer.req";
import {ActionReq} from "../dtos/action/action.req";

@Injectable({
  providedIn: 'root'
})
export class QuestionAnswerService {

    // questionAnswerApi = environment.api + 'question-answers';
    // managerApi = environment.api + 'question-answers/manager';
    // publicApi = environment.api + 'question-answers/public';
    private questionAnswerApi = environment.api + 'question-answers';
    private managerApi = environment.api + 'question-answers/manager';
    private publicApi = environment.api + 'question-answers/public';

    constructor(
        private httpClient: HttpClient,
        private httpUtilsService: HttpUtilsService
    ) { }

    getPage(questionAnswerQuery: QuestionAnswerQuery): Observable<GetResponse> {
        questionAnswerQuery.page = questionAnswerQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: questionAnswerQuery.queryParams
        };
        questionAnswerQuery.page = questionAnswerQuery.page + 1;
        return this.httpClient.get<GetResponse>(this.questionAnswerApi, httpOptions);
    }

    getById(id: number): Observable<QuestionAnswer> {
        return this.httpClient.get<QuestionAnswer>(this.questionAnswerApi + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    create(questionAnswerReq: QuestionAnswerReq): Observable<QuestionAnswer> {
        return this.httpClient.post<QuestionAnswer>(this.questionAnswerApi, questionAnswerReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteByOwner(id: number): Observable<any> {
        return this.httpClient.delete(this.questionAnswerApi + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    update(id: number, questionAnswerReq: QuestionAnswerReq): Observable<QuestionAnswer> {
        return this.httpClient.put<QuestionAnswer>(this.questionAnswerApi + '/' + id, questionAnswerReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    delete(id: number, actionReq: ActionReq): Observable<any> {
        return this.httpClient.put(this.managerApi + '/' + id, actionReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});

    }

    deleteByReportedId(id: number, actionReq: ActionReq): Observable<any> {
        return this.httpClient.put(this.managerApi + '/report/' + id, actionReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getQuestionAnswerByIdIgnoreDeleted(id: number): Observable<QuestionAnswer> {
        return this.httpClient.get<QuestionAnswer>(this.questionAnswerApi + '/' + id + '/ignore-deleted', {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }
}

interface GetResponse {
    content: QuestionAnswer[];
    totalPages: number;
    totalElements: number;

}
