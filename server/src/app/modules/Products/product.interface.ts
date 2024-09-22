import { Types } from 'mongoose';
export interface IProduct {
  name: string;
  description: string;
  price: number;
  color?: string;
  quantity: number;
  vendorId: Types.ObjectId;
  subCategoryId?: Types.ObjectId;
  categoryId?: Types.ObjectId;
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
  delivery?: 'Free' | 'Pay';
  deliveryCharge?: number;
  restockDate?: string; // Expected restock date for out-of-stock products
  weight?: string;
  size?: string;
  maxOrderQuantity?: number; // Maximum order quantity allowed
}
