import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { ApiResponse } from '@/types/api-response';
import { Subcategory } from '@/types/subcategory';

// ---------------- GET ALL SUBCATEGORIES ----------------
export const getSubcategories = async (): Promise<Subcategory[]> => {
  const res = await axiosInstance.get<ApiResponse<Subcategory[]>>(
    ApiRoutes.subcategories.list
  );

  return unwrap(res.data);
};

// ---------------- GET SUBCATEGORY BY SLUG ----------------
export const getSubcategoryBySlug = async (
  slug: string
): Promise<Subcategory> => {
  const res = await axiosInstance.get<ApiResponse<Subcategory>>(
    ApiRoutes.subcategories.details(slug)
  );

  return unwrap(res.data);
};

// ---------------- GET SUBCATEGORY BY ID ----------------
export const getSubcategoryById = async (id: string): Promise<Subcategory> => {
  const res = await axiosInstance.get<ApiResponse<Subcategory>>(
    ApiRoutes.subcategories.byId(id)
  );

  return unwrap(res.data);
};

// ---------------- CREATE SUBCATEGORY (Moderator/Admin) ----------------
export const createSubcategory = async (
  data: Partial<Subcategory>
): Promise<Subcategory> => {
  const res = await axiosInstance.post<ApiResponse<Subcategory>>(
    ApiRoutes.subcategories.list,
    data
  );

  return unwrap(res.data);
};

// ---------------- UPDATE SUBCATEGORY (Moderator/Admin) ----------------
export const updateSubcategory = async (
  id: string,
  data: Partial<Subcategory>
): Promise<Subcategory> => {
  const res = await axiosInstance.patch<ApiResponse<Subcategory>>(
    ApiRoutes.subcategories.byId(id),
    data
  );

  return unwrap(res.data);
};

// ---------------- DELETE SUBCATEGORY (Moderator/Admin) ----------------
export const deleteSubcategory = async (id: string): Promise<null> => {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    ApiRoutes.subcategories.byId(id)
  );

  return unwrap(res.data);
};
