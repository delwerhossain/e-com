import { z } from 'zod';

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

    subCategoryImage: z
        .string({
            required_error: 'Subcategory image is required',
        }),

    categoryId: z
        .string({
            required_error: 'Category ID is required',
        })
        .refine((val) => /^[a-f\d]{24}$/i.test(val), {
            message: 'Invalid ObjectId format for categoryId',
        }),  // Custom validation to ensure ObjectId format

    categoryName: z
        .string()
        .optional()
        .transform((val) => (val ? val.trim() : val)),
});

export default subCategoryValidation;
