import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
} from '@/services/category.service';
import { Category } from '@/types/category';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/* ===============================
   Query Keys
================================= */
const CATEGORY_KEYS = {
  all: ['categories'] as const,
  detail: (identifier: string) =>
    [...CATEGORY_KEYS.all, 'detail', identifier] as const,
};

/* ===============================
   GET ALL CATEGORIES
================================= */
export const useCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: CATEGORY_KEYS.all,
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5,
  });
};

/* ===============================
   GET CATEGORY BY SLUG
================================= */
export const useCategoryBySlug = (slug: string) => {
  return useQuery<Category, Error>({
    queryKey: CATEGORY_KEYS.detail(slug),
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
  });
};

/* ===============================
   GET CATEGORY BY ID
================================= */
export const useCategoryById = (id: string) => {
  return useQuery<Category, Error>({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
};

/* ===============================
   CREATE CATEGORY (Admin/Moderator)
================================= */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, Partial<Category>>({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success('Category created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create category');
    },
  });
};

/* ===============================
   UPDATE CATEGORY
================================= */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, { id: string; data: Partial<Category> }>({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(CATEGORY_KEYS.detail(data._id), data);
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success('Category updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update category');
    },
  });
};

/* ===============================
   DELETE CATEGORY
================================= */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<null, Error, string>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete category');
    },
  });
};
