import { useCreateProduct, useUpdateProduct } from '@/hooks/use-product';

export const useProductActions = () => {
  const create = useCreateProduct();
  const update = useUpdateProduct();

  return {
    createProduct: create.mutate,
    isCreating: create.isPending,

    updateProduct: update.mutate,
    isUpdating: update.isPending,
  };
};
