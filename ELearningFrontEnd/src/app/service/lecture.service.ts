import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest, HttpResponse} from "@angular/common/http";
import {HttpUtilsService} from "./http-utils.service";
import {Lecture} from "../model/lecture";
import { LectureQuery } from '../dtos/lecture/lecture.query';
import { Observable } from 'rxjs';
import {ApprovalHistory} from "../model/approval-history";
import {ApprovalReq} from "../dtos/approval/approval.req";
import {ActionReq} from "../dtos/action/action.req";
import {environment} from "../environment";
import {LearnerCompleteLectureRes} from "../dtos/lecture/learner-complete-lecture.res";

@Injectable({
  providedIn: 'root'
})
export class LectureService {

    constructor(private httpCilent: HttpClient,
                private httpUtilsService: HttpUtilsService) { }

    // private publicApi = 'http://localhost:8080/api/v1/lectures/public';
    // private managerApi = 'http://localhost:8080/api/v1/lectures/manager';
    // private apiLectures = 'http://localhost:8080/api/v1/lectures';
    // private apiEnrolled = 'http://localhost:8080/api/v1/lectures/enrolled';
    private publicApi = environment.api + 'lectures/public';
    private managerApi = environment.api + 'lectures/manager';
    private apiLectures = environment.api + 'lectures';
    private apiEnrolled = environment.api + 'lectures/enrolled';
    getPublicPage(lectureQuery: LectureQuery): Observable<GetResponse> {
        lectureQuery.page = lectureQuery.page - 1;
        let params = lectureQuery.queryParams;
        lectureQuery.page = lectureQuery.page + 1;
        return this.httpCilent.get<GetResponse>(this.publicApi, {params});
    }

