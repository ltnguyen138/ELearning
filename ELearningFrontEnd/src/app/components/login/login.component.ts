import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import { AuthService } from 'src/app/service/auth.service';
import {User} from "../../model/user";
import { TokenService } from 'src/app/service/token.service';
import { MessageService } from 'primeng/api';
import {LoginRq} from "../../dtos/user/login.rq";
import {ToastrService} from "ngx-toastr";
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import {interval, Subscription, takeWhile} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
    loginForm !: FormGroup;
    loggedInUser?: User | null;
    oauthUser?: SocialUser;
    isShowPassword: boolean = false;
    isAfterSubmit: boolean = false;
    timeLeft: number = 180;
    isLoaded: boolean = false;
    private countdownSubscription: Subscription | undefined;

    constructor(private router: Router,
                private fb: FormBuilder,
                private authService: AuthService,
                private tokenService: TokenService,
                private toastService: ToastrService,
                private socialOauthService: SocialAuthService) {

        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

    }

    ngOnInit(): void {

        this.loggedInUser = this.authService.getUserFromLocalStorage();
        if(this.loggedInUser) {
            this.router.navigate(['/']);
        }

        this.socialOauthService.authState.subscribe((user) => {
            this.oauthUser = user;
            if(!this.oauthUser) {
                return;
            }
            console.log(this.oauthUser);

            this.loginGoogle(user.idToken);
        });
    }

    login() {

        const loginReq: LoginRq = {
            ...this.loginForm.value
        }
        this.authService.login(loginReq).subscribe({

            next: data => {
                if(data.verified == false) {
                    this.toastService.warning("Tài khoản chưa được xác minh", "Đăng nhập không thành công", {timeOut: 10000});
                    this.isAfterSubmit = true;
                    this.timeLeft = 0;
                    return;
                }
                this.tokenService.setToken(data.token);
                this.authService.getLoggedUser().subscribe({
                    next: user => {
                        this.authService.saveUserToLocalStorage(user);
                        this.authService.updateLoggedUser(user);
                        this.router.navigate(['/']);
                        this.toastService.success('Xin chào ' + user.fullName, 'Đăng nhập thành công');
                    },
                    error: err => {
                        this.authService.updateLoggedUser(null);
                        this.toastService.error("Sai tài khoản hoặc mật khẩu", "Đăng nhập không thành công");
                    }
                });
            },
            error: err => {
                this.toastService.error("Sai tài khoản hoặc mật khẩu", "Đăng nhập không thành công");
            }
        });
    }


    loginGoogle(token:string) {

        this.authService.loginWithGoogle(token).subscribe({
            next: data => {
                this.tokenService.setToken(data.token);
                this.authService.getLoggedUser().subscribe({
                    next: user => {
                        this.loggedInUser = user;
                        this.authService.saveUserToLocalStorage(user);
                        this.authService.updateLoggedUser(user);
                        debugger;
                        this.router.navigate(['/']);
                        this.toastService.success('Xin chào ' + user.fullName, 'Đăng nhập thành công');
                    },
                    error: error => {
                        debugger
                        this.toastService.error('Đăng nhập không thành công, vui lòng thử lại.');
                    }
                });
            },
            error: error => {
                debugger
                this.toastService.error('Đăng nhập không thành công, vui lòng thử lại.');
            }
        });
    }

    sendVerificationEmail() {
        const email = this.loginForm.value.email;
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
