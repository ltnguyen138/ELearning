import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {CartService} from "../../service/cart.service";
import {CourseService} from "../../service/course.service";
import {Course} from "../../model/course";
import {environment} from "../../environment";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

    cartItems: Course[] = [];
    totalPrice: number = 0;
    constructor(protected router: Router,
                protected route: ActivatedRoute,
                private toastr: ToastrService,
                private cartService: CartService,
                private courseService: CourseService) { }

    ngOnInit(): void {

        this.getCartItems();
    }

    getCartItems() {
        this.cartItems = this.cartService.getCart();
        this.totalPrice = this.cartItems.reduce((total, course) => total + course.price, 0);
    }

    removeFromCart(courseId: number) {
        this.cartService.removeFromCart(courseId)
        this.getCartItems();
    }

    protected readonly environment = environment;
}
