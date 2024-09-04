import { z } from 'zod';

export const categoryValidation = z.object({
  name: z
    .string({
      required_error: 'Category name is required',
    })
    .nonempty({ message: 'Category name is required' })
    .transform(val => val.trim()),

  description: z
    .string()
    .optional()
    .transform(val => (val ? val.trim() : val)),

  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  categoryImage: z
    .string({
      required_error: 'Category image is required',
    })
    .url('Invalid URL format for Category image').nonempty({ message: 'URL cant be empty' }),
});
