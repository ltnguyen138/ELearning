import {Course} from "../../model/course";

export interface OrderItem{
    course: Course;
    code: string;
    price: number;
    discountPrice: number;
    finalPrice: number;
    newCode: string;
}