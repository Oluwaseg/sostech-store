import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { ApiResponse } from '@/types/api-response';
import { Category } from '@/types/category';

// ---------------- GET ALL CATEGORIES ----------------
export const getCategories = async (): Promise<Category[]> => {
  const res = await axiosInstance.get<ApiResponse<Category[]>>(
    ApiRoutes.categories.list
  );

  return unwrap(res.data);
};

// ---------------- GET CATEGORY BY SLUG ----------------
export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const res = await axiosInstance.get<ApiResponse<Category>>(
    ApiRoutes.categories.details(slug)
  );

  return unwrap(res.data);
};

// ---------------- GET CATEGORY BY ID ----------------
export const getCategoryById = async (id: string): Promise<Category> => {
  const res = await axiosInstance.get<ApiResponse<Category>>(
    ApiRoutes.categories.byId(id)
  );

  return unwrap(res.data);
};

// ---------------- CREATE CATEGORY (Moderator/Admin) ----------------
export const createCategory = async (
  data: Partial<Category>
): Promise<Category> => {
  const res = await axiosInstance.post<ApiResponse<Category>>(
    ApiRoutes.categories.list,
    data
  );

  return unwrap(res.data);
};

// ---------------- UPDATE CATEGORY (Moderator/Admin) ----------------
export const updateCategory = async (
  id: string,
  data: Partial<Category>
): Promise<Category> => {
  const res = await axiosInstance.patch<ApiResponse<Category>>(
    ApiRoutes.categories.byId(id),
    data
  );

  return unwrap(res.data);
};

// ---------------- DELETE CATEGORY (Moderator/Admin) ----------------
export const deleteCategory = async (id: string): Promise<null> => {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    ApiRoutes.categories.byId(id)
  );

  return unwrap(res.data);
};
