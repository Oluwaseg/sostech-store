'use client';

import { useAuth } from '@/contexts/auth-context';
import { AdminNavbar } from './admin-navbar';
import { StoreNavbar } from './store-navbar';

/**
 * NavbarWrapper - Conditionally renders either Admin or Store navbar
 * based on the user's role
 */
export function NavbarWrapper() {
  const { user, isAuthenticated } = useAuth();

  // Check if user is admin or moderator
  const isAdmin =
    isAuthenticated && (user?.role === 'admin' || user?.role === 'moderator');

  if (isAdmin) {
    return <AdminNavbar />;
  }

  return <StoreNavbar />;
}
