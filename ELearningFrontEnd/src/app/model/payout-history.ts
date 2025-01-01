import {User} from "./user";

export interface PayoutHistory {

    id: number;
    amount: number;
    payoutId: string;
    payoutDate: string;
    user: User;
    totalEarning: number;
    globalDiscount: number;
    courseDiscount: number;
    fee: number;
}