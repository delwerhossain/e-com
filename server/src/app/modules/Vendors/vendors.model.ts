import { Schema, model } from 'mongoose';
import { Query } from 'mongoose';
import {
  IAddress,
  ICommunicationPreferences,
  ILoginDetails,
  IVendor,
  IVendorProfile,
} from './vendors.interface';

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
    default: () => new Date(),
  },
  ip: { type: String },
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
    publicPhone: { type: String, trim: true },
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



const VendorSchema = new Schema<IVendor>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
    },
    phoneNumber: { type: String, trim: true },

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
      enum:['vendor'],
      default: 'vendor',
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
    profile: VendorProfileSchema,
    communicationPreferences: CommunicationPreferencesSchema,
  },
  {
    timestamps: true,
  },
);

//! if vendor isDeleted is true then it will not be displayed , if admin request then it will be displayed
// Pre-hook for 'find'
VendorSchema.pre<Query<any, any>>('find', function (next) {
  const queryOptions = this.getOptions();

  // Check if the requester is not an admin
  if (!queryOptions?.isAdmin) {
    // Exclude vendors with isDelete: true for non-admins
    this.where({ isDelete: { $ne: true } });
  }
  next();
});
// // Pre-hook for 'save'
// VendorSchema.pre<Query<any, any>>('save', function (next) {
//   const queryOptions = this.getOptions();

//   // Check if the requester is not an admin
//   if (!queryOptions?.isAdmin) {
//     // Exclude vendors with isDelete: true for non-admins
//     this.where({ isDelete: { $ne: true } });
//   }
//   next();
// });



// Pre-hook for 'findOne'
VendorSchema.pre<Query<any, any>>('findOne', function (next) {
  const queryOptions = this.getOptions();

  if (!queryOptions?.isAdmin) {
    this.where({ isDelete: { $ne: true } });
  }
  next();
});

// Pre-hook for 'findOneAndUpdate'
VendorSchema.pre<Query<any, any>>('findOneAndUpdate', function (next) {
  const queryOptions = this.getOptions();

  if (!queryOptions?.isAdmin) {
    this.where({ isDelete: { $ne: true } });
  }
  next();
});

// Pre-hook for 'updateOne' (instead of 'update')
VendorSchema.pre<Query<any, any>>('updateOne', function (next) {
  const queryOptions = this.getOptions();

  if (!queryOptions?.isAdmin) {
    this.where({ isDelete: { $ne: true } });
  }
  next();
});

// Pre-hook for 'updateMany'
VendorSchema.pre<Query<any, any>>('updateMany', function (next) {
  const queryOptions = this.getOptions();

  if (!queryOptions?.isAdmin) {
    this.where({ isDelete: { $ne: true } });
  }
  next();
});

// Apply transformation for `dateOfBirth` when converting to JSON
VendorSchema.set('toJSON', {
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

//**** Date Time Zone *******
// VendorSchema.set('timestamps', {
//   currentTime: () => {
//     // Create a new Date object with the desired time zone offset (Asia/Dhaka)
//     const bangladeshTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
//     return new Date(bangladeshTime);
//   },
// });

//! for pass if need
// VendorSchema.pre('save', function (next:NextFunction) {
//   this.set('passwordHash', undefined, { strict: false });
//   next();
// });

export const VendorModel = model<IVendor>('Vendor', VendorSchema);
