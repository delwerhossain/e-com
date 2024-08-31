import { Schema, model } from 'mongoose';
import { IAddress, IUser } from './users.interface';

// Define the Address sub-schema
export const AddressSchema = new Schema<IAddress>({
  street: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String },
});

export const LastLoginSchema = new Schema({
  timestamp: { type: Date },
  ip: { type: String },
});

export const ProfileSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  avatarUrl: { type: String },
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema,
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
});

export const CommunicationPreferencesSchema = new Schema({
  email: { type: Boolean, default: true },
  sms: { type: Boolean, default: true },
  pushNotifications: { type: Boolean, default: true },
});

// User schema
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
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
    profile: ProfileSchema,
    communicationPreferences: CommunicationPreferencesSchema,
  },
  { timestamps: true },
);

// User Model
export const UserModel = model<IUser>('User', UserSchema);
