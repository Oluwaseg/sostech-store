export type UserRole = 'user' | 'admin' | 'moderator';

export interface UserAvatar {
  publicId: string;
  url: string;
}

export interface User {
  // Core
  _id: string;
  name: string;
  email: string;
  role: UserRole;

  // Profile
  username: string;
  avatar?: UserAvatar;
  bio?: string;
  birthday?: string; // ISO string from backend

  // Contact
  phone?: string;

  // Account state
  isEmailVerified: boolean;
  isActive: boolean;
  lastLogin?: string;

  // Meta
  referralCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditUser {
  name?: string;
  email?: string;
  role?: 'user' | 'admin' | 'moderator';
  username?: string;
  avatar?: {
    publicId?: string;
    url?: string;
  };
  bio?: string | null;
  birthday?: string; // ISO string
  phone?: string;
  isEmailVerified?: boolean;
  isActive?: boolean;
  referralCode?: string;
}
