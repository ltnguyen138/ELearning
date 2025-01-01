import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormBuilder} from "@angular/forms";
import {CourseService} from "../../service/course.service";
import {DiscountService} from "../../service/discount.service";
import {CartService} from "../../service/cart.service";
import {OrderService} from "../../service/order.service";
import {CheckoutService} from "../../service/checkout.service";
import {PaypalService} from "../../service/paypal.service";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-checkout-success',
  templateUrl: './checkout-success.component.html',
  styleUrls: ['./checkout-success.component.css']
})
export class CheckoutSuccessComponent implements OnInit{

    private paymentId: string = '';
    private PayerID: string = '';
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

        if(this.route.snapshot.queryParamMap.has('paymentId') && this.route.snapshot.queryParamMap.has('PayerID')) {
            this.paymentId = this.route.snapshot.queryParamMap.get('paymentId')!;
            this.PayerID = this.route.snapshot.queryParamMap.get('PayerID')!;
            console.log(this.paymentId, this.PayerID);
            this.executePayment();
        } else {
            this.router.navigateByUrl('/learner');
        }
    }

    executePayment() {
        this.paypalService.executePayment(this.paymentId, this.PayerID).subscribe({
            next: () => {
                this.toastr.success('Payment success');
                this.router.navigateByUrl('/my-courses-learning');
                this.cartService.clearCart();
            },
            error: () => {
                this.toastr.error('Payment failed');
            }
        });
    }
}
