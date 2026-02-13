import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { ApiResponse } from '@/types/api-response';
import {
  Product,
  ProductListPayload,
  ProductQueryParams,
} from '@/types/product';

// ---------------- GET ALL PRODUCTS WITH PAGINATION ----------------
export const getProducts = async (
  params?: ProductQueryParams
): Promise<ProductListPayload> => {
  const res = await axiosInstance.get<ApiResponse<ProductListPayload>>(
    ApiRoutes.products.list,
    { params }
  );

  return unwrap(res.data);
};

// ---------------- GET PRODUCT BY SLUG ----------------
export const getProductBySlug = async (slug: string): Promise<Product> => {
  const res = await axiosInstance.get<ApiResponse<Product>>(
    ApiRoutes.products.details(slug)
  );

  return unwrap(res.data);
};

// ---------------- GET PRODUCT BY SKU ----------------
export const getProductBySku = async (sku: string): Promise<Product> => {
  const res = await axiosInstance.get<ApiResponse<Product>>(
    ApiRoutes.products.bySku(sku)
  );

  return unwrap(res.data);
};

// ---------------- GET PRODUCT BY ID ----------------
export const getProductById = async (id: string): Promise<Product> => {
  const res = await axiosInstance.get<ApiResponse<Product>>(
    ApiRoutes.products.byId(id)
  );

  return unwrap(res.data);
};

// ---------------- CREATE PRODUCT (Moderator/Admin) ----------------
export const createProduct = async (
  data: Partial<Product>
): Promise<Product> => {
  const res = await axiosInstance.post<ApiResponse<Product>>(
    ApiRoutes.products.list,
    data
  );

  return unwrap(res.data);
};

// ---------------- UPDATE PRODUCT (Moderator/Admin) ----------------
export const updateProduct = async (
  id: string,
  data: Partial<Product>
): Promise<Product> => {
  const res = await axiosInstance.patch<ApiResponse<Product>>(
    ApiRoutes.products.byId(id),
    data
  );

  return unwrap(res.data);
};

// ---------------- DELETE PRODUCT (Admin Only) ----------------
export const deleteProduct = async (id: string): Promise<null> => {
  const res = await axiosInstance.delete<ApiResponse<null>>(
    ApiRoutes.products.byId(id)
  );

  return unwrap(res.data);
};
