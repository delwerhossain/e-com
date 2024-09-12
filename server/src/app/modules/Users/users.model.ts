import { Schema, model } from 'mongoose';
import { Query } from 'mongoose';
import {
  IAddress,
  ICommunicationPreferences,
  ILoginDetails,
  IUser,
  IUserProfile,
  IVendorProfile,
} from './users.interface';

// Address Schema
export const AddressSchema = new Schema<IAddress>({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  postalCode: { type: String, trim: true },
  country: { type: String, trim: true },
});

//! todo need to fix auto date take
// LastLogin Schema
const LastLoginSchema = new Schema<ILoginDetails>({
  timestamp: {
    type: Date,
    default: Date.now, // Automatically set to current date and time when created
    select: false, // Prevent it from being returned in queries
  },
  ip: { type: String },
});

// User Profile Schema
export const UserProfileSchema = new Schema<IUserProfile>({
  name: { type: String, trim: true },
  phoneNumber: { type: String, trim: true },
  avatarUrl: { type: String, trim: true },
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema,
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
});

// Vendor Profile Schema
export const VendorProfileSchema = new Schema<IVendorProfile>({
  businessName: { type: String, required: true, trim: true },
  avatarUrl: { type: String, trim: true },
  description: { type: String, trim: true },
  ratings: {
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  businessCategoryID: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    trim: true,
  },
  websiteUrl: { type: String, trim: true },
  socialMediaLinks: {
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    instagram: { type: String, trim: true },
  },
  taxId: { type: String, trim: true },
  contactInfo: {
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
    contactAddress: AddressSchema,
  },
});

// Communication Preferences Schema
export const CommunicationPreferencesSchema =
  new Schema<ICommunicationPreferences>({
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
  });

// Define Models
const UserProfileModel = model<IUserProfile>('UserProfile', UserProfileSchema);
const VendorProfileModel = model<IVendorProfile>(
  'VendorProfile',
  VendorProfileSchema,
);

// User Schema
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Ensure email is unique
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'vendor'],
      default: 'user',
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: LastLoginSchema,
    profile: {
      type: Schema.Types.Mixed,
      validate: {
        validator: function (v: any) {
          if (this.role === 'vendor') {
            // Validate Vendor Profile
            const vendorProfile = new VendorProfileModel(v);
            return vendorProfile
              .validate()
              .then(() => true)
              .catch(() => false);
          }
          // Validate User Profile
          const userProfile = new UserProfileModel(v);
          return userProfile
            .validate()
            .then(() => true)
            .catch(() => false);
        },
        message: 'Profile data is invalid for the given role',
      },
    },
    communicationPreferences: CommunicationPreferencesSchema,
  },
  { timestamps: true },
);

//! if user isDeleted is true then it will not be displayed , if admin request then it will be displayed

// Pre-hook for 'find'
UserSchema.pre<Query<any, any>>('find', function (next) {
  if (!this.getOptions()?.isAdmin) {
    this.where({ isDelete: { $ne: true } });
  }
  next();
});

// Pre-hook for 'findOne'
UserSchema.pre<Query<any, any>>('findOne', function (next) {
  if (!this.getOptions()?.isAdmin) {
    this.where({ isDelete: { $ne: true } });
  }
  next();
});

// Pre-hook for 'findOneAndUpdate'
UserSchema.pre<Query<any, any>>('findOneAndUpdate', function (next) {
  if (!this.getOptions()?.isAdmin) {
    this.where({ isDelete: { $ne: true } });
  }
  next();
});

// Pre-hook for 'updateOne' (instead of 'update')
UserSchema.pre<Query<any, any>>('updateOne', function (next) {
  if (!this.getOptions()?.isAdmin) {
    this.where({ isDelete: { $ne: true } });
  }
  next();
});

// Pre-hook for 'updateMany'
UserSchema.pre<Query<any, any>>('updateMany', function (next) {
  if (!this.getOptions()?.isAdmin) {
    this.where({ isDelete: { $ne: true } });
  }
  next();
});

// Apply transformation for `dateOfBirth` when converting to JSON
UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    // Format the dateOfBirth field as "YYYY-MM-DD"
    if (ret.profile && ret.profile.dateOfBirth) {
      ret.profile.dateOfBirth = ret.profile.dateOfBirth
        .toISOString()
        .split('T')[0];
    }
    return ret;
  },
});

//! for pass if need
// UserSchema.pre('save', function (next:NextFunction) {
//   this.set('passwordHash', undefined, { strict: false });
//   next();
// });

export const UserModel = model<IUser>('User', UserSchema);
