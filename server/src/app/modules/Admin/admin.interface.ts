export interface IAdmin {
  email: string;
  passwordHash: string;
  role: 'superAdmin' | 'admin';
  isDelete: boolean;
  isActive: boolean;
  lastLogin?: ILogin;
  createdAt: Date;
  updatedAt: Date;
  profile: IAdminProfile;
  permissions: string[]; // Array of permissions
}

export interface ILogin { // Reused from earlier example
  timestamp?: Date;
  ip?: string;
}

export interface IAdminProfile {
  name: string;
  phoneNumber: string;
  avatarUrl?: string;
}
