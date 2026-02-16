import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { ApiResponse } from '@/types/api-response';
import { Cart, CartItem } from '@/types/cart';

// ---------------- GET USER CART ----------------
export const getCart = async (): Promise<Cart> => {
  const res = (await axiosInstance.get<ApiResponse<Cart>>(
    ApiRoutes.cart.list
  )) as unknown as ApiResponse<Cart>;

  return unwrap(res);
};

// ---------------- CREATE CART ----------------
// Usually not needed manually, but keeping for completeness
export const createCart = async (items: CartItem[]): Promise<Cart> => {
  const res = (await axiosInstance.post<ApiResponse<Cart>>(
    ApiRoutes.cart.addItem,
    { items }
  )) as unknown as ApiResponse<Cart>;

  return unwrap(res);
};

// ---------------- UPDATE CART ----------------
export const updateCart = async (items: CartItem[]): Promise<Cart> => {
  const res = (await axiosInstance.patch<ApiResponse<Cart>>(
    ApiRoutes.cart.update,
    { items }
  )) as unknown as ApiResponse<Cart>;

  return unwrap(res);
};

// ---------------- MERGE GUEST CART ----------------
export const mergeCart = async (
  guestItems: {
    product: string;
    quantity: number;
  }[]
): Promise<Cart> => {
  const res = (await axiosInstance.post<ApiResponse<Cart>>(
    ApiRoutes.cart.merge,
    { items: guestItems }
  )) as unknown as ApiResponse<Cart>;

  return unwrap(res);
};

// ---------------- REMOVE SINGLE ITEM ----------------
export const removeCartItem = async (itemId: string): Promise<Cart> => {
  const res = (await axiosInstance.delete<ApiResponse<Cart>>(
    ApiRoutes.cart.removeItem(itemId)
  )) as unknown as ApiResponse<Cart>;

  return unwrap(res);
};

// ---------------- CLEAR CART ----------------
export const clearCart = async (): Promise<null> => {
  const res = (await axiosInstance.delete<ApiResponse<null>>(
    ApiRoutes.cart.clear
  )) as unknown as ApiResponse<null>;

  return unwrap(res);
};
