import { Injectable } from '@angular/core';
import {environment} from "../environment";
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import {User} from "../model/user";
import {Course} from "../model/course";
import {UserCourse} from "../model/user-course";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserCourseService {

    private api = environment.api + 'user-courses';
    private learnComleteLectureSubject = new BehaviorSubject<number>(0);
    learnComleteLecture$ = this.learnComleteLectureSubject.asObservable();
    constructor(private http:HttpClient,
                private httpUtilsService: HttpUtilsService) {
    }

    getByAliasAndUserId(alias: string) {

        return this.http.get<GetResponse>(this.api + '/' + alias, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    updateCurrentLectureId(alias: string, lectureId: number) {
        return this.http.put<UserCourse>(this.api + '/' + alias + '/current-lecture/' + lectureId, null, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    updateCompletedLectures(alias: string, lectures: number) {
        return this.http.put<GetResponse>(this.api + '/' + alias + '/completed-lectures/' + lectures, {} ,{headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    opLoadLearnCompleteLecture(lectureId: number){
        this.learnComleteLectureSubject.next(lectureId);
    }

    countLearnerComplete(courseId: number) {
        return this.http.get<any>(this.api + '/count-learner-complete/' + courseId, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }
}

interface GetResponse {
    course: Course;
    currentLectureId: number;
    lectures: [{lectureId: number}]
}
