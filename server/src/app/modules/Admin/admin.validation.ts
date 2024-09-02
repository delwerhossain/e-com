import mongoose from 'mongoose';
import { z } from 'zod';

// MongoDB ObjectId validation using Mongoose
// const objectIdSchema = z
//   .string()
//   .refine(val => mongoose.Types.ObjectId.isValid(val), {
//     message: 'Invalid MongoDB ObjectId',
//   });

// Define the Zod validation schema for the Login sub-document
const LoginSchema = z.object({
  timestamp: z.date().optional(),
  ip: z.string().trim().optional(),
});

// Define the Zod validation schema for the Profile sub-document
const AdminProfileSchema = z.object({
  name: z.string().trim(),
  phoneNumber: z.string().trim(),
  avatarUrl: z.string().trim().optional(),
});

// Define the Zod validation schema for the Admin document
export const AdminValidationSchema = z.object({
  email: z.string().email().trim(),
  emailVerified: z.boolean().default(false),
  passwordHash: z
    .string()
    .min(6, 'Password must be at least 6 characters long'), // Example rule
  role: z.enum(['superAdmin', 'admin']),
  isDelete: z.boolean().default(false),
  isActive: z.boolean().default(true),
  lastLogin: LoginSchema.optional(),
  profile: AdminProfileSchema,
  permissions: z
    .array(
      z.enum([
        'manageUsers',
        'viewReports',
        'manageProducts',
        'manageOrders',
        'manageCategories',
        'managePromotions',
        'managePayments',
        'manageContent',
        'manageSettings',
      ]),
    )
    .min(1, 'At least one permission is required'),
});

// Define the Zod validation schema for the AdminAction document
export const AdminActionValidationSchema = z.object({
  adminId: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid admin Id',
  }),
  createdBy: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid creator Id',
  }),
  actionType: z.enum(['create', 'updatePermissions']),
  permissions: z
    .array(
      z.enum([
        'manageUsers',
        'viewReports',
        'manageProducts',
        'manageOrders',
        'manageCategories',
        'managePromotions',
        'managePayments',
        'manageContent',
        'manageSettings',
      ]),
    )
    .min(1, { message: 'At least one permission is required' }),
  timestamp: z.date().optional(),
});

const adminValidation = AdminValidationSchema;
const adminUpdateValidation = AdminValidationSchema.partial();
const adminActionValidation = AdminActionValidationSchema;
const adminActionUpdateValidation = AdminActionValidationSchema.partial();
export const AdminValidation = {
  adminValidation,
  adminUpdateValidation,
  adminActionValidation,
  adminActionUpdateValidation,
};
