import {Component, OnInit} from '@angular/core';
import {Order} from "../../model/order/order";
import {OrderDetail} from "../../model/order/order.detail";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {OrderService} from "../../service/order.service";
import {AuthService} from "../../service/auth.service";
import {ConfirmationService} from "primeng/api";
import {OrderStatusEnum} from "../../enum/order.status.enum";
import { environment } from 'src/app/environment';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit{

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

        this.orderService.getByIdForAdmin(id).subscribe({
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

    protected readonly environment = environment;


    protected readonly OrderStatusEnum = OrderStatusEnum;
}
