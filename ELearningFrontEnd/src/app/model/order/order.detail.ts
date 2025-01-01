import {Course} from "../course";
import { Discount } from "../discount";

export interface OrderDetail{

    id: number;
    course: Course;
    discount: Discount | null;
    price: number;
    discountPrice: number;
    finalPrice: number;
    refunded: boolean;
}