import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/service/category.service';
import {Category} from "../../model/category";
import {CategoryReq} from "../../dtos/category/category.req";

@Component({
  selector: 'app-manager-category-form',
  templateUrl: './manager-category-form.component.html',
  styleUrls: ['./manager-category-form.component.css']
})
export class ManagerCategoryFormComponent implements OnInit {

    mode: string = 'add';
    categoryId?: number
    categoryForm !: FormGroup;
    currentCategory: Category | null = null;

    constructor(private fb:FormBuilder,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private categoryService: CategoryService,
                protected router: Router
                ) {
        this.categoryForm = this.fb.group({
            name: ['', [Validators.required]],
            activated: [true]
        });

    }

    ngOnInit(): void {

        if(this.router.url.startsWith('/admin/categories/edit') && this.route.snapshot.paramMap.has('id')){
            this.mode = 'edit';
            this.categoryId = +this.route.snapshot.paramMap.get('id')!;
            this.categoryService.getCategory(this.categoryId).subscribe({
                next: data => {
                    this.currentCategory = data;
                    this.initCategoryForm();
                },
                error: err => {
                    this.toastr.error('Lỗi' + err.error.message);
                    this.router.navigate(['/admin/categories']);
                }
            });
        }
    }

    initCategoryForm(){

        this.categoryForm = this.fb.group({
            name: [this.currentCategory?.name, Validators.required],
            activated: [this.currentCategory?.activated],
        });
    }

    saveCategory() {
        if(this.categoryForm.invalid) {
            this.toastr.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        const categoryReq: CategoryReq = {
            ...this.categoryForm.value
        }
        if (this.mode === 'add') {
            this.categoryService.createCategory(categoryReq).subscribe({
                next: data => {
                    this.toastr.success('Thêm chủ đề thành công');
                    this.router.navigate(['/admin/categories']);
                },
                error: err => {
                    this.toastr.error('Lỗi: ' + err.error.message);
                }
            });
        }
        if (this.mode === 'edit') {
            this.categoryService.updateCategory(categoryReq, this.categoryId!).subscribe({
                next: data => {
                    this.toastr.success('Cập nhật chủ đề thành công');
                },
                error: err => {
                    this.toastr.error('Lỗi: ' + err.error.message);
                }
            });
        }
    }
}
