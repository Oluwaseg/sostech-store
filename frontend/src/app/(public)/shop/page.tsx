'use client';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { useWishlist } from '@/contexts/wishlist-context';
import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

const products = [
  { id: 1, name: 'Premium Wireless Earbuds', price: '$129', rating: 4.8 },
  { id: 2, name: 'Minimalist Desk Lamp', price: '$89', rating: 4.9 },
  { id: 3, name: 'Stainless Steel Water Bottle', price: '$49', rating: 4.7 },
  { id: 4, name: 'Organic Cotton Basics Set', price: '$79', rating: 4.8 },
  { id: 5, name: 'Premium Notebook Collection', price: '$39', rating: 4.6 },
  { id: 6, name: 'Sleek Phone Stand', price: '$34', rating: 4.9 },
];

export default function ShopPage() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [addedItems, setAddedItems] = useState<number[]>([]);

  const handleAddToCart = (product: (typeof products)[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
    setAddedItems([...addedItems, product.id]);
    setTimeout(() => {
      setAddedItems(addedItems.filter((id) => id !== product.id));
    }, 2000);
  };

  const handleWishlist = (product: (typeof products)[0]) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        rating: product.rating,
      });
    }
  };

  return (
    <main>
      <Navbar />
      <section className='pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background'>
        <div className='max-w-7xl mx-auto'>
          <div className='space-y-12'>
            <div className='space-y-4'>
              <h1 className='text-5xl font-bold text-foreground'>
                Curated Products
              </h1>
              <p className='text-lg text-foreground/60'>
                Handpicked items that meet our standards of quality, usefulness,
                and value.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {products.map((product) => (
                <div
                  key={product.id}
                  className='bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group'
                >
                  <div className='w-full h-48 bg-secondary/30 flex items-center justify-center relative overflow-hidden'>
                    <div className='text-6xl text-accent/20 group-hover:scale-110 transition-transform'>
                      ✓
                    </div>
                  </div>
                  <div className='p-6 space-y-4'>
                    <div>
                      <h3 className='font-bold text-foreground text-lg'>
                        {product.name}
                      </h3>
                      <p className='text-accent font-bold text-lg mt-2'>
                        {product.price}
                      </p>
                    </div>
                    <div className='flex items-center gap-1'>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className='text-accent'>
                          ★
                        </span>
                      ))}
                      <span className='text-sm text-foreground/60 ml-2'>
                        {product.rating}
                      </span>
                    </div>
                    <div className='flex gap-2 pt-4'>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className={`flex-1 transition-all ${
                          addedItems.includes(product.id)
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-primary hover:bg-primary/90'
                        } text-primary-foreground font-medium`}
                      >
                        <ShoppingCart size={18} className='mr-2' />
                        {addedItems.includes(product.id)
                          ? 'Added!'
                          : 'Add to Cart'}
                      </Button>
                      <Button
                        onClick={() => handleWishlist(product)}
                        variant='outline'
                        size='icon'
                        className={`transition-all ${
                          isInWishlist(product.id)
                            ? 'bg-red-50 border-red-300 text-red-500 hover:bg-red-100'
                            : 'border-primary text-primary hover:bg-primary/5 bg-transparent'
                        }`}
                      >
                        <Heart
                          size={18}
                          fill={
                            isInWishlist(product.id) ? 'currentColor' : 'none'
                          }
                        />
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
