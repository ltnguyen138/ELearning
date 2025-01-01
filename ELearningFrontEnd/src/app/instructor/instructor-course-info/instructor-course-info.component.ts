import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CategoryService} from "../../service/category.service";
import {CourseService} from "../../service/course.service";
import {Course} from "../../model/course";
import {Category} from "../../model/category";
import { CategoryQuery } from 'src/app/dtos/category/category.query';
import {CourseReq} from "../../dtos/course/course.req";
import {CourseLevelEnum} from "../../enum/course.level.enum";
import {RoleEnum} from "../../enum/role.enum";
import {environment} from "../../environment";
import {ConfirmationService} from "primeng/api";
import {LectureService} from "../../service/lecture.service";
import {ApprovalStatusEnum, getApprovalStatusEnum} from 'src/app/enum/approval.status.enum';
import {ChapterService} from "../../service/chapter.service";

@Component({
  selector: 'app-instructor-course-info',
  templateUrl: './instructor-course-info.component.html',
  styleUrls: ['./instructor-course-info.component.css']
})
export class InstructorCourseInfoComponent implements OnInit {

    mode: string = 'add';
    courseId?: number
    currentCourse: Course | null =null;
    courseForm !: FormGroup;
    categories: Category[] = [];
    categoryQuery = new CategoryQuery();
    skillLevels = Object.entries(CourseLevelEnum).map(([key, value]) => ({
        key,
        value
    }));
    courseImageApi = environment.apiGetImageCourse;
    courseImageUrl = environment.apiGetImageCourse + this.currentCourse?.image;
    isUpdateImage: boolean = false;
    courseImage: File | null = null;
    countPendingLecture: number = 0;
    countApprovedLecture: number = 0;
    countLecture: number = 0;

