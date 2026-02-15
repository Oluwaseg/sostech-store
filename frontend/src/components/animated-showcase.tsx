'use client';

import { Button } from '@/components/ui/button';
import { ZoomParallax } from '@/components/zoom-parallax';
import Lenis from '@studio-freight/lenis';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

const showcaseProducts = [
  {
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
    alt: 'Premium Wireless Earbuds',
  },
  {
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
    alt: 'Minimalist Desk Lamp',
  },
  {
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
    alt: 'Stainless Steel Water Bottle',
  },
  {
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
    alt: 'Organic Cotton Basics',
  },
  {
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
    alt: 'Premium Notebooks',
  },
  {
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
    alt: 'Phone Stand',
  },
  {
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80',
    alt: 'Curated Collection',
  },
];

export function AnimatedShowcase() {
  useEffect(() => {
    const lenis = new Lenis();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <section className='relative w-full overflow-hidden bg-background'>
      {/* Header Section */}
      <div className='relative flex min-h-[60vh] items-center justify-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8'>
        {/* Radial spotlight */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute -top-1/2 left-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(55%_0.25_35_/_0.15),transparent_50%)] blur-3xl'
        />

        <div className='relative z-10 max-w-4xl text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-2'
          >
            <Sparkles size={16} className='text-accent' />
            <span className='text-sm font-semibold text-accent'>
              Explore Our Collection
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className='mb-6 text-5xl font-bold text-foreground md:text-6xl'
          >
            Experience Premium Quality
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className='mb-8 text-lg text-foreground/70'
          >
            Scroll down to witness our curated products in an immersive visual
            journey. Every item is handpicked for quality and purpose.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className='inline-block text-sm text-foreground/60'>
              ↓ Scroll to reveal ↓
            </div>
          </motion.div>
        </div>
      </div>

      {/* Parallax Gallery */}
      <div className='relative'>
        <ZoomParallax images={showcaseProducts} height='h-[130vh]' />
      </div>

      {/* Footer Section */}
      <div className='relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8'>
        {/* Radial spotlight */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute -bottom-20 -right-20 h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(ellipse_at_center,oklch(25%_0.04_250_/_0.06),transparent_50%)] blur-3xl'
        />

        <div className='relative z-10 mx-auto max-w-3xl'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='space-y-6 text-center'
          >
            <div>
              <h3 className='mb-3 text-4xl font-bold text-foreground md:text-5xl'>
                Discover Your Next Favorite
              </h3>
              <p className='text-base text-foreground/70 md:text-lg'>
                Our collection represents the intersection of quality,
                functionality, and design. Each product is selected to enhance
                your everyday life.
              </p>
            </div>

            <div className='flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
              <Link href='/shop'>
                <Button className='group flex items-center gap-2 bg-primary px-8 py-2.5 hover:bg-primary/90 text-sm font-medium'>
                  Shop Now
                  <ArrowRight
                    size={16}
                    className='transition-transform group-hover:translate-x-1'
                  />
                </Button>
              </Link>
              <Link href='/#why'>
                <Button
                  variant='outline'
                  className='border-primary/30 px-8 py-2.5 text-primary hover:bg-primary/5 text-sm font-medium'
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className='grid grid-cols-3 gap-3 rounded-xl border border-border bg-card/50 p-5'>
              <div>
                <div className='text-xl font-bold text-accent'>100%</div>
                <p className='text-xs text-foreground/60'>Quality Assured</p>
              </div>
              <div>
                <div className='text-xl font-bold text-accent'>7 Days</div>
                <p className='text-xs text-foreground/60'>Easy Returns</p>
              </div>
              <div>
                <div className='text-xl font-bold text-accent'>Fast</div>
                <p className='text-xs text-foreground/60'>Checkout</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
