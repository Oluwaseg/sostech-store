'use client';

import { logo } from '@/assets';
import { Button } from '@/components/ui/button';
import { useCartContext } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import {
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
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
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsOpen(false);
    setIsCartDropdownOpen(false);
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

  return (
    <div>
      {/* Announcement Banner */}
      <div className='bg-accent text-accent-foreground py-2.5 px-4 text-center text-sm font-semibold'>
        ✨ Premium Shopping Experience • Fast Shipping on All Orders
      </div>

      {/* Main Navbar */}
      <nav className='sticky top-0 z-50 bg-card border-b border-border/50 backdrop-blur-sm shadow-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-20'>
            {/* Logo */}
            <Link href='/' className='flex items-center group flex-shrink-0'>
              <Image
                src={logo}
                alt='SOS Store Logo'
                width={40}
                height={30}
                priority
                className='object-contain transition-transform duration-300 group-hover:scale-105'
              />
              <span className='ml-2 font-black text-lg text-primary tracking-tight'>
                SOS
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden lg:flex items-center space-x-1'>
              {['Home', 'Shop', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className='px-4 py-2.5 text-foreground/70 hover:text-foreground transition-colors font-medium text-sm rounded-lg hover:bg-secondary/40 active:bg-secondary'
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Search Bar - Desktop */}
            <div className='hidden md:flex items-center flex-1 mx-8 max-w-xs'>
              <div className='w-full relative'>
                <Search
                  className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40'
                  size={18}
                />
                <input
                  type='text'
                  placeholder='Search products...'
                  className='w-full pl-10 pr-4 py-2.5 bg-secondary/40 border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition-all'
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className='flex items-center space-x-3 md:space-x-4'>
              {/* Cart Dropdown */}
              <div className='relative' ref={dropdownRef}>
                <button
                  ref={cartButtonRef}
                  onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)}
                  className='relative p-2.5 text-foreground/70 hover:text-foreground transition-all duration-200 rounded-lg hover:bg-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/40'
                  aria-label={`Shopping cart with ${totalItems} items`}
                >
                  <ShoppingCart size={22} />
                  {totalItems > 0 && (
                    <span className='absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg'>
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Premium Cart/Wishlist Dropdown */}
                {isCartDropdownOpen && (
                  <div className='absolute right-0 mt-3 w-[420px] bg-card border border-border rounded-2xl shadow-2xl z-40 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden'>
                    {/* Header Tabs */}
                    <div className='px-8 py-6 bg-gradient-to-r from-primary/5 to-accent/5 border-b border-border'>
                      <div className='flex gap-8'>
                        <button
                          onClick={() => setActiveTab('cart')}
                          className={`pb-4 font-bold text-sm transition-all relative ${
                            activeTab === 'cart'
                              ? 'text-primary'
                              : 'text-foreground/60 hover:text-foreground'
                          }`}
                        >
                          Shopping Cart
                          {activeTab === 'cart' && (
                            <div className='absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full'></div>
                          )}
                        </button>
                        <button
                          onClick={() => setActiveTab('wishlist')}
                          className={`pb-4 font-bold text-sm transition-all flex items-center gap-2 relative ${
                            activeTab === 'wishlist'
                              ? 'text-accent'
                              : 'text-foreground/60 hover:text-foreground'
                          }`}
                        >
                          <Heart size={16} />
                          Saved Items
                          {activeTab === 'wishlist' && (
                            <div className='absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full'></div>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Cart Tab */}
                    {activeTab === 'cart' && (
                      <div className='flex flex-col h-96'>
                        {cartItems.length === 0 ? (
                          <div className='flex-1 flex flex-col items-center justify-center p-12 text-center'>
                            <div className='w-20 h-20 bg-secondary/50 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                              <ShoppingCart
                                size={40}
                                className='text-foreground/25'
                              />
                            </div>
                            <p className='text-foreground font-bold text-base mb-2'>
                              Your cart is empty
                            </p>
                            <p className='text-foreground/60 text-sm'>
                              Start shopping to add items
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className='flex-1 overflow-y-auto px-6 py-4 space-y-3'>
                              {cartItems.map((item) => (
                                <div
                                  key={item.id}
                                  className='bg-secondary/40 rounded-xl p-4 hover:bg-secondary/60 transition-all group'
                                >
                                  <div className='flex justify-between items-start mb-4'>
                                    <div className='flex-1 min-w-0'>
                                      <h4 className='font-bold text-foreground text-sm group-hover:text-primary transition-colors truncate'>
                                        {item.name}
                                      </h4>
                                      <p className='text-accent font-bold text-base mt-2'>
                                        ${item.price}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => removeFromCart(item.id)}
                                      className='text-foreground/40 hover:text-destructive transition-colors ml-3 flex-shrink-0 opacity-0 group-hover:opacity-100 p-1'
                                      aria-label='Remove item'
                                    >
                                      <X size={20} />
                                    </button>
                                  </div>
                                  <div className='flex items-center gap-2 bg-white/40 rounded-lg w-fit p-1'>
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          item.quantity - 1
                                        )
                                      }
                                      disabled={item.quantity <= 1}
                                      className='p-2 bg-foreground/10 hover:bg-foreground/20 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors'
                                      aria-label='Decrease quantity'
                                    >
                                      <Minus size={16} />
                                    </button>
                                    <span className='text-sm font-bold min-w-8 text-center'>
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          item.quantity + 1
                                        )
                                      }
                                      className='p-2 bg-foreground/10 hover:bg-foreground/20 rounded-lg transition-colors'
                                      aria-label='Increase quantity'
                                    >
                                      <Plus size={16} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Cart Footer */}
                            <div className='border-t border-border px-6 py-5 bg-gradient-to-r from-primary/5 to-accent/5 space-y-3'>
                              <div className='flex justify-between items-center'>
                                <span className='text-foreground/80 font-semibold text-sm'>
                                  Subtotal
                                </span>
                                <span className='text-accent font-bold text-lg'>
                                  ${getTotalPrice()}
                                </span>
                              </div>
                              <Link
                                href='/checkout'
                                onClick={() => setIsCartDropdownOpen(false)}
                                className='block'
                              >
                                <Button className='w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-3 rounded-xl transition-all active:scale-95 text-sm'>
                                  Proceed to Checkout
                                </Button>
                              </Link>
                              <Link
                                href='/cart'
                                onClick={() => setIsCartDropdownOpen(false)}
                                className='block'
                              >
                                <Button
                                  variant='outline'
                                  className='w-full border-primary/30 text-primary hover:bg-primary/5 font-semibold py-2.5 rounded-xl transition-all bg-transparent text-sm'
                                >
                                  View Full Cart
                                </Button>
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Wishlist Tab */}
                    {activeTab === 'wishlist' && (
                      <div className='flex flex-col h-96'>
                        {wishlistItems.length === 0 ? (
                          <div className='flex-1 flex flex-col items-center justify-center p-12 text-center'>
                            <div className='w-20 h-20 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                              <Heart size={40} className='text-accent/50' />
                            </div>
                            <p className='text-foreground font-bold text-base mb-2'>
                              No saved items yet
                            </p>
                            <p className='text-foreground/60 text-sm'>
                              Heart items to save for later
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className='flex-1 overflow-y-auto px-6 py-4 space-y-3'>
                              {wishlistItems.map((item) => (
                                <div
                                  key={item.id}
                                  className='bg-accent/10 rounded-xl p-4 hover:bg-accent/20 transition-all group'
                                >
                                  <div className='flex justify-between items-start mb-4'>
                                    <div className='flex-1 min-w-0'>
                                      <h4 className='font-bold text-foreground text-sm group-hover:text-primary transition-colors truncate'>
                                        {item.name}
                                      </h4>
                                      <p className='text-accent font-bold text-base mt-2'>
                                        ${item.price}
                                      </p>
                                      <div className='flex items-center gap-1 mt-2'>
                                        <div className='flex gap-0.5'>
                                          {[...Array(5)].map((_, i) => (
                                            <span
                                              key={i}
                                              className='text-accent text-xs'
                                            >
                                              ★
                                            </span>
                                          ))}
                                        </div>
                                        <span className='text-foreground/50 text-xs'>
                                          {item.rating}
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        removeFromWishlist(item.id)
                                      }
                                      className='text-accent hover:text-destructive transition-colors ml-3 flex-shrink-0 opacity-0 group-hover:opacity-100 p-1'
                                      aria-label='Remove from wishlist'
                                    >
                                      <X size={20} />
                                    </button>
                                  </div>
                                  <Button
                                    onClick={() => {
                                      addWishlistToCart({
                                        id: item.id,
                                        name: item.name,
                                        price: item.price,
                                        quantity: 1,
                                      });
                                      removeFromWishlist(item.id);
                                    }}
                                    className='w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-2 rounded-lg transition-all active:scale-95 text-sm'
                                  >
                                    Add to Cart
                                  </Button>
                                </div>
                              ))}
                            </div>

                            {/* Wishlist Footer */}
                            <div className='border-t border-border px-6 py-5 bg-gradient-to-r from-primary/5 to-accent/5'>
                              <Link
                                href='/wishlist'
                                onClick={() => setIsCartDropdownOpen(false)}
                                className='block'
                              >
                                <Button
                                  variant='outline'
                                  className='w-full border-accent/30 text-accent hover:bg-accent/5 font-bold py-2.5 rounded-xl transition-all bg-transparent text-sm'
                                >
                                  View Full Wishlist
                                </Button>
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Auth Buttons - Desktop */}
              <div className='hidden md:flex items-center space-x-3'>
                <Link href='/login'>
                  <Button
                    variant='outline'
                    className='border-primary/30 text-primary hover:bg-primary/5 font-medium bg-transparent'
                  >
                    Login
                  </Button>
                </Link>
                <Link href='/register'>
                  <Button className='bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg'>
                    Register
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className='md:hidden p-2.5 text-foreground rounded-lg hover:bg-secondary/40 focus:outline-none focus:ring-2 focus:ring-accent/40'
                aria-label='Toggle menu'
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className='md:hidden pb-6 pt-2 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-200'>
              <div className='flex flex-col space-y-2 mb-6'>
                {['Home', 'Shop', 'About', 'Contact'].map((item) => (
                  <Link
                    key={item}
                    href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className='px-4 py-3 text-foreground/70 hover:text-foreground hover:bg-secondary/40 rounded-lg transition-colors font-medium'
                  >
                    {item}
                  </Link>
                ))}
              </div>

              {/* Mobile Search */}
              <div className='mb-6'>
                <div className='relative'>
                  <Search
                    className='absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40'
                    size={18}
                  />
                  <input
                    type='text'
                    placeholder='Search products...'
                    className='w-full pl-10 pr-4 py-2.5 bg-secondary/40 border border-border rounded-lg text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all'
                  />
                </div>
              </div>

              {/* Mobile Auth Buttons */}
              <div className='flex flex-col space-y-2'>
                <Link href='/login' onClick={() => setIsOpen(false)}>
                  <Button
                    variant='outline'
                    className='w-full border-primary/30 text-primary hover:bg-primary/5 font-medium bg-transparent'
                  >
                    Login
                  </Button>
                </Link>
                <Link href='/register' onClick={() => setIsOpen(false)}>
                  <Button className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold'>
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