    getManagerPage(lectureQuery: LectureQuery): Observable<GetResponse> {
        lectureQuery.page = lectureQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: lectureQuery.queryParams
        };
        lectureQuery.page = lectureQuery.page + 1;
        return this.httpCilent.get<GetResponse>(this.managerApi, httpOptions);
    }

    getPublicLecture(id: number): Observable<Lecture> {
        return this.httpCilent.get<Lecture>(this.publicApi + '/' + id);

    }
    getManagerLecture(id: number): Observable<Lecture> {
        return this.httpCilent.get<Lecture>(this.managerApi + '/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    createLecture(lectureReq: LectureQuery): Observable<Lecture> {
            return this.httpCilent.post<Lecture>(this.managerApi, lectureReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    updateLecture(lectureReq: LectureQuery, lectureId:number): Observable<Lecture> {
        return this.httpCilent.put<Lecture>(this.managerApi + '/' + lectureId, lectureReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteByOwner(id: number): Observable<any> {
        return this.httpCilent.delete(this.apiLectures + '/instructor/' + id, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    uploadVideo(file: File, lectureId: number): Observable<HttpEvent<Lecture>> {
        const formData = new FormData();
        formData.append('video', file);

        const uploadReq = new HttpRequest('POST', this.managerApi + '/video/' + lectureId, formData, {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            reportProgress: true, // Bật theo dõi tiến trình
            responseType: 'json'
        });
        return this.httpCilent.request<Lecture>(uploadReq);
    }

    uploadS3Video(file: File, lectureId: number): Observable<HttpEvent<Lecture>> {
        const formData = new FormData();
        formData.append('video', file);

        const uploadReq = new HttpRequest('POST', this.managerApi + '/s3-video/' + lectureId, formData, {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            reportProgress: true,
            responseType: 'json'
        });

        return this.httpCilent.request<Lecture>(uploadReq);
    }

    uploadDocument(file: File, lectureId: number): Observable<HttpEvent<Lecture>> {
        const formData = new FormData();
        formData.append('document', file);

        const uploadReq = new HttpRequest('POST', this.managerApi + '/document/' + lectureId, formData, {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            reportProgress: true,
            responseType: 'json'
        });

        return this.httpCilent.request<Lecture>(uploadReq);
    }

    uploadS3Document(file: File, lectureId: number): Observable<HttpEvent<Lecture>> {
        const formData = new FormData();
        formData.append('document', file);

        const uploadReq = new HttpRequest('POST', this.managerApi + '/s3-document/' + lectureId, formData, {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            reportProgress: true,
            responseType: 'json'
        });

        return this.httpCilent.request<Lecture>(uploadReq);
    }

    deleteVideo(lectureId: number): Observable<any> {
        return this.httpCilent.delete(this.managerApi + '/video/'+ lectureId, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }
    deleteDocument(lectureId: number): Observable<any> {
        return this.httpCilent.delete(this.managerApi + '/video/'+ lectureId, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteS3Video(lectureId: number): Observable<any> {
        return this.httpCilent.delete(this.managerApi + '/s3-video/'+ lectureId, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteS3Document(lectureId: number): Observable<any> {
        return this.httpCilent.delete(this.managerApi + '/s3-document/'+ lectureId, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }
    getManagerVideo(lectureId: number): Observable<any> {
        return this.httpCilent.get(this.managerApi + '/video/'+ lectureId, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }
    getManagerDocument(lectureId: number): Observable<any> {
        return this.httpCilent.get(this.managerApi + '/document/' + lectureId, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getEnrolVideo(lectureId: number): Observable<any> {
        return this.httpCilent.get(this.apiEnrolled + '/video/'+ lectureId, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getEnrolDocument(lectureId: number): Observable<any> {
        return this.httpCilent.get(this.apiEnrolled + '/document/' + lectureId, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    countLectureByCourseId(courseId: number): Observable<any> {
        return this.httpCilent.get<any>(this.publicApi + '/count/' + courseId);
    }

    countManagerLectureByCourseId(courseId: number): Observable<any> {
        return this.httpCilent.get<any>(this.managerApi + '/count/' + courseId, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    toggleActivation(lectureId: number): Observable<Lecture> {
        return this.httpCilent.patch<Lecture>(this.managerApi + '/' + lectureId + '/toggle-activation', {}, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    approve(lectureId:number, approvalReq: ApprovalReq): Observable<Lecture> {
        return this.httpCilent.post<Lecture>(this.managerApi + '/' + lectureId + '/approval', approvalReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteByReport(reportId: number, actionReq: ActionReq): Observable<any> {
        return this.httpCilent.put(this.managerApi + '/report/' + reportId, actionReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    blockLecture(reportId: number): Observable<any> {
        return this.httpCilent.patch(this.managerApi + '/block/' + reportId, {}, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    deleteLecture(lectureId: number, actionReq: ActionReq): Observable<any> {
        return this.httpCilent.put(this.managerApi + '/delete/' + lectureId, actionReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }
    containsPendingApprovalLectures(courseId: number): Observable<boolean> {
        return this.httpCilent.get<boolean>(this.managerApi + '/pending-approval/' + courseId, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getLectureCountByStatus(courseId: number, status: string): Observable<number> {
        return this.httpCilent.get<any>(this.managerApi + '/count/' + courseId + '/' + status, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    rejectByReport(reportId: number, actionReq: ActionReq): Observable<any> {
        return this.httpCilent.put(this.managerApi + '/report/' + reportId + '/reject', actionReq, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getDocument(lectureId: number): Observable<HttpResponse<Blob>> {
        return this.httpCilent.get(environment.documentContentApi + lectureId, { responseType: 'blob', observe: 'response' })
    }

    getManagerVideoUrl(lectureId: number): Observable<any> {
        return this.httpCilent.get(this.managerApi + '/url-video/'+ lectureId, {headers: this.httpUtilsService.createRequiresTokenHeader(), responseType: 'text'});
    }

    getManagerDocumentUrl(lectureId: number): Observable<any> {
        return this.httpCilent.get(this.managerApi + '/url-document/'+ lectureId, {headers: this.httpUtilsService.createRequiresTokenHeader(), responseType: 'text'});
    }

    getEnrolVideoUrl(lectureId: number): Observable<any> {
        return this.httpCilent.get(this.apiEnrolled + '/url-video/'+ lectureId, {headers: this.httpUtilsService.createRequiresTokenHeader(), responseType: 'text'});
    }

    getEnrolDocumentUrl(lectureId: number): Observable<any> {
        return this.httpCilent.get(this.apiEnrolled + '/url-document/'+ lectureId, {headers: this.httpUtilsService.createRequiresTokenHeader(), responseType: 'text'});
    }

    swapOrderNumber(chapterId: number, lectureId: number, lectureId2: number): Observable<any> {

        return this.httpCilent.put(this.apiLectures + '/swap/' + chapterId + '/' + lectureId + '/' + lectureId2, null, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getLectureVideoDurationByStatus(courseId: number, status: string): Observable<number> {
        return this.httpCilent.get<any>(this.publicApi + '/video-duration/' + courseId + '/' + status);
    }

    getLectureVideoDuration(courseId: number): Observable<number> {
        return this.httpCilent.get<any>(this.managerApi + '/video-duration/' + courseId, {headers: this.httpUtilsService.createRequiresTokenHeader()});
    }

    getLearnerCompleteLecture(lectureQuery: LectureQuery): Observable<GetResponseLectureComplete> {
        lectureQuery.page = lectureQuery.page - 1;
        const httpOptions = {
            headers: this.httpUtilsService.createRequiresTokenHeader(),
            params: lectureQuery.queryParams
        };
        lectureQuery.page = lectureQuery.page + 1;
        return this.httpCilent.get<GetResponseLectureComplete>(this.managerApi + '/lecture-complete', httpOptions);
    }
}

interface GetResponse {
    content: Lecture[];
    totalPages: number;
    totalElements: number;
}

interface GetResponseLectureComplete {
    content: LearnerCompleteLectureRes[];
}