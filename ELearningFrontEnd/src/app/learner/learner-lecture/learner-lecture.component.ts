import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {LectureService} from "../../service/lecture.service";
import { Lecture } from 'src/app/model/lecture';
import {animate, style, transition, trigger} from "@angular/animations";
import {environment} from "../../environment";
import {UserCourseService} from "../../service/user-course.service";

@Component({
  selector: 'app-learner-lecture',
  templateUrl: './learner-lecture.component.html',
  styleUrls: ['./learner-lecture.component.css'],

})
export class LearnerLectureComponent implements OnInit {

    @Input() lecture!:Lecture;
    @Input() isEnrolled: boolean = false;
    @Input() learnLectureComplate: number[] = [];
    courseUrl = this.router.createUrlTree(['./'], { relativeTo: this.route }).toString();
    fragmentU: string | null = null;
    currentLectureId: number = 0;
    learnLectureComplateId: number = 0;
    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private lectureService: LectureService,
                private userCourseService: UserCourseService) { }


    ngOnInit(): void {
        // debugger;
        if(this.route.snapshot.url[0].path === 'learn'){
            this.isEnrolled = true;
            this.route.children[0].params.subscribe(params => {
                // debugger;
                this.currentLectureId = +params['id'];
            });
        }
        this.route.fragment.subscribe(fragment => {
            this.fragmentU = fragment;

        })

        this.userCourseService.learnComleteLecture$.subscribe((data) => {
            if(data  && data != 0){
                this.learnLectureComplate.push(data);
            }
        });
        console.log('Lecture:', this.learnLectureComplate);
    }

    navigatorLinkConten(){

        this.router.navigate([this.courseUrl, this.lecture.id], {relativeTo: this.route, fragment: this.fragmentU ? this.fragmentU : 'overview'});
    }

    downloadDocument(lectureId: number | null) {
        if (!lectureId) {
            this.toastr.error('Lecture not found');
            return;
        }
        this.lectureService.getDocument(lectureId).subscribe(response => {
            const blob = response.body!;
            const contentType = response.headers.get('Content-Type');

            // Xác định extension từ MIME type
            let extension = '';
            switch (contentType) {
                case 'application/pdf':
                    extension = 'pdf';
                    break;
                case 'text/plain':
                    extension = 'txt';
                    break;
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    extension = 'docx';
                    break;
                // Thêm các loại định dạng khác nếu cần
                default:
                    extension = '';  // Nếu không biết định dạng, có thể để trống
            }

            // Tạo URL và tải về file với extension tương ứng
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `lecture-${lectureId}-document.${extension}`;
            a.click();
            window.URL.revokeObjectURL(url);  // Giải phóng URL sau khi sử dụng
        });
    }

    downloadS3Doc(lectureId: number | null) {
        if (!lectureId) {
            this.toastr.error('Lecture not found');
            return;
        }
        this.lectureService.getEnrolDocumentUrl(lectureId).subscribe({
            next: (data) => {
                const a = document.createElement('a');

                // Gán URL từ dữ liệu S3 trả về
                a.href = data;

                // Thuộc tính download sẽ cho phép trình duyệt tải xuống tệp
                a.download = `lecture-${lectureId}-document`;

                // Bắt buộc trình duyệt thực hiện nhấp chuột ảo để tải tệp xuống
                a.click();

                // Loại bỏ phần tử <a> sau khi tải xuống
                a.remove();
            },
            error: (err) => {
                this.toastr.error(err.error.message);
            }
        });

    }

    viewS3Doc(lectureId: number | null) {
        if (!lectureId) {
            this.toastr.error('Lecture not found');
            return;
        }
        this.lectureService.getEnrolDocumentUrl(lectureId).subscribe({
            next: (data) => {
                window.open(data, '_blank');
            },
            error: (err) => {
                this.toastr.error(err.error.message);
            }
        });
    }


    previewLecture(){

        this.router.navigate([this.courseUrl, this.lecture.id], {relativeTo: this.route});
    }

    isLectureComplete(){

        if(this.lecture != null){
            // @ts-ignore
            return this.learnLectureComplate.includes(this.lecture.id);
        }
        return false;
    }

    checkLectureComplete(){
        if(this.lecture != null){
            // @ts-ignore
            return this.learnLectureComplate.includes(this.lecture.id);
        }
        return false;
    }

    protected readonly navigator = navigator;
    protected readonly environment = environment;
}
