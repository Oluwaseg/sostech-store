import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { generateToken, hashToken } from '../utils/crypto';
import emailService from './email.service';
import referralService from './referral.service';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResult {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    username: string;
    isEmailVerified: boolean;
  };
}

class AuthService {
  async register(data: RegisterData): Promise<AuthResult> {
    const { name, email, password, referralCode } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate email verification token
    const emailVerificationToken = generateToken();
    const emailVerificationExpire = new Date();
    emailVerificationExpire.setHours(emailVerificationExpire.getHours() + 24); // 24 hours

    user.emailVerificationToken = hashToken(emailVerificationToken);
    user.emailVerificationExpire = emailVerificationExpire;
    await user.save();

    // Send verification email
    try {
      await emailService.sendVerificationEmail(
        user.email,
        user.name,
        emailVerificationToken
      );
    } catch (error) {
      // Log error but don't fail registration
      console.error('Failed to send verification email:', error);
    }

    // Track referral if referral code provided
    if (referralCode) {
      try {
        await referralService.trackReferral(referralCode, user._id.toString());
      } catch (error) {
        // Log error but don't fail registration
        console.error('Failed to track referral:', error);
      }
    }

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async login(data: LoginData): Promise<AuthResult> {
    const { email, password } = data;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Check if user is OAuth-only (no password)
    if (!user.password) {
      throw new Error('Please sign in with Google');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async forgetPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return;
    }

    // Generate reset token
    const resetToken = generateToken();
    const resetPasswordExpire = new Date();
    resetPasswordExpire.setHours(resetPasswordExpire.getHours() + 1); // 1 hour

    user.resetPasswordToken = hashToken(resetToken);
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save();

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetToken
      );
    } catch (error) {
      // Log error but don't reveal if user exists
      console.error('Failed to send password reset email:', error);
    }
  }

  async verifyEmail(token: string): Promise<void> {
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: new Date() },
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    if (user.isEmailVerified) {
      throw new Error('Email is already verified');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    }).select('+password');

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
  }

  async handleGoogleOAuth(user: any): Promise<AuthResult> {
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return {
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }
}

export default new AuthService();
