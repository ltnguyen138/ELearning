import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ManagerCategoryComponent } from './manager-category/manager-category.component';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ManagerCategoryFormComponent } from './manager-category-form/manager-category-form.component';
import {CheckboxModule} from "primeng/checkbox";
import { ManagerUserComponent } from './manager-user/manager-user.component';
import {SharedModule} from "../shared/shared.module";
import { CoursesComponent } from './courses/courses.component';
import { ManagerCourseComponent } from './manager-course/manager-course.component';
import { ManagerCourseInfoComponent } from './manager-course-info/manager-course-info.component';
import { ManagerCourseContentComponent } from './manager-course-content/manager-course-content.component';
import { ManagerChapterComponent } from './manager-chapter/manager-chapter.component';
import { ManagerLectureComponent } from './manager-lecture/manager-lecture.component';
import { ManagerLectureVideoComponent } from './manager-lecture-video/manager-lecture-video.component';
import { ManagerReviewComponent } from './manager-review/manager-review.component';
import {RatingStarComponent} from "../components/rating-star/rating-star.component";
import {RatingStartComponent} from "../shared/rating-start/rating-start.component";
import { QuestionAnswerPageComponent } from './question-answer/question-answer-page/question-answer-page.component';
import { QuestionAnswerComponent } from './question-answer/question-answer/question-answer.component';
import { ReportPageComponent } from './report/report-page/report-page.component';
import { CourseReportsComponent } from './report/course-reports/course-reports.component';
import { ReviewReportsComponent } from './report/review-reports/review-reports.component';
import { QaReportsComponent } from './report/qa-reports/qa-reports.component';
import { CourseReportDetailComponent } from './report/course-report-detail/course-report-detail.component';
import { AdminCskhComponent } from './admin-cskh/admin-cskh.component';
import { AdminChatComponent } from './admin-chat/admin-chat.component';
import { ManagerDiscountComponent } from './manager-discount/manager-discount.component';
import { ManagerDiscountFormComponent } from './manager-discount-form/manager-discount-form.component';
import {CalendarModule} from "primeng/calendar";
import { StatisticComponent } from './statistic/statistic.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InstructorStatisticComponent } from './instructor-statistic/instructor-statistic.component';
import {AutoCompleteModule} from "primeng/autocomplete";


@NgModule({
    declarations: [
        AdminComponent,
        ManagerCategoryComponent,
        ManagerCategoryFormComponent,
        ManagerUserComponent,
        CoursesComponent,
        ManagerCourseComponent,
        ManagerCourseInfoComponent,
        ManagerCourseContentComponent,
        ManagerChapterComponent,
        ManagerLectureComponent,
        ManagerLectureVideoComponent,
        ManagerReviewComponent,
        QuestionAnswerPageComponent,
        QuestionAnswerComponent,
        ReportPageComponent,
        CourseReportsComponent,
        ReviewReportsComponent,
        QaReportsComponent,
        CourseReportDetailComponent,
        AdminCskhComponent,
        AdminChatComponent,
        ManagerDiscountComponent,
        ManagerDiscountFormComponent,
        StatisticComponent,
        OrdersComponent,
        OrderDetailComponent,
        DashboardComponent,
        InstructorStatisticComponent,

    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        ConfirmDialogModule,
        ButtonModule,
        FormsModule,
        ReactiveFormsModule,
        CheckboxModule,
        SharedModule,
        CalendarModule,
        AutoCompleteModule

    ],
    providers: [
        ConfirmationService
    ]
})
export class AdminModule { }
