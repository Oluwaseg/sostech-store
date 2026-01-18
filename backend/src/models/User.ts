import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;

  // Core
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin' | 'moderator';

  // Profile
  username: string;
  avatar?: {
    publicId: string;
    url: string;
  };
  bio?: string;
  birthday?: Date;

  // Contact
  phone?: string;

  // Auth / Security
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpire?: Date;

  resetPasswordToken?: string;
  resetPasswordExpire?: Date;

  googleId?: string;

  // Referral
  referralCode?: string;

  // Account state
  isActive: boolean;
  lastLogin?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: false, // Not required for OAuth users
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ['user', 'admin', 'moderator'],
      default: 'user',
    },

    username: {
      type: String,
      unique: true,
      index: true,
    },

    avatar: {
      publicId: String,
      url: String,
    },

    bio: {
      type: String,
      maxlength: 200,
    },

    birthday: Date,

    phone: String,

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: String,
    emailVerificationExpire: Date,

    resetPasswordToken: String,
    resetPasswordExpire: Date,

    googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    referralCode: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      uppercase: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

/* =========================
   PRE SAVE HOOK
========================= */

userSchema.pre<IUser>('save', async function () {
  // Hash password (only if password exists and is modified)
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Generate username (collision-safe)
  if (!this.username) {
    const base = this.name
      .split(' ')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    this.username = `${base}-${this._id.toString().slice(-4)}`;
  }

  // Generate referral code (collision-safe)
  if (!this.referralCode) {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.referralCode = `${this.username.toUpperCase()}-${randomStr}`;
  }
});

export const User = mongoose.model<IUser>('User', userSchema);
