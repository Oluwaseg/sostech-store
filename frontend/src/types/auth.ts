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

export interface CurrentUserResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    username: string;
    isEmailVerified: boolean;
  };
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

export interface ResendVerificationRequest {
  email: string;
}
