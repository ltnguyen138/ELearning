import { Injectable } from '@angular/core';
import { Course } from '../model/course';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CartService {

    private cart: Course[] = [];

    constructor(private toastrService: ToastrService) {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            this.cart = JSON.parse(storedCart);
        }
    }

    addToCart(course: Course) {
        if (!this.cart.find(c => c.id === course.id)) {
            if(this.cart.length >= 5) {
                this.toastrService.error('Giỏ hàng đã đầy');
                return;
            }
            this.cart.push(course);
            this.saveCartToLocalStorage();
            this.toastrService.success('Đã thêm khóa học vào giỏ hàng');
        }else {
            this.toastrService.error('Khóa học đã có trong giỏ hàng');
        }
    }

    getCart(): Course[] {
        return this.cart;
    }

    private saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    removeFromCart(courseId: number) {
        this.cart = this.cart.filter(c => c.id !== courseId);
        this.saveCartToLocalStorage();
    }

    clearCart() {
        this.cart = [];
        this.saveCartToLocalStorage();
    }
}
