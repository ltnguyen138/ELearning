import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import {RegisterComponent} from "./components/register/register.component";
import {InstructorGaurds} from "./gaurds/instructor.gaurds";
import {AdminGaurds} from "./gaurds/admin.gaurds";
import {LearnerGaurds} from "./gaurds/learner.gaurds";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component";
import {IntroduceComponent} from "./components/introduce/introduce.component";
import {TermsOfServiceComponent} from "./components/terms-of-service/terms-of-service.component";
import {RefundPolicyComponent} from "./components/refund-policy/refund-policy.component";
import {VerifyEmailComponent} from "./components/verify-email/verify-email.component";

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
    {path: 'verify-email', component: VerifyEmailComponent},
    {path: 'introduce', component: IntroduceComponent},
    {path: 'terms-of-service', component: TermsOfServiceComponent},
    {path: 'refund-policy', component: RefundPolicyComponent},
    {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [AdminGaurds]},
    {path: 'instructor', loadChildren: () => import('./instructor/instructor.module').then(m => m.InstructorModule), canActivate: [InstructorGaurds]},
    {path: '', loadChildren: () => import('./learner/learner.module').then(m => m.LearnerModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
