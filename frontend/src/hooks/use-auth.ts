import {
  forgetPassword,
  getCurrentUser,
  googleAuth,
  login,
  logout,
  register,
  resendVerification,
  resetPassword,
  verifyEmail,
} from '@/services/auth.service';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from '@/types/auth';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// ---------------- LOGIN ----------------
export const useLogin = () => {
  const router = useRouter();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: () => {
      toast.success('Login successful!');
      router.push('/dashboard'); // or dynamically based on role
    },
    onError: (error) => {
      toast.error(error.message || 'Invalid credentials');
    },
  });
};

// ---------------- REGISTER ----------------
export const useRegister = () => {
  const router = useRouter();

  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: register,
    onSuccess: () => {
      toast.success('Registration successful!');
      router.push('/login'); // maybe redirect to login or dashboard
    },
    onError: (error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
};

// ---------------- LOGOUT ----------------
export const useLogout = () => {
  const router = useRouter();

  return useMutation<null, Error>({
    mutationFn: logout,
    onSuccess: () => {
      toast.success('Logged out successfully');
      router.replace('/login');
    },
    onError: (error) => {
      toast.error(error.message || 'Logout failed');
    },
  });
};

// ---------------- FORGOT PASSWORD ----------------
export const useForgotPassword = () => {
  return useMutation<null, Error, { email: string }>({
    mutationFn: ({ email }) => forgetPassword(email),
    onSuccess: () => {
      toast.success('Password reset email sent');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send reset email');
    },
  });
};

// ---------------- RESET PASSWORD ----------------
export const useResetPassword = () => {
  return useMutation<null, Error, ResetPasswordRequest>({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success('Password reset successful');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });
};

// ---------------- VERIFY EMAIL ----------------
export const useVerifyEmail = () => {
  return useMutation<null, Error, VerifyEmailRequest>({
    mutationFn: verifyEmail,
    onSuccess: () => {
      toast.success('Email verified successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to verify email');
    },
  });
};

// ---------------- GOOGLE LOGIN ----------------
export const useGoogleAuth = () => {
  const router = useRouter();

  return useMutation<LoginResponse, Error, string>({
    mutationFn: googleAuth,
    onSuccess: () => {
      toast.success('Google login successful!');
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message || 'Google login failed');
    },
  });
};

// ---------------- RESEND VERIFICATION ----------------
export const useResendVerification = () => {
  return useMutation<null, Error, ResendVerificationRequest>({
    mutationFn: resendVerification,
    onSuccess: () => {
      toast.success('Verification email resent successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to resend verification email');
    },
  });
};

// ---------------- GET CURRENT USER ----------------
export const useCurrentUser = () => {
  return useMutation<LoginResponse, Error>({
    mutationFn: getCurrentUser,
    onError: (error) => {
      toast.error(error.message || 'Failed to fetch user data');
    },
  });
};
