import { Model, Schema } from "mongoose";

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

// User Profile Interface
export interface IUserProfile {
  name: string;
  avatarUrl?: string;
  shippingAddress?: IAddress;
  billingAddress?: IAddress;
  dateOfBirth?: Date | string;
  gender?: 'male' | 'female' | 'other';
}

// User Interface
export interface IUser {
  email: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  passwordHash: string;
  role: 'user';
  isDelete?: boolean;
  isActive?: boolean;
  lastLogin?: ILoginDetails;
  profile?: IUserProfile; // Conditional profile based on role
  communicationPreferences?: ICommunicationPreferences;
}


export interface UserModel extends Model<IUser> {
  isUserExistsByCustomId(email: string): Promise<IUser>;
  isPasswordMatched(requestPassword: string, storedPassword: string): Promise<IUser>;

}

