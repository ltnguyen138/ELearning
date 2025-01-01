import {User} from "./user";
import {Course} from "./course";
import {Review} from "./review";
import {QuestionAnswer} from "./question-answer";

export interface Report{

    id: number;
    entityType: string;
    entityId: number;
    user: User;
    reason: string;
    status: string;
    timestamp: Date;
    course: Course;
    review: Review;
    questionAnswer: QuestionAnswer;
    deleted: boolean;
}