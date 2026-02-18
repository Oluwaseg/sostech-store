import {
  createReview,
  deleteReview,
  getReviewById,
  getReviewsByProduct,
} from '@/services/review.service';
import { Review, ReviewListResponse } from '@/types/review';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/* ===============================
   Query Keys
================================= */

const REVIEW_KEYS = {
  all: ['reviews'] as const,
  lists: (productId: string) =>
    [...REVIEW_KEYS.all, 'list', productId] as const,
  detail: (id: string) => [...REVIEW_KEYS.all, 'detail', id] as const,
};

/* ===============================
   GET REVIEWS BY PRODUCT
================================= */

export const useReviewsByProduct = (productId: string) => {
  return useQuery<ReviewListResponse, Error>({
    queryKey: REVIEW_KEYS.lists(productId),
    queryFn: () => getReviewsByProduct(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
};

/* ===============================
   GET REVIEW BY ID
================================= */

export const useReviewById = (id: string) => {
  return useQuery<Review, Error>({
    queryKey: REVIEW_KEYS.detail(id),
    queryFn: () => getReviewById(id),
    enabled: !!id,
  });
};

/* ===============================
   CREATE REVIEW
================================= */

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Review,
    Error,
    { productId: string; data: { rating: number; comment?: string } }
  >({
    mutationFn: ({ productId, data }) => createReview(productId, data),

    onSuccess: (review, variables) => {
      // Refetch reviews list (safe for upsert)
      queryClient.invalidateQueries({
        queryKey: REVIEW_KEYS.lists(variables.productId),
      });

      // Refetch product detail (averageRating, reviewCount, etc.)
      queryClient.invalidateQueries({
        queryKey: ['products', 'detail', variables.productId],
      });

      const msg =
        review.createdAt === review.updatedAt
          ? 'Review created successfully'
          : 'Review updated successfully';

      toast.success(msg);
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to submit review');
    },
  });
};

/* ===============================
   DELETE REVIEW
================================= */

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation<null, Error, { reviewId: string; productId: string }>({
    mutationFn: ({ reviewId }) => deleteReview(reviewId),

    onSuccess: (_, variables) => {
      // Remove from product review list cache
      queryClient.setQueryData<Review[]>(
        REVIEW_KEYS.lists(variables.productId),
        (old = []) => old.filter((review) => review._id !== variables.reviewId)
      );

      toast.success('Review deleted successfully');
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to delete review');
    },
  });
};
