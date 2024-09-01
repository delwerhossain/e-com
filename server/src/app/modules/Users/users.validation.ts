import { z } from 'zod';

// Address Schema
const AddressSchema = z.object({
  street: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
  postalCode: z.string().trim().optional(),
  country: z.string().trim().optional(),
});

// LastLogin Schema
const LastLoginSchema = z.object({
  timestamp: z.date().optional(),
  ip: z.string().optional(),
});

// User Profile Schema
const UserProfileSchema = z.object({
  name: z.string().trim(),
  phoneNumber: z.string().trim(),
  avatarUrl: z.string().trim().optional(),
  shippingAddress: AddressSchema.optional(),
  billingAddress: AddressSchema.optional(),
  dateOfBirth: z.date().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

// Vendor Profile Schema
const VendorProfileSchema = z.object({
  businessName: z.string().trim(),
  businessAddress: z.string().trim(),
  phoneNumber: z.string().trim(),
  avatarUrl: z.string().trim().optional(),
  description: z.string().trim().optional(),
  ratings: z.object({
    averageRating: z.number().default(0),
    reviewCount: z.number().default(0),
  }).optional(),
  businessCategory: z.string().trim().optional(),
  websiteUrl: z.string().trim().optional(),
  socialMediaLinks: z.object({
    facebook: z.string().trim().optional(),
    twitter: z.string().trim().optional(),
    instagram: z.string().trim().optional(),
  }).optional(),
  taxId: z.string().trim().optional(),
  contactInfo: z.object({
    contactEmail: z.string().trim().optional(),
    contactPhone: z.string().trim().optional(),
    contactAddress: z.string().trim().optional(),
  }).optional(),
});

// User Schema with Conditional Profile Validation
const UserSchema = z.object({
  email: z.string().email().trim(),
  emailVerified: z.boolean().default(false),
  passwordHash: z.string().trim(),
  role: z.enum(['user', 'vendor']),
  isDelete: z.boolean().default(false),
  isActive: z.boolean().default(true),
  lastLogin: LastLoginSchema.optional(),
  profile: z.union([
    UserProfileSchema, // If role is 'user'
    VendorProfileSchema, // If role is 'vendor'
  ]),
  communicationPreferences: z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(true),
    pushNotifications: z.boolean().default(true),
  }).optional(),
});

const userValidation = UserSchema;
const userUpdateValidation = UserSchema.partial();
export const UserValidation = {
  userValidation,
  userUpdateValidation,
};
