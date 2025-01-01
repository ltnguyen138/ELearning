import { Component, OnInit } from '@angular/core';
import {Discount} from "../../model/discount";
import {DiscountQuery} from "../../dtos/discount/discount.query";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../service/course.service";
import {DiscountService} from "../../service/discount.service";
import {ConfirmationService} from "primeng/api";
import {ApprovalStatusEnum} from "../../enum/approval.status.enum";
import {DiscountTypeEnum} from "../../enum/discount.type.enum";

@Component({
  selector: 'app-manager-discount',
  templateUrl: './manager-discount.component.html',
  styleUrls: ['./manager-discount.component.css']
})
export class ManagerDiscountComponent implements OnInit {

    discounts: Discount[] = [];
    discountQuery = new DiscountQuery();
    totalPages = 0;
    visiblePages: number[] = [];
    keyword: string = '';
    discountTypeFilter: string = '';
    activatedFilter?: boolean;
    sortBy: string = 'createdTime,desc';
    constructor(protected route: ActivatedRoute,
                private toastr: ToastrService,
                private courseService: CourseService,
                protected router: Router,
                private discountService: DiscountService,
                private confirmService: ConfirmationService) {


    }

    ngOnInit(): void {
        this.discountQuery.size = 4;
        this.route.queryParamMap.subscribe(params => {
            this.discountQuery.page = +params.get('page')! || this.discountQuery.page;
            this.discountQuery.sort = params.get('sort') || this.discountQuery.sort;
            this.discountQuery.keyword = params.get('keyword') || undefined;
            this.discountQuery.activated = params.get('activated') === 'true' || params.get('activated') === 'false'
                ? params.get('activated') === 'true'
                : undefined;
            this.discountQuery.type = params.get('type') || undefined;
            this.activatedFilter = this.discountQuery.activated || undefined;
            this.discountTypeFilter = this.discountQuery.type || '';
            this.getDiscounts();
        });

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // Khi quay trở lại trang discount sau khi thêm/sửa
                if (event.urlAfterRedirects.includes(`/admin/discounts`)) {
                    this.getDiscounts(); // Gọi lại hàm để tải lại danh sách discounts
                }
            }
        });

    }

    getDiscounts(): void {
        this.discountService.getManagerPage(this.discountQuery).subscribe({
            next: data => {
                this.discounts = data.content;
                this.totalPages = data.totalPages;
                this.visiblePages = this.generatePageArray();
            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });
    }

    generatePageArray(): number[] {

        return Array.from({ length: 9 }, (_, i) => this.discountQuery.page - 4 + i)
            .filter(num => num >= 1 && num <= this.totalPages);
    }

    updateUrlParams() {
        this.router.navigate([], {
                relativeTo: this.route,
                queryParams: this.discountQuery.queryParams,
            }
        )
    }

    pageChange(page: number) {
        this.discountQuery.page = page;
        this.updateUrlParams();
    }

    search() {
        this.discountQuery.keyword = this.keyword;
        this.discountQuery.page = 1;
        this.updateUrlParams();
    }

    typeFilterChange() {
        this.discountQuery.type = this.discountTypeFilter;
        this.discountQuery.page = 1;
        this.updateUrlParams();
    }

    activatedFilterChange() {
        this.discountQuery.activated = this.activatedFilter;
        this.discountQuery.page = 1;
        this.updateUrlParams();
    }

    sortChange() {
        this.discountQuery.sort = this.sortBy;
        this.discountQuery.page = 1;
        this.updateUrlParams();
    }

    clearFilter() {
        this.keyword = '';
        this.discountTypeFilter = '';
        this.activatedFilter = undefined;
        this.discountQuery.type = undefined;
        this.discountQuery.activated = undefined;
        this.discountQuery.keyword = undefined;
        this.discountQuery.page = 1;
        this.updateUrlParams();
    }

    redirectToAddDiscountForm(): void {
        const queryParams = this.route.snapshot.queryParams;
        this.router.navigate(['admin/discounts/add'], { queryParams });
    }

    redirectToEditDiscountForm(discountId: number): void {
        const queryParams = this.route.snapshot.queryParams;
        this.router.navigate(['admin/discounts/edit/'+discountId], { queryParams });
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

    protected readonly ApprovalStatusEnum = ApprovalStatusEnum;
    protected readonly DiscountTypeEnum = DiscountTypeEnum;
}
