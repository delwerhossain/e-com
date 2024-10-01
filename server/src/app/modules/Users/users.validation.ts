import mongoose from 'mongoose';
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
  timestamp: z.preprocess(arg => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined), z.date().optional()),
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
  dateOfBirth: z.preprocess(arg => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined), z.date().optional()),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

// Vendor Profile Schema
const VendorProfileSchema = z.object({
  businessName: z.string(),
  avatarUrl: z.string().optional(),
  description: z.string().optional(),
  ratings: z.object({
    averageRating: z.number().default(0),
    reviewCount: z.number().default(0),
  }).optional(),
  businessCategoryID: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), { message: 'Invalid business Category ID' }),
  websiteUrl: z.string().optional(),
  socialMediaLinks: z.object({
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
  }).optional(),
  taxId: z.string().optional(),
  contactInfo: z.object({
    contactEmail: z.string().optional(),
    publicPhone: z.string().optional(),
    contactAddress: AddressSchema.optional(),
  }).optional(),
});


// User Schema
const userValidation = z.object({
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  emailVerified: z.boolean().default(false),
  passwordHash: z.string(),
  role: z.enum(['user', 'vendor']).default('user'),
  isDelete: z.boolean().default(false),
  isActive: z.boolean().default(true),
  lastLogin: LastLoginSchema.optional(),
  profile: UserProfileSchema.optional(),
  communicationPreferences: CommunicationPreferencesSchema.optional(),
});

// vendor  Schema
const vendorValidation = z.object({
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  emailVerified: z.boolean().default(false),
  passwordHash: z.string(),
  role: z.enum(['user', 'vendor']).default('user'),
  isDelete: z.boolean().default(false),
  isActive: z.boolean().default(true),
  lastLogin: LastLoginSchema.optional(),
  profile: VendorProfileSchema.optional(),
  communicationPreferences: CommunicationPreferencesSchema.optional(),
});

const vendorUpdateValidation = z.object({
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  emailVerified: z.boolean().optional(),
  passwordHash: z.string().optional(),
  profile: z.object({
    businessName: z.string().optional(),
    avatarUrl: z.string().optional(),
    description: z.string().optional(),
    ratings: z.object({
      averageRating: z.number().min(0).max(5).optional(),
      reviewCount: z.number().min(0).optional(),
    }).optional(),
    businessCategoryID: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), { message: 'Invalid business Category ID' }).optional(),
    websiteUrl: z.string().url().optional(),
    socialMediaLinks: z.object({
      facebook: z.string().url().optional(),
      twitter: z.string().url().optional(),
      instagram: z.string().url().optional(),
    }).optional(),
    taxId: z.string().optional(),
    contactInfo: z.object({
      contactEmail: z.string().email().optional(),
      publicPhone: z.string().optional(),
      contactAddress: AddressSchema.optional(),
    }).optional(),
  }).optional(),
  communicationPreferences: z.object({
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
  }).optional(),
}).strict();


// partial without refinement for update
const userUpdateValidation = userValidation.partial();

// Exported Validation Objects
export const UserValidation = {
  userValidation,
  userUpdateValidation, 
  vendorValidation,
  vendorUpdateValidation, 
  CommunicationPreferencesSchema,
  LastLoginSchema,
  AddressSchema

};
