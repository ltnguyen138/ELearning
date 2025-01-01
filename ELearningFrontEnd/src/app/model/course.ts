import {Category} from "./category";
import {User} from "./user";

export interface Course{

    id: number;
    name: string;
    alias: string;
    category: Category;
    description: string;
    skillLevel: string;
    price: number;
    image: string | null;
    instructor: User;
    purchasedCount: number;
    averageRating: number;
    ratingCount: number;
    activated: boolean,
    createdTime: Date,
    updatedTime: Date,
    discountPrice: number,
    moderationRequested: boolean,
    approvalStatus: string,
    deleted: boolean
}