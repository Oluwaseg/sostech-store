import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className='bg-foreground text-background py-20 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto space-y-12'>
        {/* Main Content */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-12'>
          {/* Brand */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-accent rounded-lg flex items-center justify-center'>
                <span className='text-foreground font-bold'>S</span>
              </div>
              <span className='font-bold text-lg'>SOS-Store</span>
            </div>
            <p className='text-background/70 text-sm'>
              Curated shopping that respects your time.
            </p>
          </div>

          {/* Shop */}
          <div className='space-y-4'>
            <h3 className='font-bold'>Shop</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/shop'
                  className='text-background/70 hover:text-background transition'
                >
                  Browse Products
                </Link>
              </li>
              <li>
                <Link
                  href='/shop/new'
                  className='text-background/70 hover:text-background transition'
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href='/shop/bestsellers'
                  className='text-background/70 hover:text-background transition'
                >
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link
                  href='/deals'
                  className='text-background/70 hover:text-background transition'
                >
                  Special Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className='space-y-4'>
            <h3 className='font-bold'>Company</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/about'
                  className='text-background/70 hover:text-background transition'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-background/70 hover:text-background transition'
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href='/blog'
                  className='text-background/70 hover:text-background transition'
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href='/careers'
                  className='text-background/70 hover:text-background transition'
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className='space-y-4'>
            <h3 className='font-bold'>Legal</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/privacy'
                  className='text-background/70 hover:text-background transition'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='text-background/70 hover:text-background transition'
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href='/shipping'
                  className='text-background/70 hover:text-background transition'
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href='/returns'
                  className='text-background/70 hover:text-background transition'
                >
                  Returns
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className='bg-background/20' />

        {/* Bottom */}
        <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-sm text-background/60'>
            © 2024 SOS-Store. All rights reserved. Built with integrity.
          </p>
          <div className='flex items-center gap-6'>
            <Link
              href='#'
              className='text-background/60 hover:text-background text-sm transition'
            >
              Twitter
            </Link>
            <Link
              href='#'
              className='text-background/60 hover:text-background text-sm transition'
            >
              Instagram
            </Link>
            <Link
              href='#'
              className='text-background/60 hover:text-background text-sm transition'
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
