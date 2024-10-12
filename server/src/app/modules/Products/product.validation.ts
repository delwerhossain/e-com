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
export const ProductValidation = z
  .object({
    name: z.string().min(1, { message: 'Product Name is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    price: z.number().min(1, { message: 'Price must be at least 1' }),
    quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
    vendorId: objectIdSchema,
    subCategoryId: objectIdSchema.optional(),
    categoryId: objectIdSchema.optional(),
    images: z.union([z.array(z.string()), z.string()]),
    color: z.string().optional(),
    categoryName: z.string(),
    subcategoryName: z.string().optional(),
    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true),
    isDeleted: z.boolean().default(false),
    isBestProduct: z.boolean().default(false),

    // Ratings schema
    ratings: z
      .object({
        averageRating: z.number().min(0).max(5).optional(),
        reviewsCount: z.number().min(0).optional(),
      })
      .optional(),

    reviews:
      z.array(objectIdSchema).optional() || z.array(reviewsSchema).optional,

    // Discount and stock management
    discountPercentage: z.number().min(0).max(100).optional(),
    discountedPrice: z.number().min(0).optional(),
    outOfStock: z.boolean().default(false),

    // Delivery and restock logic
    delivery: z.enum(['Free', 'Pay']).default('Pay'),
    deliveryCharge: z.number().min(0).optional(), // Mark as optional first

    restockDate: z.string().optional(),

    // Shipping and size management
    weight: z.string().min(1, { message: 'Weight is required' }).optional(),
    size: z.string().optional(),
    maxOrderQuantity: z.number().min(1).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    // Conditional validation for deliveryCharge
    if (data.delivery === 'Pay' && data.deliveryCharge === undefined) {
      ctx.addIssue({
        code: 'custom',
        message: 'Delivery charge is required when delivery is Pay',
        path: ['deliveryCharge'],
      });
    }
  });

//update Validation ..........

// Zod schema for updating IProduct
export const ProductUpdateValidation = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z
      .number()
      .min(1, { message: 'Price must be at least 1' })
      .optional(),
    quantity: z
      .number()
      .min(1, { message: 'Quantity must be at least 1' })
      .optional(),
    vendorId: objectIdSchema.optional(),
    subCategoryId: objectIdSchema.optional(),
    categoryId: objectIdSchema.optional(),
    images: z.union([z.array(z.string()), z.string()]).optional(),

    color: z.string().optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
    isBestProduct: z.boolean().optional(),

    // Ratings schema
    ratings: z
      .object({
        averageRating: z.number().min(0).max(5).optional(),
        reviewsCount: z.number().min(0).optional(),
      })
      .optional(),

    reviews: z.array(objectIdSchema).optional(),

    // Discount and stock management
    discountPercentage: z.number().min(0).max(100).optional(),
    discountedPrice: z.number().min(0).optional(),
    outOfStock: z.boolean().optional(),

    // Delivery and restock logic
    delivery: z.enum(['Free', 'Pay']).optional(),
    deliveryCharge: z.number().min(0).optional(),

    restockDate: z.string().optional(),

    // Shipping and size management
    weight: z.string().optional(),
    size: z.string().optional(),
    maxOrderQuantity: z.number().min(1).optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    // Conditional validation for deliveryCharge
    if (data.delivery === 'Pay' && data.deliveryCharge === undefined) {
      ctx.addIssue({
        code: 'custom',
        message: 'Delivery charge is required when delivery is Pay',
        path: ['deliveryCharge'],
      });
    }
  });
