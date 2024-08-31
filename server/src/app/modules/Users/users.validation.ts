import { z } from 'zod';

// Define the Address schema
export const AddressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

// Define the Login schema
export const LoginSchema = z.object({
  timestamp: z.date(),
  ip: z.string(),
});

// Define the Profile schema
export const ProfileSchema = z.object({
  name: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
  avatarUrl: z.string().url().optional(),
  shippingAddress: AddressSchema.optional(),
  billingAddress: AddressSchema.optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

// Define the Communication Preferences schema
export const CommPrefsSchema = z.object({
  email: z.boolean(),
  sms: z.boolean(),
  pushNotifications: z.boolean(),
});

// Define the User schema
export const UserValidation = z.object({
  email: z.string().email(),
  passwordHash: z.string().min(8), // Ensures the password hash has at least 8 characters
  role: z.enum(['user', 'vendor']).default('user'),
  isDelete: z.boolean().default(false),
  isActive: z.boolean().default(true),
  lastLogin: LoginSchema.optional(),
  profile: ProfileSchema,
  communicationPreferences: CommPrefsSchema.optional(),
});

// Example usage:
// const validationResult = UserValidation.safeParse(userInput);
