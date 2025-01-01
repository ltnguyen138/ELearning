import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import {RouterLink} from "@angular/router";
import { RatingStartComponent } from './rating-start/rating-start.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { ReceiveMessageComponent } from './receive-message/receive-message.component';
import {ChartModule} from "primeng/chart";
import {AgGridAngular} from "ag-grid-angular";
import { VerticalBarStatisticTypeOrderComponent } from './vertical-bar-statistic-type-order/vertical-bar-statistic-type-order.component';
import { PieStatisticTypeCategoryComponent } from './pie-statistic-type-category/pie-statistic-type-category.component';
import { GridStatisticTypeCourseComponent } from './grid-statistic-type-course/grid-statistic-type-course.component';
import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard.component';
import { LineChartAdminDashboardComponent } from './line-chart-admin-dashboard/line-chart-admin-dashboard.component';
import { VerticalBarOrderComponent } from './vertical-bar-order/vertical-bar-order.component';
import { PieCategoryCourseComponent } from './pie-category-course/pie-category-course.component';
import { ManagerQaComponent } from './manager-qa/manager-qa.component';
import { ListLectureComponent } from './list-lecture/list-lecture.component';
import { SharedQuestionAnswersComponent } from './shared-question-answers/shared-question-answers.component';
import { SharedQuestionComponent } from './shared-question/shared-question.component';
import { SharedAnswersComponent } from './shared-answers/shared-answers.component';
import { ChapterComponent } from './chapter/chapter.component';
import { SharedChapterComponent } from './shared-chapter/shared-chapter.component';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ManagerReviewsComponent } from './manager-reviews/manager-reviews.component';
import { SharedManagerReviewsComponent } from './shared-manager-reviews/shared-manager-reviews.component';
import {LearnerModule} from "../learner/learner.module";



@NgModule({
    declarations: [
        AdminDashboardComponent,
        RatingStartComponent,
        SendMessageComponent,
        ReceiveMessageComponent,
        VerticalBarStatisticTypeOrderComponent,
        PieStatisticTypeCategoryComponent,
        GridStatisticTypeCourseComponent,
        InstructorDashboardComponent,
        LineChartAdminDashboardComponent,
        VerticalBarOrderComponent,
        PieCategoryCourseComponent,
        ManagerQaComponent,
        ListLectureComponent,
        SharedQuestionAnswersComponent,
        SharedQuestionComponent,
        SharedAnswersComponent,
        ChapterComponent,
        SharedChapterComponent,
        ManagerReviewsComponent,
        SharedManagerReviewsComponent
    ],
    exports: [
        AdminDashboardComponent,
        RatingStartComponent,
        SendMessageComponent,
        ReceiveMessageComponent,
        VerticalBarStatisticTypeOrderComponent,
        PieStatisticTypeCategoryComponent,
        GridStatisticTypeCourseComponent,
        InstructorDashboardComponent,
        LineChartAdminDashboardComponent,
        VerticalBarOrderComponent,
        PieCategoryCourseComponent
    ],
    imports: [
        CommonModule,
        RouterLink,
        ChartModule,
        AgGridAngular,
        ConfirmDialogModule,
        FormsModule,
        ReactiveFormsModule,

    ],
    providers: [
        DatePipe
    ]
})
export class SharedModule { }
