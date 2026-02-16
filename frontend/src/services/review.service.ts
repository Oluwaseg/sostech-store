import { ApiRoutes } from '@/api';
import axiosInstance from '@/lib/axios';
import { unwrap } from '@/lib/unwrap';
import { ApiResponse } from '@/types/api-response';
import { Review } from '@/types/review';

// ---------------- GET REVIEWS BY PRODUCT ----------------
export const getReviewsByProduct = async (
  productId: string
): Promise<Review[]> => {
  const res = (await axiosInstance.get<ApiResponse<Review[]>>(
    ApiRoutes.reviews.listByProduct(productId)
  )) as unknown as ApiResponse<Review[]>;

  return unwrap(res);
};

// ---------------- GET REVIEW BY ID ----------------
export const getReviewById = async (id: string): Promise<Review> => {
  const res = (await axiosInstance.get<ApiResponse<Review>>(
    ApiRoutes.reviews.details(id)
  )) as unknown as ApiResponse<Review>;

  return unwrap(res);
};

// ---------------- CREATE REVIEW ----------------
export const createReview = async (
  productId: string,
  data: { rating: number; comment?: string }
): Promise<Review> => {
  const res = (await axiosInstance.post<ApiResponse<Review>>(
    ApiRoutes.reviews.listByProduct(productId),
    data
  )) as unknown as ApiResponse<Review>;

  return unwrap(res);
};

// ---------------- UPDATE REVIEW ----------------
export const updateReview = async (
  reviewId: string,
  data: { rating: number; comment?: string }
): Promise<Review> => {
  const res = (await axiosInstance.patch<ApiResponse<Review>>(
    ApiRoutes.reviews.details(reviewId),
    data
  )) as unknown as ApiResponse<Review>;

  return unwrap(res);
};

// ---------------- DELETE REVIEW ----------------
export const deleteReview = async (reviewId: string): Promise<null> => {
  const res = (await axiosInstance.delete<ApiResponse<null>>(
    ApiRoutes.reviews.details(reviewId)
  )) as unknown as ApiResponse<null>;

  return unwrap(res);
};
