import { Schema, model, Types } from 'mongoose';
import { IAdmin, IAdminAction, IAdminProfile } from './admin.interface';
import { ILoginDetails } from '../Users/users.interface';

// Define the Login schema
const LoginSchema = new Schema<ILoginDetails>({
  timestamp: { type: Date, default: Date.now },
  ip: { type: String, trim: true },
});

// Define the Profile schema
const AdminProfileSchema = new Schema<IAdminProfile>({
  name: { type: String, trim: true },
  phoneNumber: { type: String, trim: true },
  avatarUrl: { type: String, trim: true },
});

// Define the Admin schema
const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
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
      default: false,
    },
    lastLogin: LoginSchema,
    profile: AdminProfileSchema,
    permissions: {
      type: [String],
      enum: [
        'manageUsers',
        'viewReports',
        'manageProducts',
        'manageOrders',
        'manageCategories',
        'managePromotions',
        'managePayments',
        'manageContent',
        'manageSettings',
      ],
      required: [true, 'At least one permission is required'],
      validate: {
        validator: function (value: string[]) {
          return value.length > 0;
        },
        message: 'At least one permission is required',
      },
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  },
);

// Pre-save hook to set all permissions for superAdmin
AdminSchema.pre('save', function (next) {
  if (this.role === 'superAdmin') {
    this.permissions = [
      'manageUsers',
      'viewReports',
      'manageProducts',
      'manageOrders',
      'manageCategories',
      'managePromotions',
      'managePayments',
      'manageContent',
      'manageSettings',
    ];
  }
  next();
});

// Define the AdminAction schema
const AdminActionSchema = new Schema<IAdminAction>(
  {
    adminId: {
      type: Schema.Types.ObjectId, // Reference to the admin being created
      ref: 'Admin',
      required: [true, 'Admin ID is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId, // Reference to the superuser who created this admin
      ref: 'Admin',
      required: [true, 'Creator is required'],
    },
    actionType: {
      type: String,
      enum: ['create', 'updatePermissions'], // Actions being logged
      required: [true, 'Action type is required'],
    },
    permissions: {
      type: [String], // Store the permissions granted or updated
      enum: [
        'manageUsers',
        'viewReports',
        'manageProducts',
        'manageOrders',
        'manageCategories',
        'managePromotions',
        'managePayments',
        'manageContent',
        'manageSettings',
      ],
      required: [true, 'Permissions are required'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  },
);

// Admin Model
export const AdminModel = model<IAdmin>('Admin', AdminSchema);

// Admin Action Log Model
export const AdminActionModel = model('AdminAction', AdminActionSchema);
