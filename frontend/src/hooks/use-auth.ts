'use client';

import { handleApiError, unwrap } from '@/lib/unwrap';
import {
  AuthService,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from '@/services/auth.service';
import { useMutation } from '@tanstack/react-query';

/**
 * Hook for login mutation
 */
export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await AuthService.login(data);
      const payload = unwrap(response);
      // Token is stored in httpOnly cookie by backend
      return payload;
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
}

/**
 * Hook for registration mutation
 */
export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await AuthService.register(data);
      const payload = unwrap(response);
      // Token is stored in httpOnly cookie by backend
      return payload;
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
}

/**
 * Hook for logout mutation
 */
export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const response = await AuthService.logout();
      unwrap(response);
      // Token is cleared by backend
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
}

/**
 * Hook for forget password mutation
 */
export function useForgetPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await AuthService.forgetPassword(email);
      return unwrap(response);
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
}

/**
 * Hook for verify email mutation
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (data: VerifyEmailRequest) => {
      const response = await AuthService.verifyEmail(data);
      return unwrap(response);
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
}

/**
 * Hook for reset password mutation
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await AuthService.resetPassword(data);
      return unwrap(response);
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
}

/**
 * Hook for Google OAuth login
 */
export function useGoogleAuth() {
  return useMutation({
    mutationFn: async (token: string) => {
      const response = await AuthService.googleAuth(token);
      const payload = unwrap(response);
      // Token is stored in httpOnly cookie by backend
      return payload;
    },
    onError: (error) => {
      handleApiError(error);
    },
  });
}
