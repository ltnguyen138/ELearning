import {Course} from "./course";
import {User} from "./user";

export interface Review {
    id: number;
    comment: string;
    rating: number;
    course: Course;
    user: User;
    createdTime: Date;
    updatedTime: Date;
    deleted: boolean;
}