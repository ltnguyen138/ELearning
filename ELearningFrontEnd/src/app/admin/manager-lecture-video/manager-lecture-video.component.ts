import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import { environment } from 'src/app/environment';

@Component({
  selector: 'app-manager-lecture-video',
  templateUrl: './manager-lecture-video.component.html',
  styleUrls: ['./manager-lecture-video.component.css']
})
export class ManagerLectureVideoComponent implements OnInit {

    lectureId: number = 0;
    @ViewChild('videoPlayer') videoPlayer!: ElementRef;
    videoUrl: string = '';
    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private authService: AuthService,
                private userService: UserService,
                private tokenService: TokenService,
                private categoryService: CategoryService,
                private courseService: CourseService,
                private chapterService: ChapterService,
                private lectureService: LectureService,
                private cartService: CartService) {
    }

    ngOnInit(): void {

        this.route.paramMap.subscribe(paramMap => {
            if (paramMap.has('lectureId')) {
                console.log(paramMap.get('lectureId'));
                this.lectureId = Number(paramMap.get('lectureId'));
                // Thực hiện hành động khi lectureId thay đổi
                this.loadVideo();
            } else {

            }
        });
    }



    loadVideo(): void {
        // if(this.videoPlayer.nativeElement){
        //     const videoElement = this.videoPlayer.nativeElement;
        //     videoElement.src = this.getVideoContentUrl();
        //     videoElement.load();  // Tải lại video khi src thay đổi
        // }



            this.getVideoContentS3Url().subscribe({
                next: (data) => {
                    this.videoUrl = data;
                    const videoElement = this.videoPlayer.nativeElement;
                    videoElement.src = data;
                    videoElement.load();  // Tải lại video khi src thay đổi
                },
                error: (err) => {
                    console.log(err);
                }
            });



    }

    getVideoContentS3Url() {

        return this.lectureService.getManagerVideoUrl(this.lectureId).pipe()

    }

    disableContextMenu(event: MouseEvent): void {
        event.preventDefault(); // Ngăn chặn menu ngữ cảnh
    }

    protected readonly environment = environment;
}
