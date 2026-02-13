import {
  clearCart,
  getCart,
  mergeCart,
  removeCartItem,
  updateCart,
} from '@/services/cart.service';
import { Cart, CartItem } from '@/types/cart';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const CART_QUERY_KEY = ['cart'];

// ---------------- GET CART ----------------
export const useCart = () => {
  return useQuery<Cart, Error>({
    queryKey: CART_QUERY_KEY,
    queryFn: getCart,
    staleTime: 1000 * 60, // 1 min cache
  });
};

// ---------------- UPDATE CART ----------------
export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, CartItem[]>({
    mutationFn: updateCart,

    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
      toast.success('Cart updated');
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to update cart');
    },
  });
};

// ---------------- REMOVE ITEM ----------------
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, string>({
    mutationFn: removeCartItem,

    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
      toast.success('Item removed from cart');
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to remove item');
    },
  });
};

// ---------------- CLEAR CART ----------------
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation<null, Error>({
    mutationFn: clearCart,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
      toast.success('Cart cleared');
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to clear cart');
    },
  });
};

// ---------------- MERGE GUEST CART ----------------
export const useMergeCart = () => {
  const queryClient = useQueryClient();

  return useMutation<Cart, Error, { product: string; quantity: number }[]>({
    mutationFn: mergeCart,

    onSuccess: (data) => {
      queryClient.setQueryData(CART_QUERY_KEY, data);
      toast.success('Cart merged successfully');
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to merge cart');
    },
  });
};
