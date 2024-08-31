import { Schema, model } from 'mongoose';
import { IAdmin } from './admin.interface';

// Define the Login schema
const LoginSchema = new Schema({
  timestamp: { type: Date },
  ip: { type: String },
});

// Define the Profile schema
const AdminProfileSchema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  avatarUrl: { type: String },
});

// Define the Admin schema
const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['superAdmin', 'admin'],
      required: [true, 'Role is required'],
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: LoginSchema,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    profile: AdminProfileSchema,
    permissions: {
      type: [String],
      required: [true, 'Permissions are required'],
    },
  },
  {
    timestamps: true, // This automatically adds `createdAt` and `updatedAt` fields
  },
);

// Admin Model
export const AdminModel = model<IAdmin>('Admin', AdminSchema);
