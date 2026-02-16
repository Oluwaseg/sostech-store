import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { ApiResponse } from '@/types/api-response';
import { Category } from '@/types/category';

// ---------------- GET ALL CATEGORIES ----------------
export const getCategories = async (): Promise<Category[]> => {
  const res = (await axiosInstance.get<ApiResponse<Category[]>>(
    ApiRoutes.categories.list
  )) as unknown as ApiResponse<Category[]>;

  return unwrap(res);
};

// ---------------- GET CATEGORY BY SLUG ----------------
export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const res = (await axiosInstance.get<ApiResponse<Category>>(
    ApiRoutes.categories.details(slug)
  )) as unknown as ApiResponse<Category>;

  return unwrap(res);
};

// ---------------- GET CATEGORY BY ID ----------------
export const getCategoryById = async (id: string): Promise<Category> => {
  const res = (await axiosInstance.get<ApiResponse<Category>>(
    ApiRoutes.categories.byId(id)
  )) as unknown as ApiResponse<Category>;

  return unwrap(res);
};

// ---------------- CREATE CATEGORY (Moderator/Admin) ----------------
export const createCategory = async (
  data: Partial<Category>
): Promise<Category> => {
  const res = (await axiosInstance.post<ApiResponse<Category>>(
    ApiRoutes.categories.list,
    data
  )) as unknown as ApiResponse<Category>;

  return unwrap(res);
};

// ---------------- UPDATE CATEGORY (Moderator/Admin) ----------------
export const updateCategory = async (
  id: string,
  data: Partial<Category>
): Promise<Category> => {
  const res = (await axiosInstance.patch<ApiResponse<Category>>(
    ApiRoutes.categories.byId(id),
    data
  )) as unknown as ApiResponse<Category>;

  return unwrap(res);
};

// ---------------- DELETE CATEGORY (Moderator/Admin) ----------------
export const deleteCategory = async (id: string): Promise<null> => {
  const res = (await axiosInstance.delete<ApiResponse<null>>(
    ApiRoutes.categories.byId(id)
  )) as unknown as ApiResponse<null>;

  return unwrap(res);
};
