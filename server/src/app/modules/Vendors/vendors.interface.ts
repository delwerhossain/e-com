import { Types } from 'mongoose';

// Address Interface
export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

// Login Details Interface
export interface ILoginDetails {
  timestamp?: Date;
  ip?: string;
}

// Communication Preferences Interface
export interface ICommunicationPreferences {
  email: boolean;
  sms: boolean;
  pushNotifications: boolean;
}

// Vendor Profile Interface
export interface IVendorProfile {
  businessName: string;
  avatarUrl?: string;
  description?: string;
  ratings?: {
    averageRating: number;
    reviewCount: number;
  };
  businessCategoryID?: Types.ObjectId;
  websiteUrl?: string;
  socialMediaLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  taxId?: string;
  contactInfo?: {
    contactEmail?: string;
    publicPhone?: string;
    contactAddress?: IAddress;
  };
}

// Vendor Interface
export interface IVendor {
  email: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  passwordHash: string;
  role: 'vendor';
  isDelete?: boolean;
  isActive?: boolean;
  lastLogin?: ILoginDetails;
  profile?: IVendorProfile; // Conditional profile based on role
  communicationPreferences?: ICommunicationPreferences;
}
