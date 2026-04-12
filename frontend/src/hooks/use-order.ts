import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  downloadMyOrderInvoice,
  getAllOrdersAdmin,
  getMyOrderById,
  getMyOrders,
  getOrderByIdAdmin,
  updateOrderStatusAdmin,
} from '@/services/order.service';
import {
  AdminOrder,
  AdminOrdersWithStats,
  Order,
  OrdersWithStats,
  ShippingStatus,
} from '@/types/order';

/* ===============================
   USER ORDERS
================================= */

export const useMyOrders = () => {
  return useQuery<OrdersWithStats, Error>({
    queryKey: ['orders'],
    queryFn: getMyOrders,
  });
};

export const useMyOrder = (id?: string) => {
  return useQuery<Order, Error>({
    queryKey: ['orders', id],
    queryFn: () => getMyOrderById(id as string),
    enabled: Boolean(id),
  });
};

/* ===============================
   ADMIN ORDERS
================================= */

export const useAdminOrders = () => {
  return useQuery<AdminOrdersWithStats, Error>({
    queryKey: ['admin', 'orders'],
    queryFn: getAllOrdersAdmin,
  });
};

export const useAdminOrder = (id?: string) => {
  return useQuery<AdminOrder, Error>({
    queryKey: ['admin', 'orders', id],
    queryFn: () => getOrderByIdAdmin(id as string),
    enabled: Boolean(id),
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AdminOrder,
    Error,
    {
      id: string;
      status: ShippingStatus;
    }
  >({
    mutationFn: updateOrderStatusAdmin,
    onSuccess: () => {
      toast.success('Order status updated');
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update order status');
    },
  });
};

export const useDownloadInvoice = () => {
  return useMutation<Blob, Error, string>({
    mutationFn: downloadMyOrderInvoice,
    onSuccess: (blob) => {
      if (!blob || !(blob instanceof Blob)) {
        toast.error('Invalid invoice data received');
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Invoice downloaded');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to download invoice');
    },
  });
};
