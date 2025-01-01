import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../service/course.service";
import {Course} from "../../model/course";
import {CourseLevelEnum} from "../../enum/course.level.enum";
import {LectureService} from "../../service/lecture.service";
import {environment} from "../../environment";
import {ApprovalStatusEnum, getApprovalStatusEnum} from "../../enum/approval.status.enum";
import {ApprovalReq} from "../../dtos/approval/approval.req";
import { ConfirmationService } from 'primeng/api';
import {ActionReq} from "../../dtos/action/action.req";
import {User} from "../../model/user";
import { AuthService } from 'src/app/service/auth.service';
import { CategoryService } from 'src/app/service/category.service';
import {CategoryQuery} from "../../dtos/category/category.query";
import {Category} from "../../model/category";
import {CourseReq} from "../../dtos/course/course.req";

@Component({
  selector: 'app-manager-course-info',
  templateUrl: './manager-course-info.component.html',
  styleUrls: ['./manager-course-info.component.css']
})
export class ManagerCourseInfoComponent implements OnInit {

    currentCourse !:Course;
    countPendingLecture: number = 0;
    countApprovedLecture: number = 0;
    countLecture: number = 0;
    approvalForm!: FormGroup;
    deleteForm!: FormGroup;
    reason: string = '';
    isOpenRejectModal: boolean = false;
    isOpenDeleteModal: boolean = false;
    loggedUser?: User | null =this.authService.getUserFromLocalStorage()
    categoryQuery = new CategoryQuery();
    seletedCategory: Category | null = null;
    suggestionCategories: Category[] = [];
    isOtherCategory: boolean = false;
    otherCategory?: Category
    categories: Category[] = [];
    isOpenChangeCategoryModal: boolean = false;
    categoryName: string = '';
    constructor(private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private courseService: CourseService,
                private categoryService: CategoryService,
                protected router: Router,
                private lectureService: LectureService,
                private confirmationService: ConfirmationService,
                private authService: AuthService) {
        this.approvalForm = this.fb.group({
            comment: ['']
        });
        this.deleteForm = this.fb.group({
            reason: ['']
        })
    }

    ngOnInit(): void {

        this.route.parent?.paramMap.subscribe(paramMap => {
            if (paramMap.has('id')) {
                this.getCourseById(+paramMap.get('id')!);
                this.countPendingLectures(+paramMap.get('id')!);
                this.countApprovedLectures(+paramMap.get('id')!);
                this.countLectures(+paramMap.get('id')!);
            }

        });
        this.getCategories();
    }

    getCourseById(id: number) {
        this.courseService.getManagerCourse(id).subscribe({
            next: (course) => {
                this.currentCourse = course;
                if(this.currentCourse!.category.temporary) {
                    this.isOtherCategory = true;
                    this.otherCategory = this.currentCourse!.category;
                    this.seletedCategory = {id: -1, name: 'Khác', alias: 'other', activated: false, temporary: true};
                    this.categoryName = this.currentCourse!.category.name;
                } else {
                    this.seletedCategory = this.currentCourse!.category;
                    this.categoryName = this.currentCourse!.category.name;
                }

            },
            error: (err) => {
                this.toastr.error(err.error.message);
            }
        });

    }

    getSkillLevel(skillLevel: string): string {

        return CourseLevelEnum[skillLevel as keyof typeof CourseLevelEnum] || 'Unknown';
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

    rejectCourse() {

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
                this.courseService.approval(this.currentCourse.id, data).subscribe({
                    next: (res) => {
                        this.currentCourse = res;
                        this.toastr.success('Từ chối duyệt khóa học thành công');
                    },
                    error: (err) => {
                        this.toastr.error(err.error.message);
                    }
                });
            }
        });


    }

    approveCourse() {

        if(this.countPendingLecture > 0) {
            this.toastr.error('Vui lòng duyệt tất cả bài giảng trước khi duyệt khóa học');
            return;
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
                this.courseService.approval(this.currentCourse.id, data).subscribe({
                    next: (res) => {
                        this.toastr.success('Duyệt khóa học thành công');
                        this.currentCourse = res;
                    },
                    error: (err) => {
                        this.toastr.error(err.error.message);
                    }
                });
            }
        });
    }

    deleteCourse() {
        const actionReq: ActionReq = {
            ...this.deleteForm.value
        }
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn xóa khóa học này?',
            header: 'Xác nhận',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            accept: () => {
                this.courseService.deleteCourse(this.currentCourse.id, actionReq).subscribe({
                    next: () => {
                        this.toastr.success('Xóa khóa học thành công');
                        this.router.navigate(['/admin/courses']);
                    },
                    error: (err) => {
                        this.toastr.error(err.error.message);
                    }
                });
            }
        });
    }

    approveTemporary() {
        this.confirmationService.confirm({
            message: 'Bạn có chắc chắn muốn duyệt chủ đề khóa học này?',
            header: 'Xác nhận',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            accept: () => {
                this.categoryService.approveTemporary(this.currentCourse.category.id).subscribe({
                    next: (res) => {
                        this.currentCourse.category = res;
                        this.toastr.success('Duyệt chủ đề khóa học thành công');
                    },
                    error: (err) => {
                        this.toastr.error(err.error.message);

                    }
                });
            }
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

    searchCategory(event: any) {

        this.suggestionCategories = this.categories.filter(category => category.name.toLowerCase().startsWith(event.query.toLowerCase()));
        this.suggestionCategories.push({id: -1, name: 'Khác', alias: 'other', activated: false, temporary: true});
    }

    selectCategory() {


        if(this.seletedCategory?.id === -1) {
            this.isOtherCategory = true;
        } else {
            this.isOtherCategory = false;
        }

    }

    updateCategoryCourse() {


        let data: CourseReq = {
            name: this.currentCourse!.name,
            description: this.currentCourse!.description,
            skillLevel: this.currentCourse!.skillLevel,

            price: this.currentCourse!.price,
            categoryId: this.seletedCategory!.id,
            instructorId: this.currentCourse!.instructor.id,
            categoryName: this.categoryName,

        }

        if(this.seletedCategory?.id == -1 && this.otherCategory) {
            data.categoryId = this.otherCategory?.id!;
        }
        this.courseService.updateCourse(data, this.currentCourse!.id).subscribe({
            next: data => {
                this.toastr.success('Cập nhật khóa học thành công');
                this.currentCourse = data;
                this.isOpenChangeCategoryModal = false;
                if(this.currentCourse!.category.temporary) {
                    this.isOtherCategory = true;
                    this.otherCategory = this.currentCourse!.category;
                    this.seletedCategory = {id: -1, name: 'Khác', alias: 'other', activated: false, temporary: true};
                    this.categoryName = this.currentCourse!.category.name;
                } else {
                    this.seletedCategory = this.currentCourse!.category;
                    this.categoryName = '';
                    this.otherCategory = undefined;

                }
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });

    }

    protected readonly environment = environment;
    protected readonly ApprovalStatusEnum = ApprovalStatusEnum;
    protected readonly getApprovalStatusEnum = getApprovalStatusEnum;
}
