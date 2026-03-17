'use client';

import { Button } from '@/components/ui/button';
import { RecentReview } from '@/types/user-dashboard';
import { format } from 'date-fns';
import { ArrowRight, MessageSquare, Star } from 'lucide-react';
import Link from 'next/link';

interface RecentReviewsProps {
  reviews: RecentReview[];
}

export function RecentReviews({ reviews }: RecentReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className='bg-card border border-border rounded-xl p-8'>
        <div className='flex items-center gap-4 mb-6'>
          <div className='p-3 rounded-lg bg-amber-500/10'>
            <MessageSquare
              size={24}
              className='text-amber-600 dark:text-amber-400'
            />
          </div>
          <div>
            <h2 className='text-2xl font-bold text-foreground'>Your Reviews</h2>
            <p className='text-sm text-foreground/60'>
              Share your feedback on products
            </p>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <MessageSquare size={48} className='text-foreground/20 mb-4' />
          <p className='text-foreground/60 font-medium'>No reviews yet</p>
          <p className='text-sm text-foreground/40 mt-1'>
            Purchase products and share your thoughts
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow'>
      <div className='flex items-center gap-4 mb-6'>
        <div className='p-3 rounded-lg bg-amber-500/10'>
          <MessageSquare
            size={24}
            className='text-amber-600 dark:text-amber-400'
          />
        </div>
        <div className='flex-1'>
          <h2 className='text-2xl font-bold text-foreground'>Your Reviews</h2>
          <p className='text-sm text-foreground/60'>
            Share your feedback on products
          </p>
        </div>
        <Link href='/reviews'>
          <Button variant='ghost' size='sm' className='gap-2'>
            View All <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      <div className='space-y-3'>
        {reviews.map((review) => (
          <div
            key={review._id}
            className='p-4 bg-muted/50 rounded-lg border border-border/50 hover:border-border hover:bg-muted transition-all group'
          >
            <div className='flex items-start justify-between mb-3'>
              <div>
                <h3 className='font-semibold text-foreground text-sm'>
                  {review.product.name}
                </h3>
                <p className='text-xs text-foreground/50 mt-1'>
                  {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className='flex gap-1'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < review.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-foreground/20'
                    }
                  />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className='text-sm text-foreground/70 italic'>
                "{review.comment}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
