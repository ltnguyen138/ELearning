import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {FormBuilder} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {UserService} from "../../service/user.service";
import {TokenService} from "../../service/token.service";
import {User} from "../../model/user";
import { environment } from 'src/app/environment';
import {Category} from "../../model/category";
import {CategoryQuery} from "../../dtos/category/category.query";
import { CategoryService } from 'src/app/service/category.service';
import {Discount} from "../../model/discount";
import {DiscountService} from "../../service/discount.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit{

    loggedUser?: User | null;
    profilePictureApi: string = environment.profilePictureApi;
    categories: Category[] = [];
    categoryQuery = new CategoryQuery();
    globalDiscount: Discount | null = null;
    constructor(private router: Router,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private authService: AuthService,
                private userService: UserService,
                private tokenService: TokenService,
                private categoryService: CategoryService,
                private discountService: DiscountService) {
    }

    ngOnInit(): void {
        this.getGlobalDiscountCanUse();
        this.getLoggedUser();
        this.getcategories();
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

    getLoggedUser() {
        if(this.tokenService.getToken()===null) {
            return;
        }
        this.authService.getLoggedUser().subscribe({
            next: data => {
                this.loggedUser = data;
                this.profilePictureApi = environment.profilePictureApi + this.loggedUser?.profilePicture;
            },
            error: error => {
                this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');
            }
        });
    }

    getcategories() {

        this.categoryQuery.size = 4;
        this.categoryService.getPublicPage(this.categoryQuery).subscribe({
            next: data => {
                this.categories = data.content;
            },
            error: error => {
                this.toastr.error('Có lỗi xảy ra, vui lòng thử lại sau', 'Lỗi');
            }
        });

    }
}
