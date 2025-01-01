import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearnerRoutingModule } from './learner-routing.module';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './account/account.component';
import { LearnerComponent } from './learner.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FileUploadModule} from "primeng/fileupload";
import {CalendarModule} from "primeng/calendar";
import { CourseCarouselComponent } from './course-carousel/course-carousel.component';
import { CoursesComponent } from './courses/courses.component';
import {RatingStarComponent} from "../components/rating-star/rating-star.component";
import {RadioButtonModule} from "primeng/radiobutton";
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CategoriesComponent } from './categories/categories.component';
import { LearnerChaptersComponent } from './learner-chapters/learner-chapters.component';
import { LearnerChapterComponent } from './learner-chapter/learner-chapter.component';
import { LearnerLectureComponent } from './learner-lecture/learner-lecture.component';
import { UserComponent } from './user/user.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { LearnCourseComponent } from './learn-course/learn-course.component';
import { LearnCourseContentComponent } from './learn-course-content/learn-course-content.component';
import { ReviewComponent } from './review/review.component';
import { QuestionAnswersComponent } from './question-answers/question-answers.component';
import { QuestionComponent } from './question/question.component';
import { AnswersComponent } from './answers/answers.component';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import { MyCoursesLearningComponent } from './my-courses-learning/my-courses-learning.component';
import { NotificationComponent } from './notification/notification.component';
import { CskhComponent } from './cskh/cskh.component';
import { ChatComponent } from './chat/chat.component';
import {SharedModule} from "../shared/shared.module";
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { PreviewLecturesComponent } from './preview-lectures/preview-lectures.component';
import { NoteComponent } from './note/note.component';


@NgModule({
    declarations: [
        HomeComponent,
        AccountComponent,
        LearnerComponent,
        CourseCarouselComponent,
        CoursesComponent,
        CourseDetailComponent,
        CategoriesComponent,
        LearnerChaptersComponent,
        LearnerChapterComponent,
        LearnerLectureComponent,
        UserComponent,
        CartComponent,
        CheckoutComponent,
        RatingStarComponent,
        OrdersComponent,
        OrderDetailComponent,
        LearnCourseComponent,
        LearnCourseContentComponent,
        ReviewComponent,
        QuestionAnswersComponent,
        QuestionComponent,
        AnswersComponent,
        MyCoursesLearningComponent,
        NotificationComponent,
        CskhComponent,
        ChatComponent,
        CheckoutSuccessComponent,
        PreviewLecturesComponent,
        NoteComponent

    ],
    exports: [
        RatingStarComponent,
        QuestionAnswersComponent
    ],
    imports: [
        CommonModule,
        LearnerRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        CalendarModule,

        RadioButtonModule,
        ConfirmDialogModule,
        SharedModule
    ]
})
export class LearnerModule { }
