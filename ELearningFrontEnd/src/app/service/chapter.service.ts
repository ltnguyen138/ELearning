import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import { ChapterQuery } from '../dtos/chapter/chapter.query';
import {Chapter} from "../model/chapter";
import { Observable } from 'rxjs';
import {ChapterReq} from "../dtos/chapter/chapter.req";
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {

    // private apiChapters = 'http://localhost:8080/api/v1/chapters';
    // private managerApi = 'http://localhost:8080/api/v1/chapters/manager';
    // private publicApi = 'http://localhost:8080/api/v1/chapters/public';
    private apiChapters = environment.api + 'chapters';
    private managerApi = environment.api + 'chapters/manager';
    private publicApi = environment.api + 'chapters/public';

    constructor(private httpCilent: HttpClient,
                private httpUtilsService: HttpUtilsService) { }

    getPublicPage(chapterQuery: ChapterQuery): Observable<GetResponse> {

        chapterQuery.page = chapterQuery.page - 1;
        let params = chapterQuery.queryParams;
        chapterQuery.page = chapterQuery.page + 1;
        return this.httpCilent.get<GetResponse>(this.publicApi, {params});
    }

    getManagerPage(chapterQuery: ChapterQuery): Observable<GetResponse> {
        chapterQuery.page = chapterQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: chapterQuery.queryParams
        };
        chapterQuery.page = chapterQuery.page + 1;
        return this.httpCilent.get<GetResponse>(this.managerApi, httpOptions);
    }

    getPublicChapter(id: number): Observable<Chapter> {
        return this.httpCilent.get<Chapter>(this.publicApi + '/' + id);
    }
    getManagerChapter(id: number): Observable<Chapter> {
        return this.httpCilent.get<Chapter>(this.managerApi + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    createChapter(chapterReq: ChapterReq): Observable<Chapter> {
            return this.httpCilent.post<Chapter>(this.apiChapters, chapterReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    updateChapter(chapterReq: ChapterReq, chapterId:number): Observable<Chapter> {
        return this.httpCilent.put<Chapter>(this.apiChapters + '/' + chapterId, chapterReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteChapter(id: number): Observable<any> {
        return this.httpCilent.delete(this.apiChapters + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    swapOrderNumber(courseId: number ,chapterId: number, chapterId2: number): Observable<any> {

        return this.httpCilent.put(this.apiChapters + '/swap/' + courseId + '/' + chapterId + '/' + chapterId2, null, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }
    createChaptersAndLectures(chapterReq: ChapterReq[]): Observable<Chapter[]> {
        return this.httpCilent.post<Chapter[]>(this.apiChapters + '/bulk', chapterReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getFileCreateChaptersAndLecturesTemplate(): Observable<Blob> {
        return this.httpCilent.get(this.apiChapters + '/bulk/template', {headers: this.httpUtilsService.createRequiresTokenHeader(), responseType: 'blob'});
    }
}

interface GetResponse {
        content: Chapter[];
        totalPages: number;
        totalElements: number;
}
