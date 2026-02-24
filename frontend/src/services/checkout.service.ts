import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { ApiResponse } from '@/types/api-response';
import { CheckoutRequest } from '@/types/checkout';
import { Order } from '@/types/order';

// ---------------- CHECKOUT ----------------
export const checkout = async (data: CheckoutRequest): Promise<Order> => {
  const res = (await axiosInstance.post<ApiResponse<Order>>(
    ApiRoutes.checkout.create,
    data
  )) as unknown as ApiResponse<Order>;

  return unwrap(res);
};
