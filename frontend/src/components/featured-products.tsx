'use client';

import { Button } from '@/components/ui/button';
import { useCurrency } from '@/contexts/currency-context';
import { useProducts } from '@/hooks/use-product';
import { formatPrice } from '@/lib/format-price';
import type { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';

interface FeaturedProductsSectionProps {
  title: string;
  subtitle: string;
  viewAllHref: string;
  filter: {
    flashSaleActive?: boolean;
    isBestSeller?: boolean;
  };
}

function ProductCard({ product }: { product: Product }) {
  const { currency, convert } = useCurrency();
  const hasFlashSale = product.flashSale && product.flashSale.isActive;
  const salePrice = hasFlashSale
    ? product.flashSale!.discountType === 'percentage'
      ? product.basePrice * (1 - product.flashSale!.discountValue / 100)
      : product.basePrice - product.flashSale!.discountValue
    : product.basePrice;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className='group block overflow-hidden rounded-3xl border border-border bg-white transition-shadow duration-300 hover:shadow-xl'
    >
      <div className='relative h-64 bg-muted'>
        <Image
          src={product.images?.[0]?.url ?? '/placeholder.png'}
          alt={product.name}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-105'
        />
        {hasFlashSale && (
          <span className='absolute top-4 left-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground'>
            Flash Sale
          </span>
        )}
        {!hasFlashSale && product.isBestSeller && (
          <span className='absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground'>
            Best Seller
          </span>
        )}
      </div>
      <div className='p-5 space-y-3'>
        <div>
          <h3 className='text-lg font-semibold text-foreground line-clamp-2'>
            {product.name}
          </h3>
          <p className='mt-2 text-sm text-foreground/70 line-clamp-2'>
            {product.description}
          </p>
        </div>
        <div className='flex items-center justify-between gap-3'>
          <div className='space-y-1'>
            <p className='text-xl font-bold text-foreground'>
              {formatPrice(convert(salePrice), currency)}
            </p>
            {hasFlashSale && (
              <p className='text-sm text-foreground/50 line-through'>
                {formatPrice(convert(product.basePrice), currency)}
              </p>
            )}
          </div>
          <Button size='sm' variant='secondary'>
            View
          </Button>
        </div>
      </div>
    </Link>
  );
}

function FeaturedProductsSection({
  title,
  subtitle,
  viewAllHref,
  filter,
}: FeaturedProductsSectionProps) {
  const { data, isLoading } = useProducts({
    page: 1,
    limit: 4,
    ...filter,
  });

  const products = data?.products ?? [];

  return (
    <section className='py-16'>
      <div className='container mx-auto px-4'>
        <div className='mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h2 className='text-4xl font-bold'>{title}</h2>
            <p className='mt-3 max-w-2xl text-foreground/70'>{subtitle}</p>
          </div>
          <Link
            href={viewAllHref}
            className='inline-flex rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors'
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className='h-96 rounded-3xl bg-card/50 animate-pulse'
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className='rounded-3xl border border-border bg-card p-10 text-center text-foreground/70'>
            No products available right now.
          </div>
        )}
      </div>
    </section>
  );
}

export function FlashSaleProducts() {
  return (
    <FeaturedProductsSection
      title='Flash Sale'
      subtitle='Shop limited-time deals on the best products.'
      viewAllHref='/shop?flashSaleActive=true'
      filter={{ flashSaleActive: true }}
    />
  );
}

export function BestSellerProducts() {
  return (
    <FeaturedProductsSection
      title='Best Sellers'
      subtitle='Explore the highest-rated products loved by shoppers.'
      viewAllHref='/shop?isBestSeller=true'
      filter={{ isBestSeller: true }}
    />
  );
}
