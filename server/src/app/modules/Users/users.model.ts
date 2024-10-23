import { Schema, model } from 'mongoose';
import { Query } from 'mongoose';
import {
  IAddress,
  ICommunicationPreferences,
  ILoginDetails,
  IUser,
  IUserProfile,
  UserModel,
} from './users.interface';
import bcrypt from 'bcrypt';

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

// User Profile Schema
export const UserProfileSchema = new Schema<IUserProfile>({
  name: { type: String, trim: true },
  avatarUrl: { type: String, trim: true },
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema,
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
});

// Communication Preferences Schema
export const CommunicationPreferencesSchema =
  new Schema<ICommunicationPreferences>({
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
  });

// User Schema

// User Schema
const UserSchema = new Schema<IUser>(
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
      select: false,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user'],
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
    profile: UserProfileSchema,
    communicationPreferences: CommunicationPreferencesSchema,
  },
  {
    timestamps: true,
  },
);

//! if user isDeleted is true then it will not be displayed , if admin request then it will be displayed
// Pre-hook for 'find'
UserSchema.pre<Query<any, any>>('find', function (next) {
  const queryOptions = this.getOptions();

  // Check if the requester is not an admin
  if (!queryOptions?.isAdmin) {
    // Exclude users with isDelete: true for non-admins
    this.where({ isDelete: { $ne: true } });
  }
  next();
});
// // Pre-hook for 'save'
// UserSchema.pre<Query<any, any>>('save', function (next) {
//   const queryOptions = this.getOptions();

//   // Check if the requester is not an admin
//   if (!queryOptions?.isAdmin) {
//     // Exclude users with isDelete: true for non-admins
//     this.where({ isDelete: { $ne: true } });
//   }
//   next();
// });

// Pre-hook for 'findOne'
UserSchema.pre<Query<any, any>>('findOne', function (next) {
  const queryOptions = this.getOptions();

  if (!queryOptions?.isAdmin) {
    this.where({ isDelete: { $ne: true } });
  }
  next();
});

// Pre-hook for aggregate for delete data validation
//! TODO need update for admin , can check deleted user 
UserSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// Pre-hook for 'findOneAndUpdate'
UserSchema.pre<Query<any, any>>('findOneAndUpdate', function (next) {
  const queryOptions = this.getOptions();

  if (!queryOptions?.isAdmin) {
    this.where({ isDelete: { $ne: true } });
  }
  next();
});

// Pre-hook for 'updateOne' (instead of 'update')
UserSchema.pre<Query<any, any>>('updateOne', function (next) {
  const queryOptions = this.getOptions();

  if (!queryOptions?.isAdmin) {
    this.where({ isDelete: { $ne: true } });
  }
  next();
});

// Pre-hook for 'updateMany'
UserSchema.pre<Query<any, any>>('updateMany', function (next) {
  const queryOptions = this.getOptions();

  if (!queryOptions?.isAdmin) {
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

// 
UserSchema.statics.isUserExistsByCustomId = async function (email: string) {
  return await this.findOne({ email }).select('+password');
  
}
UserSchema.statics.isPasswordMatched = async function (
  requestPassword: string,  
  storedPassword: string
) {
  return await bcrypt.compare(requestPassword, storedPassword);
  
}


//**** Date Time Zone *******
// UserSchema.set('timestamps', {
//   currentTime: () => {
//     // Create a new Date object with the desired time zone offset (Asia/Dhaka)
//     const bangladeshTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
//     return new Date(bangladeshTime);
//   },
// });

//! for pass if need
// UserSchema.pre('save', function (next:NextFunction) {
//   this.set('passwordHash', undefined, { strict: false });
//   next();
// });

export const User = model<IUser, UserModel>('User', UserSchema);

