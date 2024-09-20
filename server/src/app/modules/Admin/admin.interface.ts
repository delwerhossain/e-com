import { Document, Types } from 'mongoose';

// Define the LoginDetails interface
export interface ILoginDetails {
  timestamp?: Date;
  ip?: string;
}

// Define the AdminProfile interface
export interface IAdminProfile {
  name?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

// Define the Admin interface
export interface IAdmin extends Document {
  email: string;
  emailVerified?: boolean;
  passwordHash: string;
  role: 'superAdmin' | 'admin';
  isDelete?: boolean;
  isActive?: boolean;
  lastLogin?: ILoginDetails;
  profile?: IAdminProfile;
  permissions?: Array<
    | 'manageUsers'
    | 'viewReports'
    | 'manageProducts'
    | 'manageOrders'
    | 'manageCategories'
    | 'managePromotions'
    | 'managePayments'
    | 'manageContent'
    | 'manageSettings'
  >;
}

// Define a new interface for creating an admin
export interface ICreateAdminInput {
  email: string;
  emailVerified?: boolean;
  passwordHash: string;
  role: 'superAdmin' | 'admin';
  isActive?: boolean;
  profile?: IAdminProfile;
  permissions?: IAdmin['permissions'];
}

// Define the AdminAction interface
export interface IAdminAction extends Document {
  adminId: Types.ObjectId; // Reference to the admin being created
  createdBy: Types.ObjectId; // Reference to the superuser who created this admin
  actionType: 'create' | 'updatePermissions'; // Actions being logged
  permissions: Array<
    | 'manageUsers'
    | 'viewReports'
    | 'manageProducts'
    | 'manageOrders'
    | 'manageCategories'
    | 'managePromotions'
    | 'managePayments'
    | 'manageContent'
    | 'manageSettings'
  >;
  timestamp?: Date;
}
