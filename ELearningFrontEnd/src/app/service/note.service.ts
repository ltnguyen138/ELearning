import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import {environment} from "../environment";
import {QuestionAnswer} from "../model/question-answer";
import {Note} from "../model/note";
import {NoteQuery} from "../dtos/note/note.query";
import {BehaviorSubject, Observable} from "rxjs";
import {NoteReq} from "../dtos/note/note.req";

@Injectable({
  providedIn: 'root'
})
export class NoteService {

    private noteApi = environment.api + 'notes';
    private updateDurationSubject = new BehaviorSubject<number>(0);
    public updateDuration$ = this.updateDurationSubject.asObservable();
    private updateCurrentLectureSubject = new BehaviorSubject<number>(0);
    public updateCurrentLecture$ = this.updateCurrentLectureSubject.asObservable();

    constructor(
        private httpClient: HttpClient,
        private httpUtilsService: HttpUtilsService
    ) { }

    getPage(noteQuery: NoteQuery): Observable<GetResponse>{
        noteQuery.page = noteQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: noteQuery.queryParams
        };
        noteQuery.page = noteQuery.page + 1;
        return this.httpClient.get<GetResponse>(this.noteApi, httpOptions);
    }

    create(noteReq: NoteReq): Observable<Note> {
        return this.httpClient.post<Note>(this.noteApi, noteReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    delete(id: number): Observable<any> {
        return this.httpClient.delete(this.noteApi + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    update(id: number, noteReq: NoteReq): Observable<Note> {
        return this.httpClient.put<Note>(this.noteApi + '/' + id, noteReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    onUpdateDuration(duration: number){
        this.updateDurationSubject.next(duration);
    }
    onUpdateCurrentLecture(currentTime: number){
        this.updateCurrentLectureSubject.next(currentTime);
    }
}
interface GetResponse {
    content: Note[];
    totalPages: number;
    totalElements: number;

}