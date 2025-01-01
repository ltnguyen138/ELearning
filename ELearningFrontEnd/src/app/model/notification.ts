import {User} from "./user";
import {Course} from "./course";

export interface Notification{

    id: number;
    title: string;
    roleNotification: string;
    user: User;
    course: Course;
    timestamp: Date;
    read: boolean;
}