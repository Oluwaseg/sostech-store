'use client';

import { useCurrentUser } from '@/hooks/use-auth';
import React, { createContext, useContext } from 'react';

interface AuthContextType {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    username: string;
    isEmailVerified: boolean;
  } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isError: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError, error, isSuccess } = useCurrentUser();

  const isAuthenticated = Boolean(data?.user) && isSuccess;

  const value: AuthContextType = {
    user: data?.user || null,
    isLoading,
    isAuthenticated,
    isError,
    error: error || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
