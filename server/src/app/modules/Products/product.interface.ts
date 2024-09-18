import { Types } from 'mongoose';
import { IReviews } from '../Reviews/reviews.interface';
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
  //not come form the vendor when he create a new product.......
  ratings?: {
    averageRating?: number;
    reviewsCount?: number;
  };
  reviews?: Types.ObjectId[];
  discountPercentage?: number; // Discount percentage for sale items
  discountedPrice?: number;
  outOfStock?: boolean;
  weight: string;
}