    seletedCategory: Category | null = null;
    suggestionCategories: Category[] = [];
    isOtherCategory: boolean = false;
    otherCategory?: Category
    constructor(private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private courseService: CourseService,
                protected router: Router,
                private categoryService: CategoryService,
                private confirmationService: ConfirmationService,
                private lectureService: LectureService,
                private chapterService: ChapterService,) {

        this.courseForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            skillLevel: ['', Validators.required],
            price: ['', Validators.required],
            categoryId: ['', Validators.required],
            categoryName: ['']
        });

    }

    ngOnInit(): void {
        console.log(this.router.url);
        this.getCategories();
        this.route.parent?.paramMap.subscribe(paramMap => {
            if (paramMap.has('id')) {
                this.mode = 'edit';
                this.courseId = +paramMap.get('id')!; // Lấy id từ parent

                this.courseService.getInstructorCourse(this.courseId).subscribe({
                    next: data => {
                        this.currentCourse = data;
                        this.courseImageUrl = this.courseImageApi + this.currentCourse?.image;
                        this.initCourseForm();
                        this.countPendingLectures(this.courseId!);
                        this.countApprovedLectures(this.courseId!);
                        this.countLectures(this.courseId!);
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                        this.router.navigate(['/instructor/courses']);
                    }
                });
            }
        });
    }

    initCourseForm(){

        if(this.currentCourse!.category.temporary) {
            this.isOtherCategory = true;
            this.otherCategory = this.currentCourse!.category;
        }
        this.courseForm = this.fb.group({
            name: [this.currentCourse?.name, Validators.required],
            description: [this.currentCourse?.description, Validators.required],
            skillLevel: [this.currentCourse?.skillLevel, Validators.required],
            price: [this.currentCourse?.price, Validators.required],
            categoryId: [this.otherCategory ? {id: -1, name: 'Khác', alias: 'other', activated: false, temporary: true} : this.currentCourse?.category, Validators.required],
            categoryName: [this.currentCourse?.category.name]
        });
    }

    getCategories(){
        this.categoryQuery.size = 1000;
        this.categoryService.getPublicPage(this.categoryQuery).subscribe({
            next: data => {
                this.categories = data.content;
                this.suggestionCategories = this.categories;
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });
    }

    saveCourse() {
        if (this.courseForm.invalid) {
            this.toastr.error('Dữ liệu không hợp lệ');
            return;
        }
        let data: CourseReq = {

            ...this.courseForm.value,
            categoryId: this.courseForm.value.categoryId.id,
        }

        if (this.mode === 'add') {
            this.courseService.createCourse(data).subscribe({
                next: data => {
                    this.toastr.success('Tạo khóa học thành công');
                    this.router.navigate(['/instructor/courses']);
                },
                error: err => {
                    this.toastr.error('Lỗi: ' + err.error.message);
                }
            });
        } else {
            if(this.courseForm.value.categoryId.id == -1 && this.otherCategory) {
                data.categoryId = this.otherCategory?.id!;
            }
            this.courseService.updateCourse(data, this.currentCourse!.id).subscribe({
                next: data => {
                    this.toastr.success('Cập nhật khóa học thành công');
                    this.currentCourse = data;
                    if(this.currentCourse!.category.temporary) {

                        this.isOtherCategory = true;
                        this.otherCategory = this.currentCourse!.category;
                        this.initCourseForm();
                    } else {

                        this.seletedCategory = this.currentCourse!.category;

                        this.otherCategory = undefined;
                        this.isOtherCategory = false;
                        this.initCourseForm();
                    }
                },
                error: err => {
                    this.toastr.error('Lỗi: ' + err.error.message);
                }
            });
        }
    }

    isImageFile(file: File): boolean {
        // Kiểm tra loại tệp
        const fileType = file.type;
        // Kiểm tra phần mở rộng của tệp
        const validExtensions = ['image/jpeg', 'image/png', 'image/gif']; // Các loại phần mở rộng hình ảnh hỗ trợ
        return validExtensions.includes(fileType);
    }

    onUploadImg($event: Event) {

        const file = ($event.target as HTMLInputElement).files![0];
        if(file && this.isImageFile(file)){
            this.courseImage = file;
            this.courseImageUrl = URL.createObjectURL(this.courseImage);
            this.isUpdateImage = true;
        }else {
            this.toastr.error('Vui lòng chọn file hình ảnh');
            ($event.target as HTMLInputElement).value = '';
        }

    }

    saveCourseImage() {
        if(this.courseImage) {
            this.courseService.uploadImage(this.courseImage, this.currentCourse!.id).subscribe({
                next: data => {
                    this.toastr.success('Cập nhật ảnh khóa học thành công');
                    this.courseImageUrl = this.courseImageApi + data.image;
                    this.isUpdateImage = false;
                },
                error: error => {
                    this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');
                }
            });
        }
    }

    toggleModeration() {
        if(!this.currentCourse?.moderationRequested ) {
            if(this.countPendingLecture == 0) {
                this.toastr.error('Tất cả bài giảng đã được kiểm duyệt');
                return;
            }
        }

        this.confirmationService.confirm({
            message: this.currentCourse?.moderationRequested ? 'Bạn có chắc chắn muốn hủy yêu cầu kiểm duyệt khóa học này?' : 'Bạn có chắc chắn muốn yêu cầu kiểm duyệt khóa học này?',
            header: 'Xác nhận',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            accept: () => {
                this.courseService.toggleModeration(this.currentCourse!.id).subscribe({
                    next: data => {
                        this.currentCourse = data;

                        this.toastr.success(this.currentCourse?.moderationRequested ? 'Yêu cầu kiểm duyệt khóa học thành công' : 'Hủy yêu kiểm duyệt khóa học thành công');

                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            }
        });
    }

    countPendingLectures(courseId: number) {
        this.lectureService.getLectureCountByStatus(courseId, ApprovalStatusEnum.PENDING).subscribe({
            next: (count) => {
                this.countPendingLecture = count;
            },
            error: (err) => {
                this.toastr.error(err.error.message);
            }
        });
    }

    countApprovedLectures(courseId: number) {
        this.lectureService.getLectureCountByStatus(courseId, ApprovalStatusEnum.APPROVED).subscribe({
            next: (count) => {
                this.countApprovedLecture = count;
            },
            error: (err) => {
                this.toastr.error(err.error.message);
            }
        });
    }

    countLectures(courseId: number) {
        this.lectureService.countManagerLectureByCourseId(courseId).subscribe({
            next: (count) => {
                this.countLecture = count.totalLecture;
            },
            error: (err) => {
                this.toastr.error(err.error.message);
            }
        });
    }

    deleteCourse() {
        this.confirmationService.confirm({
            message: 'Bạn có chắc muốn xóa khóa học này?',
            header: 'Xác nhận',
            icon: "fa-solid fa-triangle-exclamation text-red-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            accept: () => {
                this.courseService.deleteByOwner(this.currentCourse!.id).subscribe({
                    next: () => {
                        this.toastr.success('Xóa khóa học thành công');
                        this.router.navigate(['/instructor/courses']);
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            }
        });
    }

    searchCategory(event: any) {

        this.suggestionCategories = this.categories.filter(category => category.name.toLowerCase().startsWith(event.query.toLowerCase()));
        if(this.currentCourse?.approvalStatus != ApprovalStatusEnum.APPROVED) {
            this.suggestionCategories.push({id: -1, name: 'Khác', alias: 'other', activated: false, temporary: true});
        }

    }

    selectCategory() {
        this.seletedCategory = this.courseForm.value.categoryId;

        if(this.seletedCategory?.id === -1) {
            this.isOtherCategory = true;
        } else {
            this.isOtherCategory = false;
        }
        console.log(this.courseForm.value.categoryId);
    }

    protected readonly getApprovalStatusEnum = getApprovalStatusEnum;
}
