'use client';

import { useLocalStorage } from '@/lib/use-local-storage';
import React, { createContext, useContext } from 'react';
import { useCart } from './cart-context';
interface WishlistItem {
  id: number;
  name: string;
  price: string;
  rating: number;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  getWishlistCount: () => number;
  addToCart: (item: WishlistItem) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useLocalStorage<WishlistItem[]>(
    'wishlist_items',
    []
  );

  const { addToCart: addCartItem } = useCart();

  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems((prevItems) => {
      const exists = prevItems.find((i) => i.id === item.id);
      if (exists) return prevItems;
      return [...prevItems, item];
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlistItems((prevItems) => prevItems.filter((i) => i.id !== id));
  };

  const isInWishlist = (id: number) => {
    return wishlistItems.some((i) => i.id === id);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const addToCart = (item: WishlistItem) => {
    addCartItem({
      ...item,
      quantity: 1,
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistCount,
        addToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
