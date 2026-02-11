'use client';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { ArrowLeft, Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState<number[]>([]);

  const handleAddToCart = (item: (typeof wishlistItems)[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
    });
    setAddedItems([...addedItems, item.id]);
    setTimeout(() => {
      setAddedItems(addedItems.filter((id) => id !== item.id));
    }, 2000);
  };

  if (wishlistItems.length === 0) {
    return (
      <main>
        <Navbar />
        <section className='pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background min-h-screen'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center space-y-8'>
              <div className='flex justify-center'>
                <div className='bg-secondary/50 rounded-full p-8'>
                  <Heart size={64} className='text-muted-foreground' />
                </div>
              </div>
              <div className='space-y-2'>
                <h1 className='text-5xl font-bold text-foreground'>
                  Your wishlist is empty
                </h1>
                <p className='text-lg text-foreground/60'>
                  Add items you love and save them for later
                </p>
              </div>
              <Link href='/shop'>
                <Button className='bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-lg'>
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <section className='pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background min-h-screen'>
        <div className='max-w-6xl mx-auto'>
          <div className='space-y-8'>
            <div className='flex items-center gap-4'>
              <Link href='/shop'>
                <Button
                  variant='outline'
                  size='icon'
                  className='border-primary text-primary hover:bg-primary/5 bg-transparent'
                >
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <h1 className='text-5xl font-bold text-foreground'>
                My Wishlist
              </h1>
              <span className='ml-auto bg-secondary/50 rounded-full px-4 py-2 font-bold text-foreground'>
                {wishlistItems.length} item
                {wishlistItems.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className='bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group'
                >
                  <div className='w-full h-48 bg-secondary/30 flex items-center justify-center relative overflow-hidden'>
                    <Heart className='text-red-500 fill-red-500' size={64} />
                  </div>
                  <div className='p-6 space-y-4'>
                    <div>
                      <h3 className='font-bold text-foreground text-lg'>
                        {item.name}
                      </h3>
                      <p className='text-accent font-bold text-lg mt-2'>
                        {item.price}
                      </p>
                    </div>
                    <div className='flex items-center gap-1'>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className='text-accent'>
                          ★
                        </span>
                      ))}
                      <span className='text-sm text-foreground/60 ml-2'>
                        {item.rating}
                      </span>
                    </div>
                    <div className='flex gap-2 pt-4'>
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className={`flex-1 transition-all ${
                          addedItems.includes(item.id)
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-primary hover:bg-primary/90'
                        } text-primary-foreground font-medium`}
                      >
                        <ShoppingCart size={18} className='mr-2' />
                        {addedItems.includes(item.id)
                          ? 'Added!'
                          : 'Add to Cart'}
                      </Button>
                      <Button
                        onClick={() => removeFromWishlist(item.id)}
                        variant='outline'
                        size='icon'
                        className='border-red-300 text-red-500 hover:bg-red-50 bg-red-50'
                      >
                        <Heart size={18} fill='currentColor' />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
