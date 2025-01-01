import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputTextModule} from "primeng/inputtext";
import { RegisterComponent } from './components/register/register.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ConfirmationService, MessageService} from "primeng/api";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";
import { TokenInterceptor } from './interceptors/token.interceptor';
import { HeaderComponent } from './components/header/header.component';
import {FileUploadModule} from "primeng/fileupload";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ButtonModule} from "primeng/button";
import {SharedModule} from "./shared/shared.module";
import { GoogleLoginProvider, GoogleSigninButtonDirective, GoogleSigninButtonModule, SocialLoginModule } from '@abacritt/angularx-social-login';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { FooterComponent } from './components/footer/footer.component';
import { ComponentsComponent } from './components/components.component';
import { TermsOfServiceComponent } from './components/terms-of-service/terms-of-service.component';
import { IntroduceComponent } from './components/introduce/introduce.component';
import { RefundPolicyComponent } from './components/refund-policy/refund-policy.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        HeaderComponent,
        ForgotPasswordComponent,
        ResetPasswordComponent,
        FooterComponent,
        ComponentsComponent,
        TermsOfServiceComponent,
        IntroduceComponent,
        RefundPolicyComponent,
        VerifyEmailComponent,

    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        InputTextModule,
        ToastrModule.forRoot(
            {
                timeOut: 3000,
                positionClass: 'toast-top-right',
                preventDuplicates: true,
                closeButton: true,
            }
        ),
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FileUploadModule,
        ConfirmDialogModule,
        ButtonModule,
        SharedModule,
        SocialLoginModule,
        GoogleSigninButtonModule,


    ],
    exports: [

    ],
    providers: [
        MessageService,
        {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
        ConfirmationService,
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(
                            '87133212216-fsl52nkagntsbpgi655723hv84a2197o.apps.googleusercontent.com'
                        )
                    }
                ]
            }
        },
        GoogleSigninButtonDirective
    ]
})
export class AppModule { }
