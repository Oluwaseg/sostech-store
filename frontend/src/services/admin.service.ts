import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { AdminDashboardPayload } from '@/types/admin-dashboard';
import { ApiResponse } from '@/types/api-response';
import { Cart } from '@/types/cart';
import { EditUser, User } from '@/types/user';

export interface AbandonedCartReminderResult {
  checked: number;
  sent: number;
  skipped: number;
  errors: number;
}

// ---------------- GET ALL USERS ----------------
export const getAllUsers = async (role?: string): Promise<User[]> => {
  const res = (await axiosInstance.get<ApiResponse<User[]>>(
    ApiRoutes.admin.users,
    { params: role ? { role } : undefined }
  )) as unknown as ApiResponse<User[]>;
  return unwrap(res);
};

// ---------------- EDIT USER ----------------
export const editUser = async (id: string, data: EditUser): Promise<User> => {
  const res = (await axiosInstance.patch<ApiResponse<User>>(
    ApiRoutes.admin.editUser(id),
    data
  )) as unknown as ApiResponse<User>;
  return unwrap(res);
};

// ---------------- DELETE USER ----------------
export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(ApiRoutes.admin.deleteUser(id));
};

// ---------------- GET DASHBOARD ----------------
export const getAdminDashboard = async (): Promise<AdminDashboardPayload> => {
  const res = (await axiosInstance.get<ApiResponse<AdminDashboardPayload>>(
    ApiRoutes.admin.dashboard
  )) as unknown as ApiResponse<AdminDashboardPayload>;

  return unwrap(res);
};

// ---------------- ABANDONED CARTS ----------------
export const getAbandonedCarts = async (days?: number): Promise<Cart[]> => {
  const res = (await axiosInstance.get<ApiResponse<Cart[]>>(
    ApiRoutes.admin.abandonedCarts,
    { params: days ? { days } : undefined }
  )) as unknown as ApiResponse<Cart[]>;

  return unwrap(res);
};

export const sendAbandonedCartReminders = async (
  days?: number
): Promise<AbandonedCartReminderResult> => {
  const res = (await axiosInstance.post<
    ApiResponse<AbandonedCartReminderResult>
  >(ApiRoutes.admin.abandonedCartReminders, {
    days,
  })) as unknown as ApiResponse<AbandonedCartReminderResult>;

  return unwrap(res);
};
