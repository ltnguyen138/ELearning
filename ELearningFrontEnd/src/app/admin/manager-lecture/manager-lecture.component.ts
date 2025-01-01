import {Component, Input, OnInit} from '@angular/core';
import {Lecture} from "../../model/lecture";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {LectureService} from "../../service/lecture.service";
import { ApprovalStatusEnum } from 'src/app/enum/approval.status.enum';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ApprovalReq} from "../../dtos/approval/approval.req";
import {ConfirmationService} from "primeng/api";
import {CourseService} from "../../service/course.service";

@Component({
  selector: 'app-manager-lecture',
  templateUrl: './manager-lecture.component.html',
  styleUrls: ['./manager-lecture.component.css']
})
export class ManagerLectureComponent implements OnInit {

    @Input() lecture!:Lecture;
    @Input() index:number = 0;
    ApprovalStatusEnum = ApprovalStatusEnum;
    courseUrl = this.router.createUrlTree(['./'], { relativeTo: this.route }).toString();
    approvalForm!: FormGroup;
    isOpenRejectModal: boolean = false;
    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private lectureService: LectureService,
                private fb:FormBuilder,
                private confirmationService: ConfirmationService,
                private courseService: CourseService,) {

        this.approvalForm = this.fb.group({
            comment: ['']
        });
    }

    ngOnInit(): void {
    }

    reject() {

        if(this.lecture.id == null) {
            this.toastr.error('Không tìm thấy bài giảng');
        }
        if(this.approvalForm.invalid) {
            this.toastr.error('Vui lòng điền lý do từ chối duyêt khóa học');
            return;
        }
        const data: ApprovalReq = {
            status: ApprovalStatusEnum.REJECTED,
            ...this.approvalForm.value
        };
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn từ chối duyệt khóa học này?',
            header: 'Xác nhận',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            accept: () => {
                // @ts-ignore
                this.lectureService.approve(this.lecture!.id, data).subscribe({
                    next: (res) => {
                        this.toastr.success('Từ chối duyệt khóa học thành công');
                        this.isOpenRejectModal = false;
                        this.lecture = res;
                    },
                    error: (err) => {
                        this.toastr.error(err.error.message);
                    }
                });
            }
        });


    }

    approval() {

        if(this.lecture.videoUrl == null && this.lecture.resourceUrl == null) {
            this.toastr.error('Không thế duyệt bài giảng không có video hoặc tài liệu');
            return;
        }
        if(this.lecture.id == null) {
            this.toastr.error('Không tìm thấy bài giảng');
        }

        const data: ApprovalReq = {
            status: ApprovalStatusEnum.APPROVED,
            comment: ''
        };

        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn duyệt khóa học này?',
            header: 'Xác nhận',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            accept: () => {
                // @ts-ignore
                this.lectureService.approve(this.lecture.id, data).subscribe({
                    next: (res) => {
                        this.toastr.success('Duyệt khóa học thành công');
                        this.lecture = res;
                    },
                    error: (err) => {
                        this.toastr.error(err.error.message);
                    }
                });
            }
        });
    }

    downloadS3Doc(lectureId: number | null) {
        if (!lectureId) {
            this.toastr.error('Lecture not found');
            return;
        }
        this.lectureService.getManagerDocumentUrl(lectureId).subscribe({
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

    navigatorLinkConten(){
        this.router.navigate([this.courseUrl, this.lecture.id], {relativeTo: this.route});
    }

}
