import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { checkout } from '@/services/checkout.service';
import { CheckoutRequest } from '@/types/checkout';
import { Order } from '@/types/order';

/* ===============================
   CHECKOUT
================================= */

export const useCheckout = () => {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, CheckoutRequest>({
    mutationFn: checkout,

    onSuccess: (order) => {
      // 🔄 Cart is now empty on backend
      queryClient.invalidateQueries({ queryKey: ['cart'] });

      // 🔄 Orders list (if you have one)
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      toast.success('Checkout completed successfully 🧾');

      // If you want navigation, do it in the component:
      // router.push(`/orders/${order._id}`)
    },

    onError: (error) => {
      toast.error(error.message || 'Checkout failed');
    },
  });
};
