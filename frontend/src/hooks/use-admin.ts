import {
  AbandonedCartReminderResult,
  deleteUser,
  editUser,
  getAbandonedCarts,
  getAdminDashboard,
  getAllUsers,
  sendAbandonedCartReminders,
} from '@/services/admin.service';
import { AdminDashboardPayload } from '@/types/admin-dashboard';
import { Cart } from '@/types/cart';
import { EditUser, User } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// ---------------- GET ALL USERS (ADMIN) ----------------
export const useGetAllUsers = (role?: string) => {
  return useQuery<User[]>({
    queryKey: ['allUsers', role],
    queryFn: () => getAllUsers(role),
  });
};

// ---------------- GET ADMIN DASHBOARD ----------------
export const useAdminDashboard = () => {
  return useQuery<AdminDashboardPayload>({
    queryKey: ['adminDashboard'],
    queryFn: getAdminDashboard,
  });
};

// ---------------- EDIT USER (ADMIN) ----------------
export const useEditUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, unknown, { id: string; data: EditUser }>({
    mutationFn: ({ id, data }) => editUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
};

// ---------------- DELETE USER (ADMIN) ----------------
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, { id: string }>({
    mutationFn: ({ id }) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
};
// ---------------- GET ABANDONED CARTS (ADMIN) ----------------
export const useGetAbandonedCarts = (days?: number) => {
  return useQuery<Cart[], Error>({
    queryKey: ['adminAbandonedCarts', days],
    queryFn: () => getAbandonedCarts(days),
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });
};

// ---------------- SEND ABANDONED CART REMINDERS (ADMIN) ----------------
export const useSendAbandonedCartReminders = () => {
  const queryClient = useQueryClient();
  return useMutation<AbandonedCartReminderResult, Error, number | undefined>({
    mutationFn: sendAbandonedCartReminders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAbandonedCarts'] });
      toast.success('Abandoned cart reminders sent successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send abandoned cart reminders');
    },
  });
};
