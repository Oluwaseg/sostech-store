'use client';

export function DashboardSkeleton() {
  return (
    <main className='min-h-screen bg-gradient-to-br from-background via-background to-primary/5'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header Skeleton */}
        <div className='mb-12 animate-pulse'>
          <div className='h-10 bg-muted rounded-lg w-64 mb-2'></div>
          <div className='h-5 bg-muted/50 rounded-lg w-96 mt-2'></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className='bg-card border border-border rounded-xl p-6 animate-pulse'
            >
              <div className='h-10 bg-muted rounded-lg w-20 mb-4'></div>
              <div className='h-8 bg-muted rounded-lg w-32 mb-2'></div>
              <div className='h-4 bg-muted/50 rounded-lg w-24'></div>
            </div>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-6'>
            {/* Recent Orders Skeleton */}
            <div className='bg-card border border-border rounded-xl p-6 animate-pulse'>
              <div className='h-6 bg-muted rounded-lg w-40 mb-6'></div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className='mb-4 pb-4 border-b border-border/50'>
                  <div className='h-5 bg-muted rounded-lg w-3/4 mb-2'></div>
                  <div className='h-4 bg-muted/50 rounded-lg w-1/2'></div>
                </div>
              ))}
            </div>

            {/* Recent Reviews Skeleton */}
            <div className='bg-card border border-border rounded-xl p-6 animate-pulse'>
              <div className='h-6 bg-muted rounded-lg w-40 mb-6'></div>
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className='mb-4 pb-4 border-b border-border/50'>
                  <div className='h-5 bg-muted rounded-lg w-3/4 mb-2'></div>
                  <div className='h-4 bg-muted/50 rounded-lg w-full'></div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Overview Skeleton */}
          <div className='space-y-6'>
            <div className='bg-card border border-border rounded-xl p-6 animate-pulse'>
              <div className='h-6 bg-muted rounded-lg w-40 mb-6'></div>
              <div className='h-10 bg-muted rounded-lg w-full mt-8'></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
