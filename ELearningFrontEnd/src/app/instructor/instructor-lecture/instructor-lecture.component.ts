import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Lecture} from "../../model/lecture";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../service/course.service";
import {ChapterService} from "../../service/chapter.service";
import {LectureService} from "../../service/lecture.service";
import {ConfirmationService} from "primeng/api";
import {animate, style, transition, trigger} from "@angular/animations";
import { HttpEventType } from '@angular/common/http';
import {ApprovalStatusEnum} from "../../enum/approval.status.enum";
import {Chapter} from "../../model/chapter";

@Component({
  selector: 'app-instructor-lecture',
  templateUrl: './instructor-lecture.component.html',
  styleUrls: ['./instructor-lecture.component.css'],
    animations: [
        trigger('slideToggle', [
            transition(':enter', [
                style({ height: '0', opacity: 0 }),
                animate('300ms ease-out', style({ height: '*', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('300ms ease-out', style({ height: '0', opacity: 0 }))
            ])
        ])
    ]
})
export class InstructorLectureComponent implements OnInit {

    @Input() lecture!: Lecture;
    @Input() index!: number;
    @Output() removeLecture = new EventEmitter<number>();
    @Output() newLecture = new EventEmitter<Lecture>();
    isOpenLectureForm: boolean = false;
    lectureForm !: FormGroup
    videoName?: string;
    documentName?: string;
    videoFile?: File;
    documentFile?: File;
    isUploadingVideo: boolean = false;
    isUploadingDocument: boolean = false
    isShowTable: boolean = false;
    uploadVideoProgress: number = 0;
    uploadDocumentProgress: number = 0;
    isLoaded: boolean = false;
    courseUrl = this.router.createUrlTree(['./'], { relativeTo: this.route }).toString();
    constructor(private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private courseService: CourseService,
                protected router: Router,
                private chapterService: ChapterService,
                private lectureService: LectureService,
                private confirmService: ConfirmationService) {

            this.lectureForm = this.fb.group({
                name: ['', [Validators.required]],
                preview: ['', [Validators.required]],
            });

    }
    ngOnInit(): void {
        console.log('Lecture:', this.courseUrl);
        if(this.lecture.id === null) {
            this.isOpenLectureForm = true;
        }else {
            this.videoName = this.lecture.videoUrl?.split('_').pop();
            console.log('VideoName:', this.videoName);
            this.documentName = this.lecture.resourceUrl?.split('_').pop();
        }
        this.uploadVideoProgress =  this.lecture.videoUrl ? 100 : 0;
        this.uploadDocumentProgress =  this.lecture.resourceUrl ? 100 : 0;
        this.lectureForm = this.fb.group({
            name: [this.lecture.name, [Validators.required]],
            preview: [this.lecture.preview, ],
        });
    }




    toggleLectureForm() {
        this.isOpenLectureForm = !this.isOpenLectureForm;
    }

    onRemoveLecture() {
        if(this.lecture.id === null) {
            this.removeLecture.emit(0);
            return;
        }
        this.confirmService.confirm({
            message: 'Bạn có chắc chắn muốn xóa bài giảng này không?',
            header: 'Xác nhận',
            icon: "fa-solid fa-triangle-exclamation text-red-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            acceptButtonStyleClass: 'bg-delete-btn text-white hover:delete-btn-h',
            accept: () => {
                this.lectureService.deleteByOwner(this.lecture.id!).subscribe({
                    next: () => {
                        this.toastr.success('Xóa bài giảng thành công');
                        this.removeLecture.emit(this.lecture.id!);
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            }
        });
    }

    saveLecture() {
        if(this.lectureForm.invalid) {
            this.toastr.error('Lỗi: Tên bài giảng không được để trống');
            return;
        }
        const data = {
            ...this.lectureForm.value,
            chapterId: this.lecture.chapter!.id
        }
        if(this.lecture.id === null) {
            this.lectureService.createLecture(data).subscribe({
                next: data => {
                    this.lecture = data;
                    this.toastr.success('Tạo bài giảng thành công');
                    this.isOpenLectureForm = false;
                    this.newLecture.emit(this.lecture);
                },
                error: err => {
                    this.toastr.error('Lỗi: ' + err.error.message);
                }
            });
        } else {
            this.lectureService.updateLecture(data, this.lecture.id!).subscribe({
                next: data => {
                    this.lecture = data;
                    this.toastr.success('Cập nhật bài giảng thành công');
                },
                error: err => {
                    this.toastr.error('Lỗi: ' + err.error.message);
                }
            });
        }
    }

    checkVideoFile(file: File): boolean {

        const fileType = file.type;
        const validExtensions = ['video/mp4', 'video/webm', 'video/ogg'];
        const validSize = 500 * 1024 * 1024;
        return validExtensions.includes(fileType) && file.size <= validSize;
    }

    checkDocumentFile(file: File): boolean {
        const fileType = file.type;
        const validExtensions = ['application/pdf', 'application/msword','text/plain' ];
        const validSize = 10 * 1024 * 1024;
        return validExtensions.includes(fileType) && file.size <= validSize;
    }

    onUploadVideo($event: Event) {

        const file = ($event.target as HTMLInputElement).files![0];
        if(file && this.checkVideoFile(file)){
            this.videoFile = file;
            this.videoName = file.name;
            this.isUploadingVideo = true;
        }else {
            this.toastr.error('Vui lòng chọn file đúng định dạng và có dung lượng nhỏ hơn 500MB');
            ($event.target as HTMLInputElement).value = '';
        }
    }

    onUploadDocument($event: Event) {

        const file = ($event.target as HTMLInputElement).files![0];
        if(file && this.checkDocumentFile(file)){
            this.documentFile = file;
            this.documentName = file.name;
            this.isUploadingDocument = true;
        }else {
            this.toastr.error('Vui lòng chọn file đúng định dạng và có dung lượng nhỏ hơn 10MB');
            ($event.target as HTMLInputElement).value = '';
        }
    }

    cancelUploadVideo() {
        this.videoFile = undefined
        this.videoName = this.lecture.videoUrl ? this.lecture.videoUrl.split('_').pop() : undefined;
        this.isUploadingVideo = false;
    }

    cancelUploadDocument() {
        this.documentFile = undefined;
        this.documentName = this.lecture.resourceUrl ? this.lecture.resourceUrl.split('_').pop() : undefined;
        this.isUploadingDocument = false;
    }

    saveVideo() {
        if (this.videoFile) {
            this.isUploadingVideo = true; // Đặt cờ để hiển thị trạng thái upload nếu cần
            this.isLoaded = true;
            // this.lectureService.uploadVideo(this.videoFile, this.lecture.id!).subscribe({
            //     next: event => {
            //         // Theo dõi tiến trình upload
            //         if (event.type === HttpEventType.UploadProgress) {
            //             if (event.total) {
            //                 const progress = Math.round(100 * event.loaded / event.total);
            //                 this.uploadVideoProgress = progress; // Cập nhật tiến trình để hiển thị
            //             }// Cập nhật tiến trình để hiển thị
            //         }
            //         // Nhận phản hồi khi upload hoàn thành
            //         else if (event.type === HttpEventType.Response) {
            //             this.toastr.success('Cập nhật video thành công');
            //             this.lecture.videoUrl = event.body!.videoUrl;
            //             this.videoName = event.body!.videoUrl!.split('_').pop();
            //             this.isUploadingVideo = false;
            //             this.uploadVideoProgress= 100; // Đặt lại tiến trình về 0 sau khi hoàn thành
            //         }
            //     },
            //     error: err => {
            //         this.toastr.error('Lỗi: ' + err.error.message);
            //         this.isUploadingVideo = false;
            //         this.uploadVideoProgress =  this.lecture.videoUrl ? 100 : 0;
            //         this.videoName = this.lecture.videoUrl ? this.lecture.videoUrl.split('_').pop() : undefined;
            //
            //     }
            // });

            this.lectureService.uploadS3Video(this.videoFile, this.lecture.id!).subscribe({
                next: event => {
                    if(event.type === HttpEventType.UploadProgress) {
                        if(event.total) {
                            const progress = Math.round(100 * event.loaded / event.total);
                            this.uploadVideoProgress = progress;
                        }
                    } else if(event.type === HttpEventType.Response) {
                        this.toastr.success('Cập nhật video thành công');
                        this.lecture.videoUrl = event.body!.videoUrl;
                        this.videoName = event.body!.videoUrl!.split('_').pop();
                        this.isUploadingVideo = false;
                        this.uploadVideoProgress = 100;
                        this.isLoaded = false;
                    }
                },
                error: err => {
                    this.toastr.error('Lỗi: ' + err.error.message);
                    this.isUploadingVideo = false;
                    this.uploadVideoProgress =  this.lecture.videoUrl ? 100 : 0;
                    this.videoName = this.lecture.videoUrl ? this.lecture.videoUrl.split('_').pop() : undefined;
                    this.isLoaded = false;
                }
            });

        }
    }

    saveDocument() {
        if(this.documentFile) {
            this.isUploadingDocument = true;
            this.isLoaded = true;
            // this.lectureService.uploadDocument(this.documentFile, this.lecture.id!).subscribe({
            //     next: event => {
            //         if(event.type === HttpEventType.UploadProgress) {
            //             if(event.total) {
            //                 const progress = Math.round(100 * event.loaded / event.total);
            //                 this.uploadDocumentProgress = progress;
            //             }
            //         } else if(event.type === HttpEventType.Response) {
            //             this.toastr.success('Cập nhật tài liệu thành công');
            //             this.lecture.resourceUrl = event.body!.resourceUrl;
            //             this.documentName = event.body!.resourceUrl!.split('_').pop();
            //             this.isUploadingDocument = false;
            //             this.uploadDocumentProgress = 100;
            //         }
            //     },
            //     error: err => {
            //         this.toastr.error('Lỗi: ' + err.error.message);
            //         this.isUploadingDocument = false;
            //         this.uploadDocumentProgress =  this.lecture.resourceUrl ? 100 : 0;
            //         this.documentName = this.lecture.resourceUrl ? this.lecture.resourceUrl.split('_').pop() : undefined;
            //     }
            // });

            this.lectureService.uploadS3Document(this.documentFile, this.lecture.id!).subscribe({
                next: event => {
                    if(event.type === HttpEventType.UploadProgress) {
                        if(event.total) {
                            const progress = Math.round(100 * event.loaded / event.total);
                            this.uploadDocumentProgress = progress;
                        }
                    } else if(event.type === HttpEventType.Response) {
                        this.toastr.success('Cập nhật tài liệu thành công');
                        this.lecture.resourceUrl = event.body!.resourceUrl;
                        this.documentName = event.body!.resourceUrl!.split('_').pop();
                        this.isUploadingDocument = false;
                        this.uploadDocumentProgress = 100;
                        this.isLoaded = false;
                    }
                },
                error: err => {
                    this.toastr.error('Lỗi: ' + err.error.message);
                    this.isUploadingDocument = false;
                    this.uploadDocumentProgress =  this.lecture.resourceUrl ? 100 : 0;
                    this.documentName = this.lecture.resourceUrl ? this.lecture.resourceUrl.split('_').pop() : undefined;
                    this.isLoaded = false;
                }
            });
        }
    }

    toggleDisplayTable() {
        this.isShowTable = !this.isShowTable;
    }

    previewLecture(){

        this.router.navigate([this.courseUrl, this.lecture.id], {relativeTo: this.route});
    }
    protected readonly ApprovalStatusEnum = ApprovalStatusEnum;
}
