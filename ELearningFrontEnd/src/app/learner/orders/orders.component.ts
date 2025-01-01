import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormBuilder} from "@angular/forms";
import {CourseService} from "../../service/course.service";
import {DiscountService} from "../../service/discount.service";
import {CartService} from "../../service/cart.service";
import {OrderService} from "../../service/order.service";
import {AuthService} from "../../service/auth.service";
import {User} from "../../model/user";
import {Order} from "../../model/order/order";
import { OrderQuery } from 'src/app/dtos/order/order.query';
import {OrderStatusEnum} from "../../enum/order.status.enum";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

    loggedUser: User | null = null;
    orders: Order[] = [];
    orderQuery = new OrderQuery();
    totalPages: number = 0;
    visiblePages: number[] = [];
    keyword: string = '';
    orderStatus = Object.entries(OrderStatusEnum).map(([key, value]) => ({
        key,
        value
    }));
    orderStatusFilter = '';
    keywork = '';
    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private courseService: CourseService,
                private discountService: DiscountService,
                private cartService: CartService,
                private orderService: OrderService,
                private authService: AuthService) { }

    ngOnInit(): void {

        this.loggedUser = this.authService.getUserFromLocalStorage();
        this.route.queryParamMap.subscribe( params => {
            this.orderQuery.page = +params.get('page')! || this.orderQuery.page;
            this.orderQuery.sort = params.get('sort') || this.orderQuery.sort;
            this.orderQuery.keyword = params.get('keyword') || undefined;
            this.orderQuery.status = params.get('status') || undefined;
            this.orderStatusFilter = this.orderQuery.status || '';
            this.getOrders();
        });
    }

    generatePageArray(): number[] {
        return Array.from({ length: 9 }, (_, i) => this.orderQuery.page - 4 + i)
            .filter(num => num >= 1 && num <= this.totalPages);
    }

    updateUrlParams() {
        debugger;
        this.router.navigate([], {
                relativeTo: this.route,
                queryParams: this.orderQuery.queryParams,
            }
        )
    }
    pageChange(page: number) {
        this.orderQuery.page = page;
        this.updateUrlParams();
    }

    getOrders() {
        this.orderService.getByLoggedCustomer(this.orderQuery).subscribe({
            next: data => {
                this.orders = data.content;
                this.totalPages = data.totalPages;
                this.visiblePages = this.generatePageArray();
            },
            error: err => {
                this.toastr.error('Error: ' + err.error.message);
            }
        });
    }

    getOrderStatus(status: string) {
        return this.orderStatus.find(s => s.key === status)?.value;
    }

    onStatusFilterChange($event: any) {
        this.orderQuery.status = this.orderStatusFilter
        this.orderQuery.page = 1;
        this.updateUrlParams();

    }

    onSearch() {
        this.orderQuery.keyword = this.keywork;
        this.orderQuery.page = 1;
        this.updateUrlParams();
    }


}
