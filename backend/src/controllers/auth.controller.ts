import { NextFunction, Request, Response } from 'express';
import authService from '../services/auth.service';
import { generateToken, TokenPayload } from '../utils/jwt';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      return (res as any).success(
        result,
        'Registration successful. Please verify your email.',
        null,
        201
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Registration failed',
        'REGISTRATION_ERROR',
        400
      );
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);

      // Set token in secure HTTP-only cookie
      const cookieName = process.env.JWT_COOKIE_NAME || 'token';
      const cookieDays = parseInt(
        process.env.JWT_COOKIE_EXPIRES_DAYS || '7',
        10
      );
      const isProd = process.env.NODE_ENV === 'production';
      const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? ('none' as const) : ('lax' as const),
        maxAge: cookieDays * 24 * 60 * 60 * 1000, // days -> ms
      };

      // Create token from returned user and set cookie
      const tokenPayload: TokenPayload = {
        userId: result.user._id,
        email: result.user.email,
        role: result.user.role,
      };
      const token = generateToken(tokenPayload);
      res.cookie(cookieName, token, cookieOptions);

      // Return user object only (token is in cookie)
      return (res as any).success({ user: result.user }, 'Login successful');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Login failed',
        'LOGIN_ERROR',
        401
      );
    }
  }

  async forgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.forgetPassword(req.body.email);
      return (res as any).success(
        null,
        'If an account exists with this email, a password reset link has been sent.'
      );
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Failed to process password reset request',
        'FORGET_PASSWORD_ERROR',
        500
      );
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.verifyEmail(req.body.token);
      return (res as any).success(null, 'Email verified successfully');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Email verification failed',
        'VERIFY_EMAIL_ERROR',
        400
      );
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.resetPassword(req.body.token, req.body.password);
      return (res as any).success(null, 'Password reset successful');
    } catch (error: any) {
      return (res as any).error(
        error.message || 'Password reset failed',
        'RESET_PASSWORD_ERROR',
        400
      );
    }
  }

  async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user; // Set by passport
      if (!user) {
        return (res as any).error(
          'Google authentication failed',
          'GOOGLE_OAUTH_ERROR',
          401
        );
      }

      const result = await authService.handleGoogleOAuth(user);
      // Set token in secure HTTP-only cookie then redirect to frontend
      const cookieName = process.env.JWT_COOKIE_NAME || 'token';
      const cookieDays = parseInt(
        process.env.JWT_COOKIE_EXPIRES_DAYS || '7',
        10
      );
      const isProd = process.env.NODE_ENV === 'production';
      const cookieOptions = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? ('none' as const) : ('lax' as const),
        maxAge: cookieDays * 24 * 60 * 60 * 1000, // days -> ms
      };

      // Create token from returned user and set cookie
      const tokenPayload: TokenPayload = {
        userId: result.user._id,
        email: result.user.email,
        role: result.user.role,
      };
      const token = generateToken(tokenPayload);
      res.cookie(cookieName, token, cookieOptions);

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/callback`;
      return res.redirect(redirectUrl);
    } catch (error: any) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const errorUrl = `${frontendUrl}/auth/error?message=${encodeURIComponent(
        error.message || 'Authentication failed'
      )}`;
      return res.redirect(errorUrl);
    }
  }
}

export default new AuthController();
