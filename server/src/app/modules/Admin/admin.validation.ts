import { z } from 'zod';

// Define the Login schema
export const LoginSchema = z.object({
  timestamp: z.date().optional(),
  ip: z.string().optional(),
});

// Define the Admin Profile schema
export const AdminProfileSchema = z.object({
  name: z.string().nonempty("Name is required"),
  phoneNumber: z.string().nonempty("Phone number is required"),
  avatarUrl: z.string().url("Invalid URL format").optional(),
});

// Define the Admin schema
export const AdminValidation = z.object({
  email: z.string().email("Invalid email format"),
  passwordHash: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(['superAdmin', 'admin'], {
    errorMap: () => ({ message: "Role must be either 'superAdmin' or 'admin'" }),
  }),
  isDelete: z.boolean().default(false),
  isActive: z.boolean().default(true),
  lastLogin: LoginSchema.optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
  profile: AdminProfileSchema,
  permissions: z.array(z.string()).min(1, "At least one permission is required"),
});

// Example usage:
// const validationResult = AdminValidation.safeParse(adminInput);
