'use client';

import { Button } from '@/components/ui/button';
import { useDeleteProduct, useProducts } from '@/hooks/use-product';
import { useState } from 'react';

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, error } = useProducts({ page, limit });
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (isLoading) return <div className='p-8'>Loading products...</div>;
  if (error)
    return <div className='p-8 text-red-500'>Error: {error.message}</div>;

  const totalPages = data?.pages ?? 1;

  return (
    <main className='p-8 max-w-5xl mx-auto'>
      <h1 className='text-3xl font-bold mb-8'>Admin: Products</h1>
      <div className='mb-4 flex justify-end'>
        <Button className='bg-primary text-primary-foreground'>
          + Add Product
        </Button>
      </div>
      <div className='overflow-x-auto'>
        <table className='min-w-full border text-sm'>
          <thead>
            <tr className='bg-accent/20'>
              <th className='p-2 border'>Name</th>
              <th className='p-2 border'>SKU</th>
              <th className='p-2 border'>Price</th>
              <th className='p-2 border'>Stock</th>
              <th className='p-2 border'>Published</th>
              <th className='p-2 border'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.products.map((product) => (
              <tr key={product._id} className='hover:bg-accent/10'>
                <td className='p-2 border font-semibold'>{product.name}</td>
                <td className='p-2 border'>{product.sku}</td>
                <td className='p-2 border'>${product.basePrice.toFixed(2)}</td>
                <td className='p-2 border'>{product.stock}</td>
                <td className='p-2 border'>
                  {product.isPublished ? 'Yes' : 'No'}
                </td>
                <td className='p-2 border flex gap-2'>
                  <Button size='sm' variant='outline'>
                    Edit
                  </Button>
                  <Button
                    size='sm'
                    variant='destructive'
                    disabled={isDeleting && selectedId === product._id}
                    onClick={() => {
                      setSelectedId(product._id);
                      deleteProduct(product._id, {
                        onSettled: () => setSelectedId(null),
                      });
                    }}
                  >
                    {isDeleting && selectedId === product._id
                      ? 'Deleting...'
                      : 'Delete'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className='flex items-center justify-between mt-6'>
        <div className='text-sm text-muted-foreground'>
          Page {data?.page ?? page} of {totalPages} | Total: {data?.total ?? 0}{' '}
          products
        </div>
        <div className='flex gap-2'>
          <Button
            size='sm'
            variant='outline'
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <Button
            size='sm'
            variant='outline'
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}
