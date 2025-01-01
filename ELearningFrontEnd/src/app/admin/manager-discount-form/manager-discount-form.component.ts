import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Discount} from "../../model/discount";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CourseService} from "../../service/course.service";
import {DiscountService} from "../../service/discount.service";
import {ConfirmationService} from "primeng/api";
import {DiscountReq} from "../../dtos/discount/discount.req";
import {DiscountTypeEnum} from "../../enum/discount.type.enum";

@Component({
  selector: 'app-manager-discount-form',
  templateUrl: './manager-discount-form.component.html',
  styleUrls: ['./manager-discount-form.component.css']
})
export class ManagerDiscountFormComponent implements OnInit {

    mode: string = 'add';
    discountId?: number
    discountForm !: FormGroup;
    currentDiscount: Discount | null = null;
    courseId: number = 0;

    constructor(protected route: ActivatedRoute,
                private toastr: ToastrService,
                private courseService: CourseService,
                protected router: Router,
                private discountService: DiscountService,
                private confirmService: ConfirmationService,
                private fb: FormBuilder) {

        this.discountForm = this.fb.group({
            code: ['', Validators.required],
            discount: ['', Validators.required],
            validFrom: ['', Validators.required],
            validTo: ['', Validators.required],
            quantity: [''],
            activated: [true]
        });

    }

    ngOnInit(): void {
        const idParam = this.route.parent?.parent?.snapshot.paramMap.get('id');
        this.courseId = idParam ? +idParam : 0;

        console.log(this.route.url);
        console.log(this.route.snapshot.paramMap.has('discountId'));
        if (this.route.snapshot.paramMap.has('discountId')) {
            this.mode = 'edit';
            this.discountId = +this.route.snapshot.paramMap.get('discountId')!;
            this.discountService.getById(this.discountId).subscribe({
                next: data => {
                    this.currentDiscount = data;
                    this.initDiscountForm();
                },
                error: err => {
                    this.toastr.error('Lỗi' + err.error.message);
                    this.router.navigate(['/instructor/discounts']);
                }
            });
        }
    }

    initDiscountForm() {

        this.discountForm = this.fb.group({
            code: [this.currentDiscount?.code, Validators.required],
            discount: [this.currentDiscount?.discount, Validators.required],
            validFrom: [this.currentDiscount?.validFrom, Validators.required],
            validTo: [this.currentDiscount?.validTo, Validators.required],
            quantity: [this.currentDiscount?.quantity],
            activated: [this.currentDiscount?.activated],
        });
    }


    onInputQuantityChange(event: any) {
        const quantity = event.target.value;
        this.discountForm.get('quantity')?.setValue(quantity == '' ? null : quantity);
    }

    saveDiscount() {

        if(this.discountForm.invalid){
            this.toastr.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        this.discountForm.get('validFrom')?.setValue(this.convertDate(this.discountForm.get('validFrom')?.value));
        this.discountForm.get('validTo')?.setValue(this.convertDate(this.discountForm.get('validTo')?.value));
        const discountReq: DiscountReq = {
            ...this.discountForm.value,
            type: DiscountTypeEnum.GLOBAL,
            courseId: this.courseId
        }

        if (this.mode === 'add') {
            this.discountService.createGlobalDiscount(discountReq).subscribe({
                next: data => {
                    this.toastr.success('Thêm mã giảm giá thành công');
                    this.redirectToDiscount();
                },
                error: err => {
                    this.toastr.error('Lỗi: ' + err.error.message);
                }
            });
        }
        if (this.mode === 'edit') {
            this.discountService.updateDiscount(discountReq, this.discountId!).subscribe({
                next: data => {
                    this.toastr.success('Cập nhật mã giảm giá thành công');
                    this.redirectToDiscount();
                },
                error: err => {
                    this.toastr.error('Lỗi: ' + err.error.message);
                }
            });
        }
    }

    redirectToDiscount() {
        const queryParams = this.route.snapshot.queryParams;
        this.router.navigate(['admin/discounts'], { queryParams });
    }

    convertDate(date: string): string {
        console.log(date);
        let newDate = new Date(date);
        console.log(newDate);
        console.log(newDate.getTime());
        if (isNaN(newDate.getTime())) {
            console.log('Invalid date');
            return date;
        }
        const day = ('0' + newDate.getDate()).slice(-2);   // Lấy ngày và thêm '0' nếu cần
        const month = ('0' + (newDate.getMonth() + 1)).slice(-2);  // Lấy tháng (tháng bắt đầu từ 0, nên cần cộng 1)
        const year = newDate.getFullYear();
        return `${day}-${month}-${year}`;


    }

    onDateValidFromChange(event: any) {
        const date = event.target.value;
        this.discountForm.get('validFrom')?.setValue(this.convertDate(date));
    }

    onDateValidToChange(event: any) {
        const date = event.target.value;
        this.discountForm.get('validTo')?.setValue(this.convertDate(date));
    }
}
