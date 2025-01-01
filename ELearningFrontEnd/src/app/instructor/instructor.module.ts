import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructorRoutingModule } from './instructor-routing.module';
import { InstructorComponent } from './instructor.component';
import { InstructorCoursesComponent } from './instructor-courses/instructor-courses.component';
import { InstructorCourseDetailComponent } from './instructor-course-detail/instructor-course-detail.component';
import { InstructorCourseInfoComponent } from './instructor-course-info/instructor-course-info.component';
import { InstructorCourseContentComponent } from './instructor-course-content/instructor-course-content.component';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { InstructorChapterComponent } from './instructor-chapter/instructor-chapter.component';
import { InstructorLectureComponent } from './instructor-lecture/instructor-lecture.component';
import { InstructorDiscountComponent } from './instructor-discount/instructor-discount.component';
import { InstructorDiscountFormComponent } from './instructor-discount-form/instructor-discount-form.component';
import {CalendarModule} from "primeng/calendar";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {SharedModule} from "../shared/shared.module";
import { EarningManagementComponent } from './earning-management/earning-management.component';
import { SalesStatisticsComponent } from './sales-statistics/sales-statistics.component';
import { PayoutComponent } from './payout/payout.component';
import { PayoutHistoryComponent } from './payout-history/payout-history.component';
import { InstructorPreviewLecturesComponent } from './instructor-preview-lectures/instructor-preview-lectures.component';
import { LearnerStatisticsComponent } from './learner-statistics/learner-statistics.component';
import { ListCompleteLearnerComponent } from './list-complete-learner/list-complete-learner.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {AutoCompleteModule} from "primeng/autocomplete";



@NgModule({
  declarations: [
    InstructorComponent,
    InstructorCoursesComponent,
    InstructorCourseDetailComponent,
    InstructorCourseInfoComponent,
    InstructorCourseContentComponent,
    InstructorChapterComponent,
    InstructorLectureComponent,
    InstructorDiscountComponent,
    InstructorDiscountFormComponent,
    EarningManagementComponent,
    SalesStatisticsComponent,
    PayoutComponent,
    PayoutHistoryComponent,
    InstructorPreviewLecturesComponent,
    LearnerStatisticsComponent,
    ListCompleteLearnerComponent,
    DashboardComponent,

  ],
    imports: [
        CommonModule,
        InstructorRoutingModule,
        ConfirmDialogModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,
        DragDropModule,
        SharedModule,
        AutoCompleteModule
    ]
})
export class InstructorModule { }
