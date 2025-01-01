import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {TokenService} from "../../service/token.service";
import {MessageService} from "primeng/api";
import { User } from 'src/app/model/user';
import {ToastrService} from "ngx-toastr";
import {interval, Subscription, takeWhile} from "rxjs";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

    registerForm !: FormGroup;
    loggedInUser?: User | null;
    isShowPassword: boolean = false;
    isAfterSubmit: boolean = false;
    timeLeft: number = 18;
    isLoaded: boolean = false;
    private countdownSubscription: Subscription | undefined;
    email: string| null = null;
    title = 'Tài khoản của bạn chưa được xác minh';
    constructor(private router: Router,
                private route: ActivatedRoute,
                private fb: FormBuilder,
                private authService: AuthService,
                private tokenService: TokenService,
                private toastService: ToastrService) {
        this.registerForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6), passwordValidator]],
            fullName: ['', Validators.required],

        });
    }
    ngOnInit(): void {

        this.loggedInUser = this.authService.getUserFromLocalStorage();
        if(this.loggedInUser) {
            this.router.navigate(['/']);
        }
        this.email = this.route.snapshot.queryParamMap.get('email');
        if(this.email) {
            this.isAfterSubmit = true;
            this.registerForm.get('email')?.setValue(this.email);
            this.timeLeft = 0;

        }

    }

    register() {

        const registerReq = {
            ...this.registerForm.value
        }
        this.isLoaded = true;
        this.authService.register(registerReq).subscribe({

            next: () => {
                this.toastService.success('Đăng ký thành công');
                this.isAfterSubmit = true;
                this.startCountdown();
                this.isLoaded  = false;

            },
            error: err => {
                this.toastService.error(err.error.message);
                this.isLoaded = false;
            }
        });
    }

    sendVerificationEmail() {
        const email = this.registerForm.value.email;
        this.isLoaded = true;
        this.authService.sendVerificationEmail(email).subscribe({
            next: () => {
                this.toastService.success('Đã gửi email xác nhận');
                this.startCountdown();
                this.isLoaded = false
            },
            error: err => {
                this.toastService.error(err.error.message);
                this.isLoaded = false;
            }
        });
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
}
function passwordValidator(control: FormControl) {

    const passwordRegex: RegExp =  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    const valid = passwordRegex.test(control.value);
    return valid ? null : { invalidPassword: true };
}