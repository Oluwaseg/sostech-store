'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useCurrency } from '@/contexts/currency-context';
import { useProducts } from '@/hooks/use-product';
import { formatPrice } from '@/lib/format-price';
import type { Product } from '@/types/product';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

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

  const discountPercent =
    hasFlashSale && product.flashSale!.discountType === 'percentage'
      ? Math.round(product.flashSale!.discountValue)
      : null;

  const flashSaleEndDate = hasFlashSale
    ? new Date(product.flashSale!.endsAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className='group p-1 flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:shadow-xl hover:border-brand/50 h-full'
    >
      {/* Image Container */}
      <div className='relative h-56 overflow-hidden flex-shrink-0'>
        <Image
          src={product.images?.[0]?.url ?? '/placeholder.png'}
          alt={product.name}
          fill
          className='object-cover transition-transform duration-500 group-hover:scale-105 rounded-xl'
        />
        {/* Overlay Gradient on Hover */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

        {/* Badges Container */}
        <div className='absolute inset-0 flex items-start justify-between p-3 pointer-events-none'>
          {hasFlashSale && (
            <div className='flex gap-2 items-start'>
              <span className='rounded-md bg-red-500/95 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm shadow-sm'>
                -{discountPercent}%
              </span>
              <span className='rounded-md bg-orange-500/95 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm shadow-sm'>
                {flashSaleEndDate}
              </span>
            </div>
          )}
          {!hasFlashSale && product.isBestSeller && (
            <span className='rounded-md bg-amber-400/95 px-2.5 py-1 text-xs font-bold text-foreground backdrop-blur-sm shadow-sm'>
              ★ Best Seller
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className='flex flex-col flex-grow p-4 gap-2.5'>
        {/* Title */}
        <h3 className='text-sm font-semibold text-foreground line-clamp-2 leading-snug'>
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className='text-xs text-foreground/50 line-clamp-1 leading-relaxed'>
            {product.description}
          </p>
        )}

        {/* Spacer */}
        <div className='flex-grow' />

        {/* Pricing Section */}
        <div className='pt-3 border-t border-border/40'>
          <div className='flex items-baseline gap-2'>
            <p className='text-base font-bold text-foreground'>
              {formatPrice(convert(salePrice), currency)}
            </p>
            {hasFlashSale && (
              <p className='text-xs text-foreground/40 line-through font-medium'>
                {formatPrice(convert(product.basePrice), currency)}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function FeaturedProductsSection({
  title,
  viewAllHref,
  filter,
}: FeaturedProductsSectionProps) {
  const { data, isLoading } = useProducts({
    page: 1,
    limit: 8,
    ...filter,
  });

  const products = data?.products ?? [];
  const [api, setApi] = useState<CarouselApi>();
  const pluginRef = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  return (
    <section className='py-12 md:py-16 bg-surface'>
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h2 className='text-3xl md:text-4xl font-bold text-foreground'>
              {title}
            </h2>
          </div>
          <Link
            href={viewAllHref}
            className='inline-flex items-center text-sm font-semibold text-brand hover:text-brand/80 transition-colors group'
          >
            VIEW ALL
            <span className='ml-2 group-hover:translate-x-1 transition-transform'>
              →
            </span>
          </Link>
        </div>

        {isLoading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className='rounded-2xl bg-card/50 animate-pulse h-96'
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[pluginRef.current]}
            setApi={setApi}
            className='w-full'
          >
            <CarouselContent className='-ml-4'>
              {products.map((product) => (
                <CarouselItem
                  key={product._id}
                  className='pl-4 basis-full sm:basis-1/2 lg:basis-1/4'
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Navigation Buttons */}
            <div className='flex justify-end gap-2 mt-8'>
              <CarouselPrevious className='relative static w-10 h-10 border border-border hover:bg-accent/10' />
              <CarouselNext className='relative static w-10 h-10 border border-border hover:bg-accent/10' />
            </div>
          </Carousel>
        ) : (
          <div className='rounded-2xl border border-border bg-card p-12 text-center'>
            <p className='text-foreground/60'>
              No products available right now.
            </p>
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
