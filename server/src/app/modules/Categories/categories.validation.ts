import { z } from 'zod';

export const categoryValidation = z.object({
  name: z
    .string()
    .nonempty({ message: 'Category name is required' })
    .transform(val => val.trim()),

  description: z
    .string()
    .optional()
    .transform(val => (val ? val.trim() : val)),

  isActive: z
    .boolean()
    .optional()
});
