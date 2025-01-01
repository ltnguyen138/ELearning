import {Component, OnInit} from '@angular/core';
import {UserService} from "../../service/user.service";
import {AuthService} from "../../service/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

    token: string | null = null;
    userId: number | null = null;
    valid: boolean = false;
    resetForm!: FormGroup
    validPassword: boolean = true;
    constructor(private userService: UserService,
                private authService: AuthService,
                protected router: Router,
                protected route: ActivatedRoute,
                private fb: FormBuilder,
                private toastr: ToastrService,) {

        this.resetForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    ngOnInit(): void {

        this.token = this.route.snapshot.queryParamMap.get('token');
        const userId = this.route.snapshot.queryParamMap.get('userId');
        this.userId = userId ? +userId : null;
            if(this.token && this.userId) {
                this.authService.validateResetPasswordToken(this.token, this.userId).subscribe({
                    next: data => {
                        this.valid = true;
                    },
                    error: err => {
                        this.valid = false;
                        this.toastr.error('Yêu cầu không hợp lệ');
                    }
                });
            } else {
                this.toastr.error('Yêu cầu không hợp lệ');
                this.valid = false;
            }
    }

    resetPassword() {

        if(this.resetForm.invalid) {
            this.toastr.error('Mật khẩu không hợp lệ');
            return;
        }
        if(this.resetForm.value.password !== this.resetForm.value.confirmPassword) {
            this.toastr.error('Mật khẩu và xác nhận mật khẩu không khớp');
            this.validPassword = false;
            return;
        }
        this.authService.resetPassword(this.token!, this.resetForm.value.password).subscribe({
            next: data => {
                this.toastr.success('Đổi mật khẩu thành công');
                this.router.navigate(['/login']);
            },
            error: err => {
                this.toastr.error('Đổi mật khẩu không thành công');
            }
        });

    }

}
