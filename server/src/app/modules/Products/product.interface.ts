import { Types } from "mongoose";

export type TReviews = {
    reviewer?: string;
    rating?: number;
    comment?: string;
}


export interface IProduct {
    name: string;
    description: string;
    price: number;
    quantity: number;
    vendorId: Types.ObjectId;
    subCategoryId?: Types.ObjectId;
    images: string[] | string;
    ratings?: {
        averageRating?: number;
        reviewsCount?: number;
        reviews?: TReviews[]
    }
}