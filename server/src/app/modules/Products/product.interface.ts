import { Types } from "mongoose";

interface IProduct {
    name: string;
    description: string;
    price: number;
    quantity: number;
    vendorId: Types.ObjectId;
    subCategoryId: Types.ObjectId;
    images: string[] | string;
    ratings: {
        averageRating: number;
        reviewsCount: number;
        reviews: {
            reviewer: string;
            rating: number;
            comment: string;
            createdAt: Date;
        }[]
    }
}