import { Schema, model } from 'mongoose';
import { IProduct } from './product.interface';

// Product schema definition
const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product Name is required'],
      unique: true,
      trim: true,
    },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: false,
    },
    images: { type: [String], required: true },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isBestProduct: { type: Boolean, default: false },

    // Ratings embedded as a subdocument
    ratings: {
      averageRating: { type: Number, default: 0, min: 0, max: 5 },
      reviewsCount: { type: Number, default: 0 },
    },

    // Optional reviews field as an array of subdocuments referencing IReviews
    reviews: {
      type: [
        {
          reviewerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          rating: { type: Number, required: true, min: 1, max: 5 },
          comment: { type: String },
          productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
          },
          isDeleted: { type: Boolean, default: false },
          isActive: { type: Boolean, default: true },
          isBest: { type: Boolean, default: false },
        },
      ],
      default: [], // Set default to an empty array
    },

    // Discount and pricing fields
    discountPercentage: { type: Number, default: 0 }, // Default discount 0%
    discountedPrice: { type: Number }, // Calculated discounted price (can be handled in business logic)

    // Stock management
    outOfStock: { type: Boolean, default: false }, // Indicate if the product is out of stock

    // Product weight for shipping calculations
    weight: { type: String, required: [true, 'Product weight is required'] },
  },
  { timestamps: true }, // Automatically handle createdAt and updatedAt
);

// 3. Create a Model
export const ProductModel = model<IProduct>('Product', productSchema);
