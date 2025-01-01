import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LearnerComponent} from "./learner.component";
import {HomeComponent} from "./home/home.component";
import {AccountComponent} from "./account/account.component";
import {LearnerGaurds} from "../gaurds/learner.gaurds";
import {CoursesComponent} from "./courses/courses.component";
import {CourseDetailComponent} from "./course-detail/course-detail.component";
import {UserComponent} from "./user/user.component";
import {CartComponent} from "./cart/cart.component";
import {CheckoutComponent} from "./checkout/checkout.component";
import {OrdersComponent} from "./orders/orders.component";
import {OrderDetailComponent} from "./order-detail/order-detail.component";
import {LearnCourseComponent} from "./learn-course/learn-course.component";
import {LearnCourseContentComponent} from "./learn-course-content/learn-course-content.component";
import {MyCoursesLearningComponent} from "./my-courses-learning/my-courses-learning.component";
import {NotificationComponent} from "./notification/notification.component";
import {CskhComponent} from "./cskh/cskh.component";
import {ChatComponent} from "./chat/chat.component";
import {CheckoutSuccessComponent} from "./checkout-success/checkout-success.component";
import {PreviewLecturesComponent} from "./preview-lectures/preview-lectures.component";

const routes: Routes = [
    {path: '', component: LearnerComponent, children: [
            {path: '', component: HomeComponent},
            {path: 'home', component: HomeComponent},
            {path: 'account', component: AccountComponent, canActivate:[LearnerGaurds]},
            {path: 'courses', component: CoursesComponent},
            {path: 'courses/:alias', component: CourseDetailComponent, children:[
                    {path: ':lectureId', component: PreviewLecturesComponent}
                ]},
            {path: 'user/:id', component: UserComponent},
            {path: 'cart', component: CartComponent},
            {path: 'checkout', component: CheckoutComponent},
            {path: 'checkout/:alias', component: CheckoutComponent},
            {path: 'checkout-success', component: CheckoutSuccessComponent},
            {path: 'orders', component: OrdersComponent},
            {path: 'orders/:id', component: OrderDetailComponent},
            {path: 'learn/:alias', component: LearnCourseComponent, canActivate: [LearnerGaurds] ,children: [
                    {path: ':id', component: LearnCourseContentComponent}
            ]},
            {path: 'my-courses-learning', component: MyCoursesLearningComponent},
            {path: 'notification', component: NotificationComponent},
            {path: 'cskh', component: CskhComponent, canActivate: [LearnerGaurds], children: [
                    {path: 'chat', component: ChatComponent}
            ]},

        ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnerRoutingModule { }
