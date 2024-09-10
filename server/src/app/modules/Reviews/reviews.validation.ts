import { z } from 'zod';
import mongoose from 'mongoose';

// Custom validation for ObjectId type as a string and transforming it into ObjectId
const objectIdSchema = z
  .string()
  .refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  })
  .transform(val => new mongoose.Types.ObjectId(val));

// Zod validation schema for IReviews using objectIdSchema
const reviewsValidation = z.object({
  reviewerId: objectIdSchema,
  rating: z
    .number({
      required_error: 'Rating is required',
    })
    .min(1, { message: 'Rating must be at least 1' })
    .max(5, { message: 'Rating cannot exceed 5' }),
  comment: z
    .string({
      required_error: 'Comment is required',
    })
    .min(10, { message: 'Comment must be at least 10 characters long' })
    .max(1000, { message: 'Comment cannot exceed 1000 characters' }),
  productId: objectIdSchema,
  isActive: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  isBest: z.boolean().default(false),
});

export default reviewsValidation;
