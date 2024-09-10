import { Schema, model, Types } from 'mongoose';
import { IReviews } from './reviews.interface';

// Reviews Schema Definition
const ReviewSchema = new Schema<IReviews>(
  {
    reviewerId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Reviewer ID is required'],
      //TODO->   ref: 'User',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      min: [10, 'Comment must be at least 10 characters long'],
      max: [1000, 'Comment cannot exceed 1000 characters'],
    },
    productId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Product ID is required'],
      ref: 'Product',
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isBest: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// Model export
export const ReviewsModel = model<IReviews>('Reviews', ReviewSchema);
