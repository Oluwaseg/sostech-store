import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { ApiResponse } from '@/types/api-response';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from '@/types/auth';

// ---------------- LOGIN ----------------
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await axiosInstance.post<ApiResponse<LoginResponse>>(
    ApiRoutes.auth.login,
    data
  );
  return unwrap(res.data);
};

// ---------------- REGISTER ----------------
export const register = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  const res = await axiosInstance.post<ApiResponse<RegisterResponse>>(
    ApiRoutes.auth.register,
    data
  );
  return unwrap(res.data);
};

// ---------------- LOGOUT ----------------
export const logout = async (): Promise<null> => {
  const res = await axiosInstance.post<ApiResponse<null>>(
    ApiRoutes.auth.logout
  );
  return unwrap(res.data);
};

// ---------------- FORGOT PASSWORD ----------------
export const forgetPassword = async (email: string): Promise<null> => {
  const res = await axiosInstance.post<ApiResponse<null>>(
    ApiRoutes.auth.forgetPassword,
    { email }
  );
  return unwrap(res.data);
};

// ---------------- VERIFY EMAIL ----------------
export const verifyEmail = async (data: VerifyEmailRequest): Promise<null> => {
  const res = await axiosInstance.post<ApiResponse<null>>(
    ApiRoutes.auth.verifyEmail,
    data
  );
  return unwrap(res.data);
};

// ---------------- RESET PASSWORD ----------------
export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<null> => {
  const res = await axiosInstance.post<ApiResponse<null>>(
    ApiRoutes.auth.resetPassword,
    data
  );
  return unwrap(res.data);
};

// ---------------- GOOGLE LOGIN ----------------
export const googleAuth = async (token: string): Promise<LoginResponse> => {
  const res = await axiosInstance.post<ApiResponse<LoginResponse>>(
    ApiRoutes.auth.googleAuth,
    { token }
  );
  return unwrap(res.data);
};

// ---------------- RESEND VERIFICATION EMAIL ----------------
export const resendVerification = async (
  data: ResendVerificationRequest
): Promise<null> => {
  const res = await axiosInstance.post<ApiResponse<null>>(
    ApiRoutes.auth.resendVerification,
    data
  );
  return unwrap(res.data);
};

// ---------------- GET CURRENT USER ----------------
export const getCurrentUser = async (): Promise<LoginResponse> => {
  const res = await axiosInstance.get<ApiResponse<LoginResponse>>(
    ApiRoutes.auth.me
  );
  return unwrap(res.data);
};
