'use client';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useCartContext } from '@/contexts/cart-context';
import { useCurrency } from '@/contexts/currency-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { useProductBySlug } from '@/hooks/use-product';
import { useCreateReview, useReviewsByProduct } from '@/hooks/use-review';
import { formatPrice } from '@/lib/format-price';
import {
  AlertCircle,
  Check,
  Heart,
  Minus,
  Plus,
  Share2,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const { user } = useAuth();
  const { addToCart } = useCartContext();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { currency, convert } = useCurrency();

  const {
    data: product,
    isLoading: loadingProduct,
    isError: productError,
  } = useProductBySlug(slug || '');

  const { data: reviewsData, isLoading: loadingReviews } = useReviewsByProduct(
    product?._id ?? ''
  );

  const createReview = useCreateReview();

  const reviews = reviewsData?.reviews ?? [];

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const userReview =
    user &&
    reviews.find(
      (r) => (typeof r.user === 'string' ? r.user : r.user?._id) === user._id
    );

  const isWishlisted = isInWishlist(product?._id || '');

  useEffect(() => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment || '');
    }
  }, [userReview]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReview.mutateAsync({
        productId: product!._id,
        data: {
          rating,
          comment: comment || undefined,
        },
      });
    } catch {
      // error handled in hook
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id,
        name: product.name,
        price: product.basePrice,
        quantity,
      });
      setQuantity(1);
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      if (isWishlisted) {
        removeFromWishlist(product._id);
      } else {
        addToWishlist({
          id: product._id,
          name: product.name,
          price: product.basePrice,
          rating: Number(avgRating),
        });
      }
    }
  };

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  if (!slug) return <div className='p-8'>Invalid product slug</div>;
  if (loadingProduct) return <div className='p-8'>Loading product…</div>;
  if (productError || !product)
    return <div className='p-8'>Product not found</div>;

  return (
    <main className='min-h-screen bg-background'>
      <Navbar />
      {/* Product Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Gallery */}
          <div className='space-y-4'>
            <div className='bg-muted rounded-xl overflow-hidden flex items-center justify-center h-96 lg:h-[600px]'>
              <Image
                src={product.images?.[selectedImage]?.url || '/placeholder.png'}
                alt={product.name}
                width={600}
                height={600}
                priority
                className='object-contain w-full h-full'
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className='flex gap-3'>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-primary'
                        : 'border-muted hover:border-foreground/30'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      width={80}
                      height={80}
                      className='object-cover w-full h-full'
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className='space-y-8'>
            {/* Header */}
            <div>
              <div className='flex items-start justify-between gap-4 mb-4'>
                <div>
                  <p className='text-sm font-semibold text-primary mb-2'>
                    {product.category?.name}
                  </p>
                  <h1 className='text-4xl lg:text-5xl font-bold text-foreground'>
                    {product.name}
                  </h1>
                </div>
                <button
                  onClick={handleToggleWishlist}
                  className='p-3 rounded-full hover:bg-muted transition-colors'
                >
                  <Heart
                    size={24}
                    className={
                      isWishlisted
                        ? 'fill-primary stroke-primary'
                        : 'stroke-foreground/40 hover:stroke-foreground'
                    }
                  />
                </button>
              </div>

              {/* Rating */}
              <div className='flex items-center gap-3'>
                <div className='flex gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < Math.round(Number(avgRating))
                          ? 'fill-accent stroke-accent'
                          : 'stroke-foreground/20'
                      }
                    />
                  ))}
                </div>
                <p className='text-sm text-foreground/60'>
                  {avgRating} • {reviews.length}{' '}
                  {reviews.length === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>

            {/* Price & Stock */}
            <div className='space-y-3 pb-6 border-b border-border'>
              <div className='flex items-baseline gap-4'>
                <p className='text-4xl font-bold text-foreground'>
                  {formatPrice(convert(product.basePrice), currency)}
                </p>
              </div>

              <div className='flex items-center gap-2'>
                {product.stock > 0 ? (
                  <>
                    <Check size={18} className='text-green-500' />
                    <p className='text-sm text-foreground/70'>
                      {product.stock} in stock
                    </p>
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} className='text-destructive' />
                    <p className='text-sm text-destructive'>Out of stock</p>
                  </>
                )}
              </div>

              <p className='text-sm text-foreground/60 leading-relaxed'>
                {product.description}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <p className='text-sm font-semibold'>Quantity</p>
                <div className='flex items-center border border-border rounded-lg'>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className='p-2 hover:bg-muted transition-colors'
                  >
                    <Minus size={18} />
                  </button>
                  <input
                    type='number'
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className='w-12 text-center border-0 bg-transparent font-semibold'
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className='p-2 hover:bg-muted transition-colors'
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className='bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-semibold'
                >
                  Add to Cart
                </Button>
                <Button
                  variant='outline'
                  className='py-6 text-base font-semibold'
                >
                  <Share2 size={18} />
                  Share
                </Button>
              </div>
            </div>

            {/* Product Meta */}
            <div className='grid grid-cols-2 gap-4 pt-6 border-t border-border'>
              <div>
                <p className='text-xs font-semibold text-foreground/50 mb-1'>
                  SKU
                </p>
                <p className='text-sm font-medium'>{product.sku}</p>
              </div>
              <div>
                <p className='text-xs font-semibold text-foreground/50 mb-1'>
                  Brand
                </p>
                <p className='text-sm font-medium'>{product.brand || 'N/A'}</p>
              </div>
              <div>
                <p className='text-xs font-semibold text-foreground/50 mb-1'>
                  Category
                </p>
                <p className='text-sm font-medium'>{product.category?.name}</p>
              </div>
              <div>
                <p className='text-xs font-semibold text-foreground/50 mb-1'>
                  Subcategory
                </p>
                <p className='text-sm font-medium'>
                  {product.subcategory?.name || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
          {/* Review Stats */}
          <div className='space-y-6'>
            <div>
              <h2 className='text-3xl font-bold text-foreground mb-2'>
                {avgRating}
              </h2>
              <div className='flex gap-1 mb-3'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.round(Number(avgRating))
                        ? 'fill-accent stroke-accent'
                        : 'stroke-foreground/20'
                    }
                  />
                ))}
              </div>
              <p className='text-sm text-foreground/60'>
                Based on {reviews.length}{' '}
                {reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            {/* Rating Breakdown */}
            <div className='space-y-2'>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter((r) => r.rating === stars).length;
                const percent =
                  reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className='flex items-center gap-3'>
                    <p className='text-xs text-foreground/60 w-6'>{stars}★</p>
                    <div className='flex-1 h-2 bg-muted rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-accent transition-all'
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className='text-xs text-foreground/60 w-8 text-right'>
                      {count}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews List & Form */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Existing Reviews */}
            {loadingReviews ? (
              <div className='text-center py-8'>Loading reviews…</div>
            ) : reviews.length > 0 ? (
              <div className='space-y-6'>
                {reviews.map((r) => (
                  <div
                    key={r._id}
                    className='p-6 border border-border rounded-lg space-y-3'
                  >
                    <div className='flex items-start justify-between'>
                      <div>
                        <p className='font-semibold text-foreground'>
                          {(r as any).user?.name || 'User'}
                        </p>
                        <div className='flex gap-1 mt-1'>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < r.rating
                                  ? 'fill-accent stroke-accent'
                                  : 'stroke-foreground/20'
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className='text-xs text-foreground/50'>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {r.comment && (
                      <p className='text-sm text-foreground/70'>{r.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-foreground/60 py-8'>No reviews yet.</p>
            )}

            {/* Review Form */}
            {user ? (
              <form
                onSubmit={handleSubmitReview}
                className='border-t border-border pt-8 space-y-4'
              >
                <h3 className='font-semibold text-lg'>
                  {userReview ? 'Update your review' : 'Leave a review'}
                </h3>

                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Rating</label>
                  <div className='flex gap-2'>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <button
                        key={n}
                        type='button'
                        onClick={() => setRating(n)}
                        className='p-2 rounded-lg hover:bg-muted transition-colors'
                      >
                        <Star
                          size={24}
                          className={
                            rating >= n
                              ? 'fill-accent stroke-accent'
                              : 'stroke-foreground/30'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium'>
                    Comment (optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder='Share your thoughts about this product...'
                    className='w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary'
                    rows={4}
                  />
                </div>

                <Button
                  type='submit'
                  disabled={createReview.isPending}
                  className='bg-primary hover:bg-primary/90 text-primary-foreground'
                >
                  {userReview ? 'Update Review' : 'Submit Review'}
                </Button>
              </form>
            ) : (
              <div className='border-t border-border pt-8 text-center py-8'>
                <p className='text-foreground/60 mb-4'>
                  Sign in to leave a review
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
