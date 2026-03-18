'use client';

import { logo } from '@/assets';
import { useAuth } from '@/contexts/auth-context';
import { useLogout } from '@/hooks/use-auth';
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
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
  const [searchQuery, setSearchQuery] = useState('');
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
  const isActive = (href: string) => isCurrentPage(href);

  return (
    <nav className='sticky top-0 z-50 bg-background border-b border-border shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-20 gap-6'>
          {/* LEFT: Logo & Brand */}
          <div className='flex items-center gap-8 flex-shrink-0'>
            <Link
              href='/admin'
              className='flex items-center gap-3 group transition-all duration-300'
            >
              <div className='relative'>
                <Image
                  src={logo}
                  alt='Admin Dashboard'
                  width={32}
                  height={24}
                  priority
                  className='object-contain'
                />
              </div>
              <div className='hidden sm:flex flex-col'>
                <span className='font-bold text-base text-foreground group-hover:text-primary transition-colors'>
                  Admin
                </span>
                <span className='text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors'>
                  Dashboard
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden lg:flex items-center gap-1'>
              {dashboardAdminItems.map((item) => {
                const Icon = item.icon;
                const isCurrent = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      isCurrent
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon
                      size={18}
                      className='transition-transform group-hover:scale-110'
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className='flex items-center gap-3'>
            {/* Notifications - Desktop */}
            <button
              className='hidden sm:flex relative p-2 hover:bg-muted rounded-lg transition-colors group'
              aria-label='Notifications'
            >
              <Bell
                size={20}
                className='text-muted-foreground group-hover:text-foreground transition-colors'
              />
              <span className='absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-destructive rounded-full animate-pulse' />
            </button>

            {/* User Menu - Desktop */}
            {isAuthenticated && (
              <div className='relative hidden md:block' ref={userDropdownRef}>
                <button
                  ref={userButtonRef}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className='flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted transition-colors group'
                  aria-label='User menu'
                >
                  <div className='w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                    <User size={16} className='text-primary' />
                  </div>
                  <div className='hidden lg:flex flex-col items-start'>
                    <span className='text-sm font-semibold text-foreground leading-tight'>
                      {user?.name?.split(' ')[0] || 'Admin'}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {user?.role === 'admin' ? 'Administrator' : 'Moderator'}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-muted-foreground transition-transform duration-300 ${
                      isUserDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* User Dropdown */}
                {isUserDropdownOpen && (
                  <div className='absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg p-0 z-50 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right duration-200'>
                    {/* Profile Header */}
                    <div className='px-6 py-5 border-b border-border bg-muted/30'>
                      <div className='flex items-center gap-4 mb-4'>
                        <div className='w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0'>
                          <User size={20} className='text-primary' />
                        </div>
                        <div className='flex-1'>
                          <p className='text-sm font-bold text-foreground'>
                            {user?.name || 'Administrator'}
                          </p>
                          <p className='text-xs text-muted-foreground mt-1'>
                            {user?.email || 'admin@example.com'}
                          </p>
                        </div>
                      </div>
                      <span className='text-xs bg-primary text-primary-foreground px-3 py-2 rounded-md font-semibold inline-block'>
                        {user?.role === 'admin' ? 'Administrator' : 'Moderator'}
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className='py-2 space-y-1 px-2'>
                      <Link
                        href='/admin'
                        onClick={() => setIsUserDropdownOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                          isActive('/admin')
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href='/admin/settings'
                        onClick={() => setIsUserDropdownOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                          isActive('/admin/settings')
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <Settings size={18} />
                        <span>Settings</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className='border-t border-border pt-2 pb-2 px-2'>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserDropdownOpen(false);
                        }}
                        className='flex items-center gap-3 w-full px-4 py-3 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-medium'
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='lg:hidden p-2 hover:bg-muted rounded-lg transition-colors text-foreground'
              aria-label='Toggle menu'
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <>
          <div
            className='fixed inset-0 bg-black/20 z-40 md:hidden animate-in fade-in duration-200'
            onClick={() => setIsOpen(false)}
          />
          <div className='fixed inset-0 top-20 bg-background shadow-lg z-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 md:hidden border-l border-border'>
            <div className='flex-1 overflow-y-auto'>
              {/* Mobile Search */}
              <div className='p-4 border-b border-border'>
                <div className='relative'>
                  <Search
                    className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none'
                    size={18}
                  />
                  <input
                    type='text'
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30'
                  />
                </div>
              </div>

              {/* User Info - Mobile */}
              {isAuthenticated && (
                <div className='px-5 py-5 border-b border-border bg-muted/30'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0'>
                      <User size={20} className='text-primary' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-bold text-foreground truncate'>
                        {user?.name || 'Admin'}
                      </p>
                      <p className='text-xs text-muted-foreground truncate'>
                        {user?.role === 'admin' ? 'Administrator' : 'Moderator'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className='px-4 py-4 space-y-1'>
                <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3'>
                  Management
                </p>
                {dashboardAdminItems.map((item) => {
                  const Icon = item.icon;
                  const isCurrent = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isCurrent
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Icon size={20} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Footer */}
            <div className='px-4 py-4 border-t border-border space-y-2 flex-shrink-0'>
              <Link
                href='/admin/settings'
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/admin/settings')
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Settings size={20} />
                Settings
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className='flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors'
                >
                  <LogOut size={20} />
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
