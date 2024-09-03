import { z } from 'zod';
import mongoose from 'mongoose';

const objectIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format for categoryId',
});

const subCategoryValidation = z.object({
    name: z
        .string({
            required_error: 'Subcategory name is required',
        })
        .min(1, 'Subcategory name cannot be empty')
        .max(255, 'Subcategory name must be at most 255 characters long')
        .transform((val) => val.trim()),

    description: z
        .string()
        .optional()
        .transform((val) => (val ? val.trim() : val)),

    isActive: z.boolean().default(true),

    isDeleted: z.boolean().default(false),

    subCategoryImage: z.string({
        required_error: 'Subcategory image is required',
    }),

    categoryId: objectIdSchema.transform((val) => new mongoose.Types.ObjectId(val)),

    categoryName: z
        .string()
        .optional()
        .transform((val) => (val ? val.trim() : val)),
});

export default subCategoryValidation;
