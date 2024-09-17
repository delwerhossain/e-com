import { z } from 'zod';
import mongoose from 'mongoose';

// Zod schema for MongoDB ObjectId using refine
const objectIdSchema = z
  .string()
  .refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  })
  .transform(val => new mongoose.Types.ObjectId(val));

// Zod schema for IReviews
const reviewsSchema = z.object({
  reviewerId: objectIdSchema,
  rating: z
    .number()
    .min(1, { message: 'Rating must be at least 1' })
    .max(5, { message: 'Rating cannot exceed 5' }),
  comment: z.string().optional(),
  productId: objectIdSchema,
  isDeleted: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isBest: z.boolean().optional(),
});

// Zod schema for IProduct
export const ProductValidation = z.object({
  name: z.string().min(1, { message: 'Product Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  price: z.number().min(1, { message: 'Price must be at least 1' }),
  quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
  vendorId: objectIdSchema,
  subCategoryId: objectIdSchema.optional(),
  images: z.union([z.array(z.string()), z.string()]),

  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  isBestProduct: z.boolean().default(false),

  // Ratings schema
  ratings: z
    .object({
      averageRating: z.number().min(0).max(5).optional(),
      reviewsCount: z.number().min(0).optional(),
    })
    .optional(),

  // Optional reviews field validation
  reviews: z.array(reviewsSchema).optional(),

  // New fields added
  discountPercentage: z.number().min(0).max(100).optional(), // Discount percentage validation (0-100%)
  discountedPrice: z.number().min(0).optional(), // Price after discount
  outOfStock: z.boolean().default(false), // Out of stock flag
  weight: z.string().min(1, { message: 'Weight is required' }), // Weight validation
});
