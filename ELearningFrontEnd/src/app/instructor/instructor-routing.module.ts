import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InstructorComponent} from "./instructor.component";
import {InstructorCoursesComponent} from "./instructor-courses/instructor-courses.component";
import {InstructorGaurds} from "../gaurds/instructor.gaurds";
import {InstructorCourseDetailComponent} from "./instructor-course-detail/instructor-course-detail.component";
import {InstructorCourseInfoComponent} from "./instructor-course-info/instructor-course-info.component";
import {InstructorCourseContentComponent} from "./instructor-course-content/instructor-course-content.component";
import {InstructorDiscountComponent} from "./instructor-discount/instructor-discount.component";
import {InstructorDiscountFormComponent} from "./instructor-discount-form/instructor-discount-form.component";
import {EarningManagementComponent} from "./earning-management/earning-management.component";
import {SalesStatisticsComponent} from "./sales-statistics/sales-statistics.component";
import {PayoutComponent} from "./payout/payout.component";
import {PayoutHistoryComponent} from "./payout-history/payout-history.component";
import {InstructorPreviewLecturesComponent} from "./instructor-preview-lectures/instructor-preview-lectures.component";
import {LearnerStatisticsComponent} from "./learner-statistics/learner-statistics.component";
import {AdminGaurds} from "../gaurds/admin.gaurds";
import { DashboardComponent } from './dashboard/dashboard.component';
import {ManagerQaComponent} from "../shared/manager-qa/manager-qa.component";
import {ManagerReviewComponent} from "../admin/manager-review/manager-review.component";
import {SharedManagerReviewsComponent} from "../shared/shared-manager-reviews/shared-manager-reviews.component";

const routes: Routes = [
    {path: '', component: InstructorComponent, children: [
            {path: 'courses', canActivate: [InstructorGaurds],children:[
                    {path: '', component: InstructorCoursesComponent},
                    {path: 'detail/:id', component: InstructorCourseDetailComponent, canActivate: [InstructorGaurds],children:[
                            {path: '', redirectTo: 'info', pathMatch: 'full'},
                            {path: 'info', component: InstructorCourseInfoComponent, canActivate: [InstructorGaurds]},
                            {path: 'content', component: InstructorCourseContentComponent, canActivate: [InstructorGaurds], children:[
                                    {path: ':lectureId', component: InstructorPreviewLecturesComponent, canActivate: [InstructorGaurds]}
                                ]},
                            {path: 'discount', component: InstructorDiscountComponent, canActivate: [InstructorGaurds], children:[
                                    {path: 'edit/:discountId', component: InstructorDiscountFormComponent, canActivate: [InstructorGaurds]},
                                    {path: 'add', component: InstructorDiscountFormComponent, canActivate: [InstructorGaurds]},
                                ]},
                            {path: 'learner-statistics', component: LearnerStatisticsComponent, canActivate: [InstructorGaurds]},
                            {path: 'qa', component: ManagerQaComponent, canActivate: [InstructorGaurds]},
                            {path: 'reviews', component: SharedManagerReviewsComponent, canActivate: [InstructorGaurds]},
                            {path: '**', redirectTo: 'info', pathMatch: 'full'}
                    ]},
                    {path: 'add', component: InstructorCourseInfoComponent, canActivate: [InstructorGaurds]},
                    {path: '', redirectTo: 'detail', pathMatch: 'full'},
                    {path: '**', redirectTo: 'detail', pathMatch: 'full'}
                ]},
            {path: 'earnings-management', component: EarningManagementComponent,canActivate: [InstructorGaurds] ,children:[
                    {path: 'statistics', component: SalesStatisticsComponent, canActivate: [InstructorGaurds]},
                    {path: 'payout', component: PayoutComponent, canActivate: [InstructorGaurds]},
                    {path: 'payout-history', component: PayoutHistoryComponent, canActivate: [InstructorGaurds]},
                ]},
            {path: 'dashboard', component: DashboardComponent, canActivate: [InstructorGaurds]},
    ]},
    {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule { }
