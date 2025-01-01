import { User } from "../user";
import { OrderDetail } from "./order.detail";
import { OrderTrack } from "./order.track";

export interface Order{

    id: number;
    user: User;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    status: string;
    orderDetails: OrderDetail[];
    orderTracks: OrderTrack[];
    activated: boolean;
    createdTime: Date;
    updatedTime: Date;
}