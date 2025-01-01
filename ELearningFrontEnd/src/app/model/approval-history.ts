import { Course } from "./course";
import {Lecture} from "./lecture";
import {User} from "./user";

export interface ApprovalHistory{

    id: number;
    type: string;
    course: Course;
    lecture: Lecture;
    admin: User;
    status: string;
    comment: string;
    timestamp: Date;
}