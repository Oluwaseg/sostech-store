import { ApiRoutes } from '@/api/index';
import axiosInstance from '@/lib/axios';
import { ApiResponse } from '@/types/api-response';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  _id: string;
  email: string;
  name: string;
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  referralCode?: string;
}

export interface RegisterResponse {
  _id: string;
  email: string;
  name: string;
  token: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await axiosInstance.post(ApiRoutes.auth.login, data);
    return response.data;
  }

  /**
   * Register new user
   */
  static async register(
    data: RegisterRequest
  ): Promise<ApiResponse<RegisterResponse>> {
    const response = await axiosInstance.post(ApiRoutes.auth.register, data);
    return response.data;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<ApiResponse<null>> {
    const response = await axiosInstance.post(ApiRoutes.auth.logout);
    return response.data;
  }

  /**
   * Request password reset
   */
  static async forgetPassword(email: string): Promise<ApiResponse<null>> {
    const response = await axiosInstance.post(ApiRoutes.auth.forgetPassword, {
      email,
    });
    return response.data;
  }

  /**
   * Verify email with code
   */
  static async verifyEmail(
    data: VerifyEmailRequest
  ): Promise<ApiResponse<null>> {
    const response = await axiosInstance.post(ApiRoutes.auth.verifyEmail, data);
    return response.data;
  }

  /**
   * Reset password with code and new password
   */
  static async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ApiResponse<null>> {
    const response = await axiosInstance.post(
      ApiRoutes.auth.resetPassword,
      data
    );
    return response.data;
  }

  /**
   * Google OAuth login
   */
  static async googleAuth(token: string): Promise<ApiResponse<LoginResponse>> {
    const response = await axiosInstance.post(ApiRoutes.auth.googleAuth, {
      token,
    });
    return response.data;
  }
}
