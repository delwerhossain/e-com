import { Types } from "mongoose";

export interface IReviews {
    reviewerId : Types.ObjectId;
    rating:number;
    comment:string;
    productId: Types.ObjectId;
    isDeleted : boolean;
    isActive : boolean;
    isBest : boolean
}