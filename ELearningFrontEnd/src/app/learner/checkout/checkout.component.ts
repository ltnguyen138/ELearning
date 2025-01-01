import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormBuilder} from "@angular/forms";
import {CourseService} from "../../service/course.service";
import {DiscountService} from "../../service/discount.service";
import { Course } from 'src/app/model/course';
import {OrderItem} from "../../dtos/order/order.item";
import {CartService} from "../../service/cart.service";
import {Discount} from "../../model/discount";
import {environment} from "../../environment";
import {OrderReq} from "../../dtos/order/order.req";
import {OrderService} from "../../service/order.service";
import {catchError, of, tap } from 'rxjs';
import {CheckoutService} from "../../service/checkout.service";
import {PaypalService} from "../../service/paypal.service";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
    code: string = '';
    isFromCart: boolean = false;
    cart: Course[] = [];
    orderItems: OrderItem[] = [];
    totalPrice: number = 0;
    discountPrice: number = 0;
    finalPrice: number = 0;
    globalDiscount: Discount | null = null;
    alias: string = '';
    paymentMethod: string = '';
    loggedUser = this.authService.getUserFromLocalStorage();
    isLoaded: boolean = false;
    hasProcessingOrder: boolean = false;
    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private courseService: CourseService,
                private discountService: DiscountService,
                private cartService: CartService,
                private orderService: OrderService,
                private checkoutService: CheckoutService,
                private paypalService: PaypalService,
                private authService: AuthService) { }

    ngOnInit(): void {

        if(this.route.snapshot.paramMap.has('alias')) {
            this.alias = this.route.snapshot.paramMap.get('alias')!;
        }
        this.checkProcessingOrder();
        this.checkoutService.subscribeToMess(this.loggedUser!.id);
        this.checkoutService.mesSubject.subscribe({
            next: data => {
                console.log(data);
                if(data.trim() == '"CREATED"'){
                    this.hasProcessingOrder = true;
                }else {
                    this.hasProcessingOrder = false;
                    this.loadData();
                }
            }
        });

    }

    checkProcessingOrder() {
        this.orderService.checkPending().subscribe({
            next: data => {
                if(data == 'YES') {
                    this.hasProcessingOrder = true;
                }else {
                    this.hasProcessingOrder = false;
                    this.loadData();
                }

            },
            error: err => {
                this.toastr.error('Error: ' + err.error.message);
            }
        });
    }

    deleteProcessingOrder() {
        this.orderService.deletePendingOrder().subscribe({
            next: data => {
                this.loadData();
                this.hasProcessingOrder = false;
            },
            error: err => {
                this.toastr.error('Error: ' + err.error.message);
            }
        });
    }

    getGlobalDiscountCanUse() {
        this.discountService.getGlobalCanUseDiscounts().subscribe({
            next: data => {
                this.globalDiscount = data;
            },
            error: err => {
                this.toastr.error('Error: ' + err.error.message);
            }
        });
    }

    getGlobalDiscountCanUse2() {
        return this.discountService.getGlobalCanUseDiscounts().pipe(
            catchError(err => {
                this.toastr.error('Error: ' + err.error.message);
                return of(null);
            })
        );
    }

    loadData() {
        this.getGlobalDiscountCanUse2().subscribe({
            next: data => {
                this.globalDiscount = data;
                if(this.alias !== '') {
                    this.getCourseByAlias();
                }else {
                    this.getCartItems();
                }
            },
            error: err => {
                this.toastr.error('Error: ' + err.error.message);
            }
        });

    }

    getCartItems() {
        this.cart = this.cartService.getCart();
        this.getOrderItems();
    }

    getCourseByAlias() {
        this.courseService.getByAlias(this.alias).subscribe({
            next: data => {
                this.cart = [data];
                this.getOrderItems();
            },
            error: err => {
                this.toastr.error('Error: ' + err.error.message);
            }
        });

    }


    getOrderItems() {

        let totalPrice = 0; // Biến tạm để tính tổng tiền
        let discountPrice = 0; // Biến tạm để tính tổng giảm giá
        if(this.globalDiscount === null) {
            this.orderItems = this.cart.map(course => {
                const itemPrice = course.price;
                totalPrice += itemPrice; // Tính tổng tiền trong quá trình tạo orderItem
                return {
                    course: course,
                    code: '',
                    price: itemPrice,
                    discountPrice: 0,
                    finalPrice: itemPrice,
                    newCode: ''
                };
            });

            this.totalPrice = totalPrice;
            this.discountPrice = 0; // Tạm thời chưa có giảm giá
            this.finalPrice = this.totalPrice - this.discountPrice
            return
        }

        // Nếu có discount thì sẽ tính giảm giá cho từng course
        this.orderItems = this.cart.map(course => {
            const itemPrice = course.price;
            const itemDiscountPrice = course.price * this.globalDiscount!.discount / 100;
            const finalPrice = itemPrice - itemDiscountPrice;
            totalPrice += itemPrice; // Tính tổng tiền trong quá trình tạo orderItem
            discountPrice += itemDiscountPrice; // Tính tổng giảm giá trong quá trình tạo orderItem
            return {
                course: course,
                code: this.globalDiscount!.code,
                price: itemPrice,
                discountPrice: itemDiscountPrice,
                finalPrice: finalPrice,
                newCode: ''
            };
        });
        this.totalPrice = totalPrice;
        this.discountPrice = discountPrice;
        this.finalPrice = this.totalPrice - this.discountPrice

    }

    applyDiscount(code: string, courseId: number){

        this.discountService.applyDiscount(code, courseId).subscribe({
            next: data => {
                const orderItem = this.orderItems.find(item => item.course.id === courseId);
                if (orderItem) {
                    orderItem.code = code;
                    orderItem.discountPrice = data.discountPrice;
                    orderItem.finalPrice = orderItem.price - orderItem.discountPrice;
                    this.totalPrice = this.orderItems.reduce((total, item) => total + item.price, 0);
                    this.discountPrice = this.orderItems.reduce((total, item) => total + item.discountPrice, 0);
                    this.finalPrice = this.totalPrice - this.discountPrice;
                    this.toastr.success('Áp dụng mã giảm giá thành công');
                }

            },
            error: err => {
                this.toastr.error('Lỗi: ' + err.error.message);
            }
        });

    }

    checkout() {

        const orderReq: OrderReq = {
            cartItems: this.orderItems.map(item => ({
                courseId: item.course.id,
                discountCode: item.code
            }))
        };
        if(this.paymentMethod == 'paypal') {
            this.isLoaded = true;
            this.paypalService.createPayment(orderReq).subscribe({
                next: data => {
                    window.location.href = data;

                },
                error: err => {
                    this.toastr.error('Lỗi: ' + err.error.message);
                    this.router.navigate(['/']);
                }
            });

        }
        // this.orderService.createOrder(orderReq).subscribe({
        //     next: data => {
        //         this.toastr.success('Đặt hàng thành công');
        //         this.cartService.clearCart();
        //         this.router.navigate(['/']);
        //     },
        //     error: err => {
        //         this.toastr.error('Lỗi: ' + err.error.message);
        //     }
        // });


    }



    protected readonly environment = environment;
    protected readonly console = console;
}
