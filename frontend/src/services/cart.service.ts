import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { ApiResponse } from '@/types/api-response';
import { Cart, CartItem } from '@/types/cart';

// ---------------- GET USER CART ----------------
export const getCart = async (): Promise<Cart> => {
  const res = await axiosInstance.get<ApiResponse<Cart>>(ApiRoutes.cart.list);

  return unwrap(res.data);
};

// ---------------- CREATE CART ----------------
// Usually not needed manually, but keeping for completeness
export const createCart = async (items: CartItem[]): Promise<Cart> => {
  const res = await axiosInstance.post<ApiResponse<Cart>>(
    ApiRoutes.cart.addItem,
    { items }
  );

  return unwrap(res.data);
};

// ---------------- UPDATE CART ----------------
export const updateCart = async (items: CartItem[]): Promise<Cart> => {
  const res = await axiosInstance.patch<ApiResponse<Cart>>(
    ApiRoutes.cart.update,
    { items }
  );

  return unwrap(res.data);
};

// ---------------- MERGE GUEST CART ----------------
export const mergeCart = async (
  guestItems: {
    product: string;
    quantity: number;
  }[]
): Promise<Cart> => {
  const res = await axiosInstance.post<ApiResponse<Cart>>(
    ApiRoutes.cart.merge,
    { items: guestItems }
  );

  return unwrap(res.data);
};

// ---------------- REMOVE SINGLE ITEM ----------------
export const removeCartItem = async (itemId: string): Promise<Cart> => {
  const res = await axiosInstance.delete<ApiResponse<Cart>>(
    ApiRoutes.cart.removeItem(itemId)
  );

  return unwrap(res.data);
};

// ---------------- CLEAR CART ----------------
export const clearCart = async (): Promise<null> => {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    ApiRoutes.cart.clear
  );

  return unwrap(res.data);
};
