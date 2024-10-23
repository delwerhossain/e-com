import { z } from 'zod';

// Address Schema
const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

// LastLogin Schema
const LastLoginSchema = z.object({
  timestamp: z.preprocess(
    arg =>
      typeof arg === 'string' || arg instanceof Date
        ? new Date(arg)
        : undefined,
    z.date().optional(),
  ),
  ip: z.string().optional(),
});

// Communication Preferences Schema
const CommunicationPreferencesSchema = z.object({
  email: z.boolean().default(true),
  sms: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
});

// User Profile Schema
const UserProfileSchema = z.object({
  name: z.string().optional(),
  avatarUrl: z.string().optional(),
  shippingAddress: AddressSchema.optional(),
  billingAddress: AddressSchema.optional(),
  dateOfBirth: z.preprocess(
    arg =>
      typeof arg === 'string' || arg instanceof Date
        ? new Date(arg)
        : undefined,
    z.date().optional(),
  ),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

// User Schema
const userValidation = z.object({
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  emailVerified: z.boolean().default(false),
  passwordHash: z.string(),
  role: z.enum(['user']).default('user'),
  isDelete: z.boolean().default(false),
  isActive: z.boolean().default(true),
  lastLogin: LastLoginSchema.optional(),
  profile: UserProfileSchema.optional(),
  communicationPreferences: CommunicationPreferencesSchema.optional(),
});

// partial without refinement for update
const userUpdateValidation = userValidation.partial();

// Exported Validation Objects
export const UserValidation = {
  userValidation,
  userUpdateValidation,
  CommunicationPreferencesSchema,
  LastLoginSchema,
  AddressSchema,
};
