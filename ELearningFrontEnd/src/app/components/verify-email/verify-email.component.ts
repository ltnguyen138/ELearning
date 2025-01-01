import { Component, OnInit } from '@angular/core';
import {UserService} from "../../service/user.service";
import {AuthService} from "../../service/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {TokenService} from "../../service/token.service";

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

    token: string | null = null;
    userId: number | null = null;
    verified: boolean = false;
    constructor(private userService: UserService,
          private authService: AuthService,
          protected router: Router,
          protected route: ActivatedRoute,
          private fb: FormBuilder,
          private toastr: ToastrService,
                private tokenService: TokenService) { }

    ngOnInit(): void {

        this.token = this.route.snapshot.queryParamMap.get('token');
        const userId = this.route.snapshot.queryParamMap.get('userId');
        this.userId = userId ? +userId : null;
        if(this.token == null || this.userId == null) {
            this.toastr.error('Yêu cầu không hợp lệ, xác minh không thành công', '',{timeOut: 10000});
            this.router.navigate(['/']);
            return;
        }
        this.authService.validateEmailVerificationToken(this.token!, this.userId!).subscribe({
            next: data => {
                this.verified = true;
                this.tokenService.setToken(data.token);
                this.toastr.success('Xác minh thành công', '',{timeOut: 10000});

                this.authService.getLoggedUser().subscribe({
                    next: user => {
                        this.authService.saveUserToLocalStorage(user);
                        this.authService.updateLoggedUser(user);
                        this.router.navigate(['/']);
                        this.toastr.success('Xin chào ' + user.fullName);
                    },
                    error: err => {
                        this.authService.updateLoggedUser(null);
                        this.toastr.error("Có lỗi xảy ra, vui lòng đăng nhập lại", '',{timeOut: 10000});
                    }
                });
            },
            error: err => {
                this.verified = false;
                this.toastr.error('Yêu cầu không hợp lệ, xác minh không thành công', '',{timeOut: 10000});
                this.router.navigate(['/']);
            }
        });

    }

}
