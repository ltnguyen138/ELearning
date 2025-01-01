import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../service/course.service";
import {DiscountService} from "../../service/discount.service";
import {Discount} from "../../model/discount";
import { DiscountQuery } from 'src/app/dtos/discount/discount.query';
import { Course } from 'src/app/model/course';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-instructor-discount',
  templateUrl: './instructor-discount.component.html',
  styleUrls: ['./instructor-discount.component.css']
})
export class InstructorDiscountComponent implements OnInit {

    discounts: Discount[] = [];
    discountQuery = new DiscountQuery();
    course!: Course;

    constructor(protected route: ActivatedRoute,
                private toastr: ToastrService,
                private courseService: CourseService,
                protected router: Router,
                private discountService: DiscountService,
                private confirmService: ConfirmationService) {


    }

    ngOnInit(): void {

        this.route.parent?.paramMap.subscribe(paramMap => {
            if (paramMap.has('id')) {
                this.courseService.getManagerCourse(+paramMap.get('id')!).subscribe({
                    next: data => {
                        this.course = data;
                        this.discountQuery.courseId = this.course.id;
                        this.getDiscounts();
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                        this.router.navigate(['/instructor/courses']);
                    }
                });
            }
        });

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // Khi quay trở lại trang discount sau khi thêm/sửa
                if (event.urlAfterRedirects.includes(`/instructor/courses/detail/${this.course.id}/discount`)) {
                    this.getDiscounts(); // Gọi lại hàm để tải lại danh sách discounts
                }
            }
        });
    }

    getDiscounts(): void {
        this.discountService.getManagerPage(this.discountQuery).subscribe({
            next: data => {
                this.discounts = data.content;;
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });
    }

    redirectToAddDiscountForm(): void {
        if(this.discounts.length >= 3){
            this.toastr.error('Số lượng discount đã đạt giới hạn tối đa (3)');
            return;
        }
        this.router.navigate([`/instructor/courses/detail/${this.course.id}/discount/add`]);
    }

    redirectToEditDiscountForm(discountId: number): void {
        this.router.navigate([`/instructor/courses/detail/${this.course.id}/discount/edit/${discountId}`]);
    }

    deleteDiscount(discountId: number): void {
        this.confirmService.confirm({
            header: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn xóa mã giảm giá này này?',
            icon: "fa-solid fa-triangle-exclamation text-red-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            acceptButtonStyleClass: 'bg-delete-btn text-white hover:delete-btn-h',
            accept: () => {
                this.discountService.deleteDiscount(discountId).subscribe({
                    next: () => {
                        this.toastr.success('Xóa discount thành công');
                        this.getDiscounts();
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            }
        });
    }

    toggleDiscount(discountId: number, index: number): void {
        this.confirmService.confirm({
            header: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn thay đổi trạng thái mã giảm giá này?',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            acceptButtonStyleClass: 'bg-delete-btn text-white hover:delete-btn-h',
            accept: () => {
                this.discountService.toggleDiscount(discountId).subscribe({
                    next: data => {
                        this.toastr.success('Thay đổi trạng thái discount thành công');
                        this.updateDiscountAtIndex(index, data);
                    },
                    error: err => {
                        this.toastr.error('Lỗi: ' + err.error.message);
                    }
                });
            }
        });

    }

    updateDiscountAtIndex(index: number, discount: Discount) {
        if(index < 0 || index >= this.discounts.length) return;
        this.discounts[index] = discount;
    }
}
