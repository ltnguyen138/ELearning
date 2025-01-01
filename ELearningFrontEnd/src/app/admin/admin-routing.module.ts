import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LearnerComponent} from "../learner/learner.component";
import {HomeComponent} from "../learner/home/home.component";
import {AccountComponent} from "../learner/account/account.component";
import {LearnerGaurds} from "../gaurds/learner.gaurds";
import {AdminComponent} from "./admin.component";
import {ManagerCategoryComponent} from "./manager-category/manager-category.component";
import {AdminGaurds} from "../gaurds/admin.gaurds";
import {ManagerCategoryFormComponent} from "./manager-category-form/manager-category-form.component";
import {ManagerUserComponent} from "./manager-user/manager-user.component";
import {CoursesComponent} from "./courses/courses.component";
import {
    InstructorCourseDetailComponent
} from "../instructor/instructor-course-detail/instructor-course-detail.component";
import {InstructorGaurds} from "../gaurds/instructor.gaurds";
import {InstructorCourseInfoComponent} from "../instructor/instructor-course-info/instructor-course-info.component";
import {
    InstructorCourseContentComponent
} from "../instructor/instructor-course-content/instructor-course-content.component";
import {ManagerCourseComponent} from "./manager-course/manager-course.component";
import {ManagerCourseInfoComponent} from "./manager-course-info/manager-course-info.component";
import {ManagerCourseContentComponent} from "./manager-course-content/manager-course-content.component";
import {ManagerLectureVideoComponent} from "./manager-lecture-video/manager-lecture-video.component";
import {ManagerReviewComponent} from "./manager-review/manager-review.component";
import {QuestionAnswerPageComponent} from "./question-answer/question-answer-page/question-answer-page.component";
import {ReportPageComponent} from "./report/report-page/report-page.component";
import {CourseReportsComponent} from "./report/course-reports/course-reports.component";
import {ReviewReportsComponent} from "./report/review-reports/review-reports.component";
import {QaReportsComponent} from "./report/qa-reports/qa-reports.component";
import {CourseReportDetailComponent} from "./report/course-report-detail/course-report-detail.component";
import {AdminCskhComponent} from "./admin-cskh/admin-cskh.component";
import {ManagerDiscountComponent} from "./manager-discount/manager-discount.component";
import {ManagerDiscountFormComponent} from "./manager-discount-form/manager-discount-form.component";
import {NotificationComponent} from "../learner/notification/notification.component";
import {StatisticComponent} from "./statistic/statistic.component";
import {OrderService} from "../service/order.service";
import {OrdersComponent} from "./orders/orders.component";
import {OrderDetailComponent} from "./order-detail/order-detail.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {InstructorStatisticComponent} from "./instructor-statistic/instructor-statistic.component";
import {ManagerQaComponent} from "../shared/manager-qa/manager-qa.component";
import {SharedManagerReviewsComponent} from "../shared/shared-manager-reviews/shared-manager-reviews.component";

const routes: Routes = [
    {path: '', component: AdminComponent, children: [
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            {path: 'dashboard', component: DashboardComponent, canActivate: [AdminGaurds]},
            {path: 'categories', component: ManagerCategoryComponent,canActivate:[AdminGaurds]},
            {path: 'categories/edit/:id', component: ManagerCategoryFormComponent,canActivate:[AdminGaurds]},
            {path: 'categories/add', component: ManagerCategoryFormComponent,canActivate:[AdminGaurds]},
            {path: 'users', component: ManagerUserComponent,canActivate:[AdminGaurds]},
            {path: 'courses', canActivate:[AdminGaurds], children: [
                    {path: '', component: CoursesComponent,canActivate:[AdminGaurds]},
                    {path: 'detail/:id', component: ManagerCourseComponent, canActivate: [AdminGaurds],children:[
                            {path: '', redirectTo: 'info', pathMatch: 'full'},
                            {path: 'info', component: ManagerCourseInfoComponent, canActivate: [AdminGaurds]},
                            {path: 'content', component: ManagerCourseContentComponent, canActivate: [AdminGaurds], children:[
                                    {path: ':lectureId', component: ManagerLectureVideoComponent, canActivate: [AdminGaurds]}
                                ]},
                            {path: 'qa', component: ManagerQaComponent, canActivate: [AdminGaurds]},
                            {path: 'reviews', component: SharedManagerReviewsComponent, canActivate: [AdminGaurds]},
                            {path: '**', redirectTo: 'info', pathMatch: 'full'}
                        ]},
                ]},
            {path: 'reviews', component: ManagerReviewComponent,canActivate:[AdminGaurds]},
            {path: 'question-answer', component: QuestionAnswerPageComponent,canActivate:[AdminGaurds]},
            {path: 'reports', component: ReportPageComponent,canActivate:[AdminGaurds], children: [
                    {path: 'course', component: CourseReportsComponent,canActivate:[AdminGaurds]},
                    {path: 'review', component: ReviewReportsComponent,canActivate:[AdminGaurds]},
                    {path: 'question-answer', component: QaReportsComponent,canActivate:[AdminGaurds]},
                    {path: '**', redirectTo: 'course'}
            ]},
            {path: 'report-course-detail/:id', component: CourseReportDetailComponent,canActivate:[AdminGaurds], children: [
                    {path: 'courses', canActivate:[AdminGaurds], children: [
                            {path: 'detail/:id', component: ManagerCourseComponent, canActivate: [AdminGaurds],children:[
                                    {path: '', redirectTo: 'info', pathMatch: 'full'},
                                    {path: 'info', component: ManagerCourseInfoComponent, canActivate: [AdminGaurds]},
                                    {path: 'content', component: ManagerCourseContentComponent, canActivate: [AdminGaurds], children:[
                                            {path: ':lectureId', component: ManagerLectureVideoComponent, canActivate: [AdminGaurds]}
                                        ]},
                                    {path: '**', redirectTo: 'info', pathMatch: 'full'}
                                ]},
                        ]},
                ]},
            {path: 'cskh', component: AdminCskhComponent,canActivate:[AdminGaurds]},
            {path: 'discounts', component: ManagerDiscountComponent,canActivate:[AdminGaurds], children:[
                    {path: 'add', component: ManagerDiscountFormComponent,canActivate:[AdminGaurds]},
                    {path: 'edit/:discountId', component: ManagerDiscountFormComponent,canActivate:[AdminGaurds]}
                ]},
            {path: 'statistic', component: StatisticComponent},
            {path: 'instructor-statistic/:id', component: InstructorStatisticComponent},
            {path: 'orders', component: OrdersComponent,canActivate:[AdminGaurds]},
            {path: 'order/:id', component: OrderDetailComponent, canActivate: [AdminGaurds]},
        ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
