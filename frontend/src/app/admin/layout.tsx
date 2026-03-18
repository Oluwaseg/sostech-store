'use client';

import { Footer } from '@/components/footer';
import { NavbarWrapper } from '@/components/navbar-wrapper';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect non-admins away from admin pages
    if (
      !isLoading &&
      isAuthenticated &&
      !(user?.role === 'admin' || user?.role === 'moderator')
    ) {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Optional: show loader until auth resolves
  if (isLoading || !user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <>
      <NavbarWrapper />
      {children}
      <Footer />
    </>
  );
}
