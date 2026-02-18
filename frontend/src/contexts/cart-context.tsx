'use client';

import { useAuth } from '@/contexts/auth-context';
import {
  useCart as useCartQuery,
  useClearCart,
  useMergeCart,
  useUpdateCart,
} from '@/hooks/use-cart';
import { useLocalStorage } from '@/lib/use-local-storage';
import React, { createContext, useContext, useEffect, useRef } from 'react';

interface CartItem {
  id: string; // product id
  name?: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getCartCount: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Get auth state from AuthContext
  const { isAuthenticated } = useAuth();

  // Local (guest) cart - only used when NOT authenticated
  const [localCart, setLocalCart] = useLocalStorage<CartItem[]>(
    'cart_items',
    []
  );

  // Server cart (react-query) - only fetched when authenticated
  const { data: serverCartData } = useCartQuery(isAuthenticated);
  const updateCartMutation = useUpdateCart();
  const mergeCartMutation = useMergeCart();
  const clearCartMutation = useClearCart();

  // Track if we've already merged the cart to prevent duplicate merges
  const hasMergedRef = useRef(false);

  // Map server cart to local-friendly CartItem[]
  const serverCartItems: CartItem[] = (serverCartData?.items ?? [])
    .filter((it) => it.product) // 🚨 IMPORTANT
    .map((it) => {
      const productId =
        typeof it.product === 'string' ? it.product : it.product._id;

      return {
        id: productId,
        name: typeof it.product === 'string' ? undefined : it.product.name,
        price: it.price,
        quantity: it.quantity,
      };
    });

  // Use server cart when authenticated, local cart when guest
  const cartItems = isAuthenticated ? serverCartItems : localCart;

  // Helper to map local CartItem[] -> Request payload for server
  const toServerItems = (
    items: CartItem[]
  ): { productId: string; quantity: number }[] => {
    return items.map((i) => ({
      productId: i.id,
      quantity: i.quantity,
    }));
  };

  // Merge guest cart into server when user becomes authenticated
  useEffect(() => {
    // Only merge once when user first becomes authenticated
    if (!isAuthenticated) {
      hasMergedRef.current = false;
      return;
    }

    // Skip if already merged or no local cart items
    if (hasMergedRef.current || localCart.length === 0) {
      return;
    }

    // Mark as merged before making the request
    hasMergedRef.current = true;

    // Merge guest cart into server cart
    mergeCartMutation.mutate(
      localCart.map((i) => ({ product: i.id, quantity: i.quantity })),
      {
        onSuccess: () => {
          // Clear local cart after successful merge
          setLocalCart([]);
        },
        onError: (e) => {
          // Reset merge flag on error so we can retry
          hasMergedRef.current = false;
          console.error('Cart merge failed', e);
        },
      }
    );
  }, [isAuthenticated, localCart.length, mergeCartMutation, setLocalCart]);

  // Sync cart changes to server (only for authenticated users)
  const syncToServer = async (items: CartItem[]) => {
    if (!isAuthenticated) return;
    const serverItems = toServerItems(items);
    try {
      await updateCartMutation.mutateAsync(serverItems);
    } catch (e) {
      console.error('Failed to update server cart', e);
    }
  };

  const addToCart = (item: CartItem) => {
    const existing = cartItems.find((i) => i.id === item.id);

    const updated = existing
      ? cartItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      : [...cartItems, { ...item }];

    if (isAuthenticated) {
      // For authenticated users, sync to server
      syncToServer(updated);
    } else {
      // For guests, update local storage
      setLocalCart(updated);
    }
  };

  const removeFromCart = (id: string) => {
    const updated = cartItems.filter((i) => i.id !== id);
    if (isAuthenticated) {
      // For authenticated users, sync to server
      syncToServer(updated);
    } else {
      // For guests, update local storage
      setLocalCart(updated);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    const updated =
      quantity <= 0
        ? cartItems.filter((i) => i.id !== id)
        : cartItems.map((i) => (i.id === id ? { ...i, quantity } : i));

    if (isAuthenticated) {
      // For authenticated users, sync to server
      syncToServer(updated);
    } else {
      // For guests, update local storage
      setLocalCart(updated);
    }
  };

  const clearCart = () => {
    if (isAuthenticated) {
      // For authenticated users, clear server cart
      clearCartMutation.mutate();
    } else {
      // For guests, clear local storage
      setLocalCart([]);
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartCount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
}
