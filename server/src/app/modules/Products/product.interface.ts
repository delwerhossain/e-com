import { Types } from "mongoose";
export interface IProduct {
    name: string;
    description: string;
    price: number;
    quantity: number;
    vendorId: Types.ObjectId;
    subCategoryId?: Types.ObjectId;
    images: string[] | string;
    isFeatured?: boolean;
    isActive?: boolean;
    isDeleted?: boolean;
    isBestProduct?: boolean;
    ratings?: {
        averageRating?: number;
        reviewsCount?: number;
    }
 
}