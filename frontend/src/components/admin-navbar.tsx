'use client';

import { logo } from '@/assets';
import { useAuth } from '@/contexts/auth-context';
import { useLogout } from '@/hooks/use-auth';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const logout = useLogout();
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const dashboardAdminItems = [
    { href: '/admin/products', label: 'Products', icon: Package },
    {
      href: '/admin/categories',
      label: 'Categories',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/subcategories',
      label: 'Subcategories',
      icon: LayoutDashboard,
    },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/users', label: 'Users', icon: User },
  ];

  useEffect(() => {
    setIsOpen(false);
    setIsUserDropdownOpen(false);
  }, [pathname]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      userDropdownRef.current &&
      !userDropdownRef.current.contains(event.target as Node) &&
      userButtonRef.current &&
      !userButtonRef.current.contains(event.target as Node)
    ) {
      setIsUserDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout.mutate();
  };

  const isCurrentPage = (href: string) => pathname === href;

  // Admin Navbar
  return (
    <nav className='sticky top-0 z-50 bg-card border-b border-border'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* LEFT: Logo & Brand */}
          <div className='flex items-center gap-6'>
            <Link
              href='/dashboard/admin'
              className='flex items-center gap-2.5 flex-shrink-0'
            >
              <Image
                src={logo}
                alt='Admin Dashboard Logo'
                width={32}
                height={24}
                priority
                className='object-contain'
              />
              <span className='font-bold text-primary text-sm hidden sm:inline'>
                Admin
              </span>
            </Link>

            {/* Desktop Navigation Menu */}
            <div className='hidden lg:flex items-center gap-1'>
              {dashboardAdminItems.map((item) => {
                const Icon = item.icon;
                const isCurrent = isCurrentPage(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/60 hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT: User & Mobile Menu */}
          <div className='flex items-center gap-2'>
            {isAuthenticated && (
              <div className='relative hidden md:block' ref={userDropdownRef}>
                <button
                  ref={userButtonRef}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className='p-2 rounded-lg hover:bg-muted transition-colors'
                  aria-label='User menu'
                >
                  <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center'>
                    <User size={18} className='text-primary' />
                  </div>
                </button>

                {/* User Dropdown */}
                {isUserDropdownOpen && (
                  <div className='absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg p-0 z-50'>
                    {/* User Info Section */}
                    <div className='px-4 py-3 border-b border-border'>
                      <p className='text-xs font-semibold text-foreground/60'>
                        Signed in as
                      </p>
                      <p className='text-sm font-bold text-foreground mt-1'>
                        {user?.name || 'Admin'}
                      </p>
                      <p className='text-xs text-foreground/50 mt-1'>
                        {user?.email || ''}
                      </p>
                      <div className='mt-2 px-0'>
                        <span className='text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-semibold'>
                          {user?.role === 'admin'
                            ? 'Administrator'
                            : 'Moderator'}
                        </span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className='py-2 space-y-1'>
                      <Link
                        href='/dashboard/admin'
                        onClick={() => setIsUserDropdownOpen(false)}
                        className='flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      <Link
                        href='/dashboard/admin/settings'
                        onClick={() => setIsUserDropdownOpen(false)}
                        className='flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                      >
                        <Settings size={16} />
                        Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className='border-t border-border pt-2 pb-2 px-2'>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserDropdownOpen(false);
                        }}
                        className='flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded transition-colors'
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='lg:hidden p-2 hover:bg-muted rounded-md transition-colors'
              aria-label='Toggle menu'
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Slide-in Panel */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className='fixed inset-0 bg-black/50 z-40 lg:hidden'
            onClick={() => setIsOpen(false)}
          />
          {/* Panel - Full Screen */}
          <div className='fixed inset-0 top-16 bg-card shadow-xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-right-full duration-300 lg:hidden'>
            {/* Close Button */}
            <div className='flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-card'>
              <span className='text-sm font-semibold text-foreground'>
                Admin Menu
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className='p-2 hover:bg-muted rounded-lg transition-colors'
                aria-label='Close menu'
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className='flex-1 overflow-y-auto'>
              {/* User Info Section - Top */}
              {isAuthenticated && (
                <div className='px-4 py-4 border-b border-border bg-muted/50'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center'>
                      <User size={20} className='text-primary' />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-semibold text-foreground'>
                        {user?.name || 'Admin'}
                      </p>
                      <p className='text-xs text-foreground/60'>
                        {user?.email || ''}
                      </p>
                      <span className='text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-semibold mt-2 inline-block'>
                        {user?.role === 'admin' ? 'Administrator' : 'Moderator'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Admin Navigation */}
              <div className='px-4 py-4 space-y-2'>
                <p className='text-xs font-semibold text-foreground/60 uppercase tracking-wide px-3 mb-3'>
                  Management
                </p>
                {dashboardAdminItems.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = isCurrentPage(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isCurrent
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground/70 hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Footer Actions - Sticky Bottom */}
            <div className='px-4 py-4 border-t border-border space-y-3 bg-card flex-shrink-0'>
              <Link
                href='/dashboard/admin/settings'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
              >
                <Settings size={16} />
                Settings
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className='flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors'
                >
                  <LogOut size={16} />
                  Logout
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
