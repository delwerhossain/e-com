import { z } from 'zod';

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
  passwordHash: z.string().min(6, 'Password must be at least 6 characters long'), // Example rule
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
      ])
    )
    .min(1, 'At least one permission is required'),
});


// Define the Zod validation schema for the AdminAction document
export const AdminActionValidation = z.object({
  adminId: z.string().refine((value) => value.match(/^[0-9a-fA-F]{24}$/), {
    message: 'Invalid Admin ID',
  }),
  createdBy: z.string().refine((value) => value.match(/^[0-9a-fA-F]{24}$/), {
    message: 'Invalid Creator ID',
  }),
  actionType: z.enum(['create', 'updatePermissions']),
  permissions: z.array(z.enum([
    'manageUsers',
    'viewReports',
    'manageProducts',
    'manageOrders',
    'manageCategories',
    'managePromotions',
    'managePayments',
    'manageContent',
    'manageSettings',
  ])).min(1, { message: 'At least one permission is required' }),
  timestamp: z.date().optional(),
});