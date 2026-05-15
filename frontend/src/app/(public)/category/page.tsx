'use client';

import { useCategories } from '@/hooks/use-category';
import Link from 'next/link';

export default function CategoryPage() {
  const { data: categories, isLoading, isError } = useCategories();
  const publishedCategories =
    categories?.filter((category) => category.isPublished) ?? [];

  if (isLoading) {
    return (
      <main className='min-h-screen py-20'>
        <div className='container mx-auto px-4'>
          <h1 className='text-4xl font-bold mb-8'>Categories</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className='h-40 rounded-3xl bg-card/50 animate-pulse'
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className='min-h-screen py-20'>
        <div className='container mx-auto px-4'>
          <h1 className='text-4xl font-bold mb-6'>Categories</h1>
          <p className='text-foreground/70'>
            Unable to load categories right now.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen py-20'>
      <div className='container mx-auto px-4'>
        <div className='mb-10'>
          <h1 className='text-4xl font-bold'>Categories</h1>
          <p className='mt-3 text-foreground/70 max-w-2xl'>
            Browse all available categories and explore the products inside each
            one.
          </p>
        </div>

        {publishedCategories.length === 0 ? (
          <div className='rounded-3xl border border-border p-10 text-center text-foreground/70'>
            No published categories found.
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
            {publishedCategories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category.slug}`}
                className='group block rounded-3xl border border-border bg-background p-6 transition-shadow hover:shadow-lg'
              >
                <div className='flex items-center justify-between gap-4 mb-4'>
                  <h2 className='text-2xl font-semibold'>{category.name}</h2>
                  <span className='text-sm text-foreground/60'>View</span>
                </div>
                <p className='text-sm leading-relaxed text-foreground/70'>
                  {category.description ?? 'No description available.'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
