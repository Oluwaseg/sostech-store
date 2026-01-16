import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;

  // Core
  name: string;
  email: string;
  password: string;
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
      required: true,
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
  // Hash password
  if (this.isModified('password')) {
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
});

export const User = mongoose.model<IUser>('User', userSchema);
