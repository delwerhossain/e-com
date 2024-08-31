export interface IUser {
  email: String;
  passwordHash: String;
  role: 'superAdmin' | 'admin' | 'user' | 'vendor';
  isDelete: Boolean;
  isActive: Boolean;
  lastLogin?: TLoginDetails; // To track the last login time
  createdAt?: Date; // To track when the user was created
  updatedAt?: Date; // To track when the user profile was last updated
  profile: IProfile;
  communicationPreferences?: ICommunicationPreferences; // To manage how users prefer to be contacted
}

export interface ICommunicationPreferences {
  email: Boolean;
  sms: Boolean;
  pushNotifications: Boolean;
}

export interface IProfile {
  name: String;
  address: String;
  phoneNumber: string;
  avatarUrl?: string; // URL for the user's profile picture
  shippingAddress?: IAddress;
  billingAddress?: IAddress;
  dateOfBirth?: Date; // For personalized experiences or promotions
  gender?: 'male' | 'female' | 'other'; // For user demographics analysis
}
export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface TLoginDetails {
  timestamp: Date;
  ip: string;
}
