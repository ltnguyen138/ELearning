import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {UserService} from "../../service/user.service";
import {TokenService} from "../../service/token.service";
import {CategoryService} from "../../service/category.service";
import {CourseService} from "../../service/course.service";
import {ChapterService} from "../../service/chapter.service";
import {LectureService} from "../../service/lecture.service";
import {CartService} from "../../service/cart.service";
import {environment} from "../../environment";
import {UserCourseService} from "../../service/user-course.service";
import { NoteService } from 'src/app/service/note.service';

@Component({
  selector: 'app-learn-course-content',
  templateUrl: './learn-course-content.component.html',
  styleUrls: ['./learn-course-content.component.css']
})
export class LearnCourseContentComponent implements OnInit, AfterViewInit {

    alias: string = '';
    lectureId: number = 0;
    @ViewChild('videoPlayer') videoPlayer!: ElementRef;
    @Input() lectureIdInput?: number;
    videoUrl: string = '';
    islearnComplete: boolean = false;
    currenTime: number = -1;
    noteLectureId: number = 0;
    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private lectureService: LectureService,
                private userCourseService: UserCourseService,
                private toastr: ToastrService,
                private noteService: NoteService) {
    }

    ngOnInit(): void {

        this.alias = this.route.parent?.snapshot.paramMap.get('alias') || '';
        console.log('Alias:', this.alias);
        if(this.lectureIdInput && this.lectureIdInput != 0){
            this.lectureId = this.lectureIdInput;
            this.loadVideo();

        }else {
            this.route.paramMap.subscribe(paramMap => {
                if (paramMap.has('id')) {

                    this.lectureId = Number(paramMap.get('id'));
                    // Thực hiện hành động khi lectureId thay đổi
                    this.loadVideo();
                    this.islearnComplete = false;
                } else {
                    this.router.navigateByUrl('/');
                }
            });
        }

        this.noteService.updateCurrentLecture$.subscribe({
            next: (data) => {
                debugger
                this.currenTime = data;
                if(this.noteLectureId == 0){
                    this.noteLectureId = this.lectureId;
                }
                if(this.videoPlayer && this.videoPlayer.nativeElement && this.noteLectureId == this.lectureId){

                    const videoElement = this.videoPlayer.nativeElement;
                    if(this.currenTime < 0){
                        return;
                    }
                    videoElement.currentTime = data;
                    this.currenTime = -1;
                    this.noteLectureId = this.lectureId;
                }

            }
        });

        // this.lectureService.getManagerVideoUrl(this.lectureId).subscribe({
        //     next: (data) => {
        //         this.videoUrl = data;
        //     },
        //     error: (err) => {
        //         this.toastr.error(err.error.message);
        //     }
        // });

    }

    ngAfterViewInit(): void {
        // Đảm bảo rằng phần tử video đã được render trước khi gọi loadVideo()
        if (this.lectureId) {
            this.loadVideo();
        }
        if(this.currenTime > 0) {
            const videoElement = this.videoPlayer.nativeElement;
            videoElement.currentTime = this.currenTime;
            this.currenTime = -1;
        }

    }

    getVideoContentUrl(): string {

        return environment.videoContentApi + this.lectureId;

    }

    loadVideo(): void {

        if(this.videoPlayer && this.videoPlayer.nativeElement){
            const videoElement = this.videoPlayer.nativeElement;
            this.getVideoContentS3Url().subscribe({
                next: (data) => {
                    debugger
                    videoElement.src = data;
                    if(this.currenTime >= 0){
                        videoElement.currentTime = this.currenTime;
                        this.currenTime = -1;
                        this.noteLectureId = this.lectureId;
                    }
                    videoElement.load();  // Tải lại video khi src thay đổi
                },
                error: (err) => {
                    console.log(err);
                }
            });

            // videoElement.src = this.getVideoContentUrl();
            // videoElement.load();  // Tải lại video khi src thay đổi
        }

    }

    getVideoContentS3Url() {

        return this.lectureService.getEnrolVideoUrl(this.lectureId).pipe()

    }

    onTimeUpdate(){
        const videoElement = this.videoPlayer.nativeElement;
        const currentTime = videoElement.currentTime;
        this.noteService.onUpdateDuration(currentTime);
        if(this.islearnComplete){
            return;
        }


        const duration = videoElement.duration;
        const timeRemaining = duration - currentTime;
        console.log('currentTime: ', currentTime);
        console.log('duration: ', duration);
        console.log('timeRemaining: ', timeRemaining);
        if(timeRemaining < 10){
            this.learnComplete();
        }


    }

    learnComplete(){

        if(this.alias == '' || this.lectureId == 0){
            return;
        }
        this.userCourseService.updateCompletedLectures(this.alias, this.lectureId).subscribe({
            next: data => {
                this.islearnComplete = true;
                this.userCourseService.opLoadLearnCompleteLecture(this.lectureId);
                this.toastr.success('Bài học đã hoàn thành');
                console.log('Learn complete: ', data);
            },
            error: err => {
                console.log('Error: ', err);
            }
        });
    }


    protected readonly environment = environment;
}
