import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {LectureService} from "../../service/lecture.service";
import { environment } from 'src/app/environment';

@Component({
  selector: 'app-instructor-preview-lectures',
  templateUrl: './instructor-preview-lectures.component.html',
  styleUrls: ['./instructor-preview-lectures.component.css']
})
export class InstructorPreviewLecturesComponent implements OnInit, AfterViewInit{

    lectureId: number = 0;
    @ViewChild('videoPlayer') videoPlayer!: ElementRef;
    @Input() lectureIdInput?: number;
    videoUrl: string = '';
    alias: string | null = null;
    idParam: string | null | undefined = null;

    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private lectureService: LectureService) {
    }

    ngOnInit(): void {

        if(this.lectureIdInput && this.lectureIdInput != 0){
            this.lectureId = this.lectureIdInput;
            this.loadVideo();

        }else {
            this.route.paramMap.subscribe(paramMap => {
                if (paramMap.has('lectureId')) {
                    debugger;
                    this.lectureId = Number(paramMap.get('lectureId'));
                    // Thực hiện hành động khi lectureId thay đổi
                    this.loadVideo();
                } else {
                    this.router.navigateByUrl('/');
                }
            });
        }

        this.idParam = this.route.parent?.parent?.snapshot.paramMap.get('id');
        console.log('idParam', this.idParam);
        // this.lectureService.getManagerVideoUrl(this.lectureId).subscribe({
        //     next: (data) => {
        //         this.videoUrl = data;
        //     },
        //     error: (err) => {
        //         this.toastr.error(err.error.message);
        //     }
        // });

    }
    navigateBack() {
        if (this.idParam) {
            this.router.navigate(['/instructor/courses/detail/'+this.idParam +'/content']);
        }
    }

    ngAfterViewInit(): void {
        // Đảm bảo rằng phần tử video đã được render trước khi gọi loadVideo()
        if (this.lectureId) {
            this.loadVideo();
        }
    }

    getVideoContentUrl(): string {

        return environment.videoContentApi + this.lectureId;

    }

    loadVideo(): void {
        debugger;
        if(this.videoPlayer.nativeElement){
            const videoElement = this.videoPlayer.nativeElement;
            this.getVideoContentS3Url().subscribe({
                next: (data) => {
                    videoElement.src = data;
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

        return this.lectureService.getManagerVideoUrl(this.lectureId).pipe()

    }

    protected readonly environment = environment;
}
