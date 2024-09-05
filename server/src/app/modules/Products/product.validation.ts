import { z } from 'zod';
import mongoose from 'mongoose';

// Zod schema for MongoDB ObjectId using refine
const objectIdSchema = z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: 'Invalid ObjectId format',
    })
    .transform((val) => new mongoose.Types.ObjectId(val));

// Zod schema for TReviews
const zReviews = z.object({
    reviewer: z.string().optional(),
    rating: z.number().min(0).max(5).optional(),
    comment: z.string().optional(),
});

// Zod schema for IProduct
export const productValidation = z.object({
    name: z.string().min(1, { message: "Product Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    price: z.number().min(0, { message: "Price must be at least 0" }),
    quantity: z.number().min(0, { message: "Quantity must be at least 0" }),
    vendorId: objectIdSchema,
    subCategoryId: objectIdSchema.optional(),
    images: z.union([z.array(z.string()), z.string()]),
    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(false),
    isDeleted: z.boolean().default(false),
    isBestProduct: z.boolean().default(false),
    ratings: z.object({
        averageRating: z.number().min(0).max(5).optional(),
        reviewsCount: z.number().min(0).optional(),
        reviews: z.array(zReviews).optional(),
    }).optional(),

});