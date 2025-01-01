import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, interval, takeWhile } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

    forgotPasswordForm!: FormGroup;
    email: string = '';
    timeLeft: number = 180; // Thời gian đếm ngược bắt đầu từ 180 giây
    private countdownSubscription: Subscription | undefined;
    isSendingEmail: boolean = false;
    isLoaded: boolean = false;
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private toastr: ToastrService,
    ) {
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }
    ngOnInit(): void {
    }

    startCountdown() {
        // Nếu có bộ đếm trước đó đang chạy thì dừng nó lại
        if (this.countdownSubscription) {
            this.countdownSubscription.unsubscribe();
        }

        // Đặt lại thời gian và bắt đầu đếm ngược
        this.timeLeft = 180;
        this.countdownSubscription = interval(1000)
            .pipe(takeWhile(() => this.timeLeft > 0))
            .subscribe(() => {
                this.timeLeft--;
            });
    }

    resetCountdown() {
        this.startCountdown();
    }


    sendResetPasswordEmail() {
        if(this.forgotPasswordForm.invalid) {
            this.toastr.error('Email không hợp lệ', 'Lỗi');
            return;
        }
        this.email = this.forgotPasswordForm.value.email;
        this.isLoaded = true;
        this.authService.forgotPassword(this.email).subscribe({
            next: data => {
                this.toastr.success('Đã gửi email reset mật khẩu', 'Thành công');
                this.isSendingEmail = true;
                this.startCountdown();
                this.isLoaded = false;
            },
            error: err => {
                debugger;
                this.toastr.error('Email không tồn tại', 'Lỗi');
            }
        });
    }

}
    function ngOnInit() {
        throw new Error('Function not implemented.');
    }

