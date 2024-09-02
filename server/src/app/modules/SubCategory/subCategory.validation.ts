import { z } from 'zod';

const subCategorySchema = z.object({
    name: z
        .string({
            required_error: 'Subcategory name is required',
        })
        .trim()
        .min(1, 'Subcategory name cannot be empty')
        .max(255, 'Subcategory name must be at most 255 characters long'),

    description: z
        .string()
        .trim()
        .optional(),

    isActive: z.boolean().optional().default(true),

    isDeleted: z.boolean().optional().default(false),

    subCategoryImage: z
        .string({
            required_error: 'Subcategory image is required',
        })
        .url('Invalid URL format for subcategory image'),

    categoryId: z
        .string({
            required_error: 'Category ID is required',
        })
        .length(24, 'Category ID must be a valid 24-character ObjectId'),

    categoryName: z.string().optional()
});

export default subCategorySchema;
