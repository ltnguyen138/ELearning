import {Lecture} from "./lecture";
import {User} from "./user";
import {Course} from "./course";

export interface QuestionAnswer{

    id: number;
    content: string;
    lecture: Lecture;
    user: User;
    question: QuestionAnswer;
    answers: QuestionAnswer[];
    createdTime: Date;
    updatedTime: Date;
    course: Course;
    deleted: boolean;
}