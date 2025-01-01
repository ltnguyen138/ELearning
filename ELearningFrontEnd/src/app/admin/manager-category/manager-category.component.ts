import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CategoryService} from "../../service/category.service";
import {Category} from "../../model/category";
import {CategoryQuery} from "../../dtos/category/category.query";
import {ConfirmationService} from "primeng/api";
import {DefaultConfirmationService} from "../../service/default-confirmation.service";

@Component({
  selector: 'app-manager-category',
  templateUrl: './manager-category.component.html',
  styleUrls: ['./manager-category.component.css']
})
export class ManagerCategoryComponent implements OnInit {

    categories: Category[] = [];
    categoryQuery = new CategoryQuery();
    totalPages: number = 0;
    visiblePages: number[] = [];
    keyword: string = '';
    activedFilter?: boolean;
    constructor(protected router: Router,
          private toastr: ToastrService,
          protected route: ActivatedRoute,
          private categoryService: CategoryService,
          private confirmService: ConfirmationService) {

        this.categoryQuery.size = 6;
    }

    ngOnInit(): void {

        this.route.queryParamMap.subscribe( params => {
            this.categoryQuery.page = +params.get('page')! || this.categoryQuery.page;
            this.categoryQuery.sort = params.get('sort') || this.categoryQuery.sort;
            this.categoryQuery.keyword = params.get('keyword') || undefined;
            this.getCategories();
        });
    }

    generatePageArray(): number[] {
        return Array.from({ length: 9 }, (_, i) => this.categoryQuery.page - 4 + i)
            .filter(num => num >= 1 && num <= this.totalPages);
    }

    getCategories() {
        this.categoryService.getManagerPage(this.categoryQuery).subscribe({
            next: data => {
                this.categories = data.content;
                this.totalPages = data.totalPages;
                this.visiblePages = this.generatePageArray();
            },
            error: err => {
                this.toastr.error('Lỗi: ' + "Không thể lấy danh sách chủ đề khóa học");
            }
        });
    }

    deleteCategory(categoryId: number) {
        this.categoryService.deleteCategory(categoryId).subscribe({
            next: data => {
                this.toastr.success('Xóa chủ đề thành công');
                this.getCategories();
            },
            error: err => {
                this.toastr.error('Lỗi: ' + "Không thể xóa chủ đề");
            }
        });
    }

    togelCategoryStatus(categoryId: number, index: number) {

        this.categoryService.toggleActivation(categoryId).subscribe({
            next: data => {
                this.toastr.success('Cập nhật trạng thái thành công');
                this.updateCategoryAtIndex(index, data);
            },
            error: err => {
                this.toastr.error('Lỗi: ' + "Không thể cập nhật trạng thái chủ đề");
            }
        });
    }

    confirmToggleActivation(categoryId: number, index: number) {

        this.confirmService.confirm({
            header: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn thay đổi trạng thái chủ đề này?',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            accept: () => {
                this.togelCategoryStatus(categoryId, index);
            }

        })
    }



    confirmDeleteCategory(categoryId: number) {
        this.confirmService.confirm({
            header: 'Xác nhận',
            message: 'Bạn có chắc chắn muốn xóa chủ đề này?',
            icon: "fa-solid fa-triangle-exclamation bg-red-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            acceptButtonStyleClass: 'bg-delete-btn text-white hover:delete-btn-h',
            accept: () => {
                this.deleteCategory(categoryId);
            }
        })
    }

    updateUrlParams() {
        debugger;
        this.router.navigate([], {
                relativeTo: this.route,
                queryParams: this.categoryQuery.queryParams,
            }
        )
    }
    pageChange(page: number) {
        this.categoryQuery.page = page;
        this.updateUrlParams();
    }

    updateCategoryAtIndex(index: number, category: Category) {
        if(index >= 0 && index < this.categories.length) {
            this.categories[index] = category;
        }else {
            this.toastr.error('Lỗi: ' + 'Không thể cập nhật danh mục');
        }
    }

    search() {
        this.categoryQuery.keyword = this.keyword;
        this.updateUrlParams();
    }
}
