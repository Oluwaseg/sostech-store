'use client';

import { useCategoryBySlug } from '@/hooks/use-category';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const { data: category, isLoading, isError } = useCategoryBySlug(slug ?? '');

  if (!slug) {
    return (
      <main className='min-h-screen py-20'>
        <div className='container mx-auto px-4'>
          <p className='text-foreground/70'>Invalid category slug.</p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className='min-h-screen py-20'>
        <div className='container mx-auto px-4'>
          <h1 className='text-4xl font-bold mb-8'>Loading category…</h1>
          <div className='h-64 rounded-3xl bg-card/50 animate-pulse' />
        </div>
      </main>
    );
  }

  if (isError || !category) {
    return (
      <main className='min-h-screen py-20'>
        <div className='container mx-auto px-4'>
          <h1 className='text-4xl font-bold mb-6'>Category not found</h1>
          <p className='text-foreground/70'>
            Please return to the category list to choose another option.
          </p>
          <Link
            href='/category'
            className='mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground'
          >
            Back to categories
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen py-20'>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl space-y-8'>
          <div>
            <p className='text-sm uppercase tracking-[0.3em] text-primary/80'>
              Category
            </p>
            <h1 className='mt-3 text-5xl font-bold'>{category.name}</h1>
            <p className='mt-4 text-base leading-7 text-foreground/70'>
              {category.description ??
                'This category does not have a description yet.'}
            </p>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <div className='rounded-3xl border border-border bg-card p-6'>
              <h2 className='text-lg font-semibold mb-3'>Category details</h2>
              <dl className='space-y-3 text-sm text-foreground/70'>
                <div className='flex justify-between'>
                  <dt>Name</dt>
                  <dd className='font-medium text-foreground'>
                    {category.name}
                  </dd>
                </div>
                <div className='flex justify-between'>
                  <dt>Slug</dt>
                  <dd className='font-medium text-foreground'>
                    {category.slug}
                  </dd>
                </div>
                <div className='flex justify-between'>
                  <dt>Published</dt>
                  <dd className='font-medium text-foreground'>
                    {category.isPublished ? 'Yes' : 'No'}
                  </dd>
                </div>
              </dl>
            </div>

            <div className='rounded-3xl border border-border bg-card p-6 flex flex-col justify-between'>
              <div>
                <h2 className='text-lg font-semibold mb-3'>Explore products</h2>
                <p className='text-sm leading-6 text-foreground/70'>
                  Browse the shop filtered by this category to see available
                  products.
                </p>
              </div>
              <Link
                href={`/shop?category=${category._id}`}
                className='mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground'
              >
                View products
              </Link>
            </div>
          </div>

          <Link
            href='/category'
            className='inline-flex rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors'
          >
            Back to categories
          </Link>
        </div>
      </div>
    </main>
  );
}
