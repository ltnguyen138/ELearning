import {Course} from "./course";

export interface Chapter{

    id: number | null;
    name: string | null;
    course: Course
    activated: boolean | null,
    createdTime: Date  | null,
    updatedTime: Date   | null,
    orderNumber: number | null
}