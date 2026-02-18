'use client';

import { logo } from '@/assets';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useCartContext } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useLogout } from '@/hooks/use-auth';
import {
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Minus,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'cart' | 'wishlist'>('cart');
  const pathname = usePathname();
  const { getCartCount, cartItems, removeFromCart, updateQuantity, clearCart } =
    useCartContext();
  const {
    getWishlistCount,
    wishlistItems,
    removeFromWishlist,
    addToCart: addWishlistToCart,
  } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const logout = useLogout();
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const isDashboard = pathname.startsWith('/dashboard');

  useEffect(() => {
    setIsOpen(false);
    setIsCartDropdownOpen(false);
    setIsUserDropdownOpen(false);
  }, [pathname]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      cartButtonRef.current &&
      !cartButtonRef.current.contains(event.target as Node)
    ) {
      setIsCartDropdownOpen(false);
    }
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

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const price =
          typeof item.price === 'number'
            ? item.price
            : parseFloat(String(item.price));
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const totalItems = cartCount + wishlistCount;

  const handleLogout = () => {
    logout.mutate();
  };

  // Dashboard Navbar
  const dashboardNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const dashboardAdminItems = [
    { href: '/dashboard/products', label: 'Products', icon: Package },
  ];

  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  if (isDashboard) {
    // Dashboard nav links
    const navItems = [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
      { href: '/dashboard/profile', label: 'Profile', icon: User },
      { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ];

    const adminItems = [
      { href: '/dashboard/products', label: 'Products', icon: Package },
    ];

    const renderLinks = (items: typeof navItems) =>
      items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground/60 hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      });

    return (
      <nav className='sticky top-0 z-50 bg-card border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo */}
            <Link href='/dashboard' className='flex items-center gap-2.5'>
              <Image
                src={logo}
                alt='SOS Store Logo'
                width={32}
                height={24}
                priority
                className='object-contain'
              />
              <span className='font-bold text-primary text-sm'>Dashboard</span>
            </Link>

            {/* Desktop nav links */}
            <div className='hidden lg:flex items-center gap-1'>
              {renderLinks(navItems)}
              {isAdmin && renderLinks(adminItems)}
            </div>

            {/* Right section */}
            <div className='flex items-center gap-2'>
              {/* User info dropdown */}
              {isAuthenticated && (
                <div className='relative' ref={userDropdownRef}>
                  <button
                    ref={userButtonRef}
                    onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                    className='hidden md:flex items-center gap-2 px-3 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition-colors'
                  >
                    <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center'>
                      <User size={16} className='text-primary' />
                    </div>
                    <div className='text-left'>
                      <p className='text-xs font-semibold text-foreground'>
                        {user?.name?.split(' ')[0] || 'User'}
                      </p>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isUserDropdownOpen && (
                    <div className='absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg p-0 z-50'>
                      <div className='px-4 py-3 border-b border-border'>
                        <p className='text-xs font-semibold text-foreground/60'>
                          Signed in as
                        </p>
                        <p className='text-sm font-bold text-foreground mt-1'>
                          {user?.name || 'User'}
                        </p>
                        <p className='text-xs text-foreground/50 mt-1'>
                          {user?.email || ''}
                        </p>
                      </div>
                      <div className='py-2 space-y-1'>
                        <Link
                          href='/dashboard'
                          onClick={() => setIsUserDropdownOpen(false)}
                          className='flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                        >
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                        <Link
                          href='/dashboard/orders'
                          onClick={() => setIsUserDropdownOpen(false)}
                          className='flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                        >
                          <ShoppingBag size={16} /> Orders
                        </Link>
                        <Link
                          href='/dashboard/profile'
                          onClick={() => setIsUserDropdownOpen(false)}
                          className='flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                        >
                          <User size={16} /> Profile
                        </Link>
                        <Link
                          href='/dashboard/settings'
                          onClick={() => setIsUserDropdownOpen(false)}
                          className='flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                        >
                          <Settings size={16} /> Settings
                        </Link>
                      </div>
                      <div className='border-t border-border pt-2 pb-2 px-2'>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsUserDropdownOpen(false);
                          }}
                          className='flex items-center gap-3 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded transition-colors'
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile menu toggle */}
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

        {/* Mobile menu */}
        {isOpen && (
          <div className='lg:hidden border-t border-border bg-card'>
            <div className='px-4 py-3 flex flex-col gap-1'>
              {renderLinks(navItems)}
              {isAdmin && renderLinks(adminItems)}
              <div className='pt-2 border-t border-border'>
                {isAuthenticated ? (
                  <>
                    <Link href='/dashboard'>
                      <Button
                        variant='ghost'
                        className='w-full justify-start text-xs'
                      >
                        <User size={16} /> Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant='outline'
                      className='w-full text-xs'
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Link href='/login'>
                    <Button className='w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs'>
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    );
  }

  // Store Navbar
  return (
    <div>
      {/* Announcement Banner */}
      <div className='bg-accent text-accent-foreground py-2 px-4 text-center text-xs font-semibold tracking-wide'>
        ✨ Premium Shopping Experience • Fast Shipping on All Orders
      </div>

      <nav className='sticky top-0 z-50 bg-card border-b border-border'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16 gap-4'>
            {/* Logo */}
            <Link href='/' className='flex items-center gap-2.5 flex-shrink-0'>
              <Image
                src={logo}
                alt='SOS Store Logo'
                width={32}
                height={24}
                priority
                className='object-contain'
              />
              <span className='font-bold text-primary text-sm'>SOS</span>
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden lg:flex items-center gap-0'>
              {['Home', 'Shop', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className='px-4 py-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors rounded-md hover:bg-muted'
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Search Bar - Desktop */}
            <div className='hidden md:flex flex-1 max-w-xs items-center'>
              <div className='w-full relative'>
                <Search
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40'
                  size={16}
                />
                <input
                  type='text'
                  placeholder='Search products...'
                  className='w-full pl-9 pr-3 py-2 bg-muted border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all'
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className='flex items-center gap-2'>
              {/* Cart */}
              <div className='relative' ref={dropdownRef}>
                <button
                  ref={cartButtonRef}
                  onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)}
                  className='relative p-2 text-foreground/60 hover:text-foreground transition-colors rounded-md hover:bg-muted'
                  aria-label={`Shopping cart with ${cartCount} items`}
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className='absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Cart Dropdown */}
                {isCartDropdownOpen && (
                  <div className='absolute right-0 mt-2 w-96 bg-card border border-border rounded-xl shadow-lg z-40 overflow-hidden'>
                    {/* Tabs */}
                    <div className='px-5 py-4 border-b border-border flex gap-4'>
                      <button
                        onClick={() => setActiveTab('cart')}
                        className={`pb-2 text-sm font-semibold transition-colors relative ${
                          activeTab === 'cart'
                            ? 'text-primary'
                            : 'text-foreground/60 hover:text-foreground'
                        }`}
                      >
                        Cart ({cartCount})
                        {activeTab === 'cart' && (
                          <div className='absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full'></div>
                        )}
                      </button>
                      <button
                        onClick={() => setActiveTab('wishlist')}
                        className={`pb-2 text-sm font-semibold flex items-center gap-1.5 transition-colors relative ${
                          activeTab === 'wishlist'
                            ? 'text-accent'
                            : 'text-foreground/60 hover:text-foreground'
                        }`}
                      >
                        <Heart size={14} />
                        Saved ({wishlistCount})
                        {activeTab === 'wishlist' && (
                          <div className='absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full'></div>
                        )}
                      </button>
                    </div>

                    {/* Cart Content */}
                    {activeTab === 'cart' && (
                      <div className='flex flex-col h-80'>
                        {cartItems.length === 0 ? (
                          <div className='flex-1 flex flex-col items-center justify-center p-8 text-center'>
                            <ShoppingCart
                              size={36}
                              className='text-foreground/20 mb-3'
                            />
                            <p className='text-sm font-semibold text-foreground mb-1'>
                              Your cart is empty
                            </p>
                            <p className='text-xs text-foreground/50'>
                              Add items to get started
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className='flex-1 overflow-y-auto px-5 py-3 space-y-2'>
                              {cartItems.map((item) => (
                                <div
                                  key={item.id}
                                  className='bg-muted rounded-lg p-3 hover:bg-muted/80 transition-colors'
                                >
                                  <div className='flex justify-between items-start mb-2'>
                                    <div className='flex-1'>
                                      <h4 className='text-sm font-semibold text-foreground truncate'>
                                        {item.name}
                                      </h4>
                                      <p className='text-accent font-bold text-sm mt-1'>
                                        ${item.price}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => removeFromCart(item.id)}
                                      className='text-foreground/40 hover:text-destructive transition-colors p-1'
                                      aria-label='Remove item'
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                  <div className='flex items-center gap-1 bg-background rounded-md w-fit p-1'>
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          item.quantity - 1
                                        )
                                      }
                                      disabled={item.quantity <= 1}
                                      className='p-1 bg-foreground/10 hover:bg-foreground/20 disabled:opacity-30 disabled:cursor-not-allowed rounded transition-colors'
                                      aria-label='Decrease quantity'
                                    >
                                      <Minus size={14} />
                                    </button>
                                    <span className='text-xs font-bold min-w-6 text-center'>
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          item.quantity + 1
                                        )
                                      }
                                      className='p-1 bg-foreground/10 hover:bg-foreground/20 rounded transition-colors'
                                      aria-label='Increase quantity'
                                    >
                                      <Plus size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Footer */}
                            <div className='border-t border-border px-5 py-3 bg-muted/40 space-y-2'>
                              <div className='flex justify-between items-center'>
                                <span className='text-xs font-semibold text-foreground/70'>
                                  Subtotal
                                </span>
                                <span className='text-accent font-bold text-sm'>
                                  ${getTotalPrice()}
                                </span>
                              </div>
                              <Link
                                href='/checkout'
                                onClick={() => setIsCartDropdownOpen(false)}
                                className='block'
                              >
                                <Button className='w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 rounded-lg text-xs'>
                                  Checkout
                                </Button>
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Wishlist Content */}
                    {activeTab === 'wishlist' && (
                      <div className='flex flex-col h-80'>
                        {wishlistItems.length === 0 ? (
                          <div className='flex-1 flex flex-col items-center justify-center p-8 text-center'>
                            <Heart
                              size={36}
                              className='text-foreground/20 mb-3'
                            />
                            <p className='text-sm font-semibold text-foreground mb-1'>
                              No saved items
                            </p>
                            <p className='text-xs text-foreground/50'>
                              Save your favorites
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className='flex-1 overflow-y-auto px-5 py-3 space-y-2'>
                              {wishlistItems.map((item) => (
                                <div
                                  key={item.id}
                                  className='bg-muted rounded-lg p-3 hover:bg-muted/80 transition-colors'
                                >
                                  <div className='flex justify-between items-start mb-2'>
                                    <div className='flex-1'>
                                      <h4 className='text-sm font-semibold text-foreground truncate'>
                                        {item.name}
                                      </h4>
                                      <p className='text-accent font-bold text-sm mt-1'>
                                        ${item.price}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() =>
                                        removeFromWishlist(item.id)
                                      }
                                      className='text-foreground/40 hover:text-destructive transition-colors p-1'
                                      aria-label='Remove from wishlist'
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                  <Button
                                    size='sm'
                                    className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs'
                                    onClick={() => {
                                      addWishlistToCart(item);
                                      removeFromWishlist(item.id);
                                    }}
                                  >
                                    Add to Cart
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Auth & Mobile Menu */}
              <div className='flex items-center gap-2'>
                {isAuthenticated ? (
                  <div className='relative' ref={userDropdownRef}>
                    <button
                      ref={userButtonRef}
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className='hidden md:flex items-center gap-2 px-3 py-2 text-foreground/70 hover:text-foreground hover:bg-muted rounded-lg transition-colors'
                    >
                      <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center'>
                        <User size={16} className='text-primary' />
                      </div>
                      <div className='text-left'>
                        <p className='text-xs font-semibold text-foreground'>
                          {user?.name?.split(' ')[0] || 'User'}
                        </p>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                      />
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
                            {user?.name || 'User'}
                          </p>
                          <p className='text-xs text-foreground/50 mt-1'>
                            {user?.email || ''}
                          </p>
                        </div>

                        {/* Menu Items */}
                        <div className='py-2 space-y-1'>
                          <Link
                            href='/dashboard'
                            onClick={() => setIsUserDropdownOpen(false)}
                            className='flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                          >
                            <LayoutDashboard size={16} />
                            Dashboard
                          </Link>
                          <Link
                            href='/dashboard/orders'
                            onClick={() => setIsUserDropdownOpen(false)}
                            className='flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                          >
                            <ShoppingBag size={16} />
                            Orders
                          </Link>
                          <Link
                            href='/dashboard/profile'
                            onClick={() => setIsUserDropdownOpen(false)}
                            className='flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors'
                          >
                            <User size={16} />
                            Profile
                          </Link>
                          <Link
                            href='/dashboard/settings'
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
                ) : (
                  <Link href='/login' className='hidden md:block'>
                    <Button
                      size='sm'
                      className='bg-primary hover:bg-primary/90 text-primary-foreground text-xs'
                    >
                      Sign In
                    </Button>
                  </Link>
                )}

                {/* Mobile Menu */}
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
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className='lg:hidden border-t border-border bg-card'>
            <div className='px-4 py-3 space-y-2'>
              {['Home', 'Shop', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className='flex px-3 py-2 rounded-md text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-muted transition-colors'
                >
                  {item}
                </Link>
              ))}
              <div className='pt-2 border-t border-border'>
                <div className='md:hidden flex flex-col gap-2'>
                  {isAuthenticated ? (
                    <>
                      <Link href='/dashboard' onClick={() => setIsOpen(false)}>
                        <Button
                          variant='ghost'
                          className='w-full justify-start text-xs'
                        >
                          <User size={16} />
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant='outline'
                        className='w-full text-xs'
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Link
                      href='/login'
                      onClick={() => setIsOpen(false)}
                      className='block'
                    >
                      <Button className='w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs'>
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
