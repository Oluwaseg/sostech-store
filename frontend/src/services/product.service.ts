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
  const res = (await axiosInstance.get<ApiResponse<ProductListPayload>>(
    ApiRoutes.products.list,
    { params }
  )) as unknown as ApiResponse<ProductListPayload>;

  return unwrap(res);
};

// ---------------- GET PRODUCT BY SLUG ----------------
export const getProductBySlug = async (slug: string): Promise<Product> => {
  const res = (await axiosInstance.get<ApiResponse<Product>>(
    ApiRoutes.products.details(slug)
  )) as unknown as ApiResponse<Product>;

  return unwrap(res);
};

// ---------------- GET PRODUCT BY SKU ----------------
export const getProductBySku = async (sku: string): Promise<Product> => {
  const res = (await axiosInstance.get<ApiResponse<Product>>(
    ApiRoutes.products.bySku(sku)
  )) as unknown as ApiResponse<Product>;

  return unwrap(res);
};

// ---------------- GET PRODUCT BY ID ----------------
export const getProductById = async (id: string): Promise<Product> => {
  const res = (await axiosInstance.get<ApiResponse<Product>>(
    ApiRoutes.products.byId(id)
  )) as unknown as ApiResponse<Product>;

  return unwrap(res);
};

// ---------------- CREATE PRODUCT (Moderator/Admin) ----------------
export const createProduct = async (
  data: Partial<Product>
): Promise<Product> => {
  const res = (await axiosInstance.post<ApiResponse<Product>>(
    ApiRoutes.products.list,
    data
  )) as unknown as ApiResponse<Product>;

  return unwrap(res);
};

// ---------------- UPDATE PRODUCT (Moderator/Admin) ----------------
export const updateProduct = async (
  id: string,
  data: Partial<Product>
): Promise<Product> => {
  const res = (await axiosInstance.patch<ApiResponse<Product>>(
    ApiRoutes.products.byId(id),
    data
  )) as unknown as ApiResponse<Product>;

  return unwrap(res);
};

// ---------------- DELETE PRODUCT (Admin Only) ----------------
export const deleteProduct = async (id: string): Promise<null> => {
  const res = (await axiosInstance.delete<ApiResponse<null>>(
    ApiRoutes.products.byId(id)
  )) as unknown as ApiResponse<null>;

  return unwrap(res);
};

// ---------------- GET OTHER PRODUCTS ----------------
export const getOtherProducts = async (slug: string): Promise<Product[]> => {
  const res = (await axiosInstance.get<ApiResponse<Product[]>>(
    ApiRoutes.products.others(slug)
  )) as unknown as ApiResponse<Product[]>;

  return unwrap(res);
};
