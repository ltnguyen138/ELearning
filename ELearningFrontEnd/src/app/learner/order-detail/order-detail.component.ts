import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CourseService} from "../../service/course.service";
import {DiscountService} from "../../service/discount.service";
import {CartService} from "../../service/cart.service";
import {OrderService} from "../../service/order.service";
import {AuthService} from "../../service/auth.service";
import { User } from 'src/app/model/user';
import {Order} from "../../model/order/order";
import {OrderStatusEnum} from "../../enum/order.status.enum";
import {environment} from "../../environment";
import {OrderDetail} from "../../model/order/order.detail";
import {RefundReq} from "../../dtos/order/refund.req";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit{

    loggedUser?: User | null =this.authService.getUserFromLocalStorage()
    order?: Order;
    reason = '';
    isCreateRefund = false;
    refundOrderDetail?: OrderDetail;
    isLoaded = false;
    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private orderService: OrderService,
                private authService: AuthService,
                private confirmService: ConfirmationService) {
    }

    ngOnInit(): void {

        if(this.route.snapshot.paramMap.has('id')) {
            this.getOrderById(+this.route.snapshot.paramMap.get('id')!);
        }else {
            this.toastr.error('Đơn hàng không tồn tại');
            this.router.navigate(['/home']);
        }
    }

    getOrderById(id: number) {

        this.orderService.getByIdForCustomer(id).subscribe({
            next: data => {
                this.order = data;
            },
            error: err => {
                this.toastr.error(err.error.message, 'Error');
            }
        });
    }

    getStatusValue(status: string) {

        return OrderStatusEnum[status as keyof typeof OrderStatusEnum] || 'Unknown';
    }

    refund(orderDetail: OrderDetail){

        const data: RefundReq = {
            courseId: orderDetail.course.id,
            discountAmount: orderDetail.discountPrice,
            discountId: orderDetail.discount ? orderDetail.discount.id : null,
            finalAmount: orderDetail.finalPrice,
            reason: this.reason,
            totalAmount: orderDetail.price,
            orderDetailId: orderDetail.id
        }

        this.confirmService.confirm({
            message: 'Bạn có chắc chắn yêu cầu hoàn tiền không?',
            header: 'Xác nhận',
            icon: "fa-solid fa-triangle-exclamation text-yellow-500",
            acceptLabel: 'Xác nhận',
            rejectLabel: 'Quay lại',
            rejectButtonStyleClass: 'bg-gray-100 text-text-color hover:bg-gray-200',
            accept: () => {
                this.isLoaded = true;
                this.orderService.refund(data).subscribe({
                    next: data => {
                        this.toastr.success('Yêu cầu hoàn tiền thành công');
                        this.getOrderById(this.order!.id);
                        this.closeRefundModal();
                        this.isLoaded = false
                    },
                    error: err => {
                        this.toastr.error(err.error.message, 'Error');
                    }
                });
            }
        });
    }

    openRefundModal(orderDetail: OrderDetail) {
        this.refundOrderDetail = orderDetail;
        this.isCreateRefund = true;
    }
    closeRefundModal() {
        this.isCreateRefund = false;
        this.refundOrderDetail = undefined;
    }

    protected readonly environment = environment;
}
