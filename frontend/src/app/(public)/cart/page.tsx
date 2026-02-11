'use client';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(item.price.replace('$', ''));
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (cartItems.length === 0) {
    return (
      <main>
        <Navbar />
        <section className='pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-background min-h-screen'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center space-y-8'>
              <div className='flex justify-center'>
                <div className='bg-secondary/50 rounded-full p-8'>
                  <ShoppingBag size={64} className='text-muted-foreground' />
                </div>
              </div>
              <div className='space-y-2'>
                <h1 className='text-5xl font-bold text-foreground'>
                  Your cart is empty
                </h1>
                <p className='text-lg text-foreground/60'>
                  Add some curated products to get started
                </p>
              </div>
              <Link href='/shop'>
                <Button className='bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-lg'>
                  Continue Shopping
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
        <div className='max-w-4xl mx-auto'>
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
                Shopping Cart
              </h1>
            </div>

            <div className='grid lg:grid-cols-3 gap-8'>
              {/* Cart Items */}
              <div className='lg:col-span-2 space-y-4'>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className='bg-card border border-border rounded-xl p-6 flex items-center justify-between hover:shadow-md transition-shadow'
                  >
                    <div className='flex-1'>
                      <h3 className='font-bold text-lg text-foreground mb-1'>
                        {item.name}
                      </h3>
                      <p className='text-accent font-bold text-lg'>
                        {item.price}
                      </p>
                    </div>

                    <div className='flex items-center gap-4'>
                      <div className='flex items-center border border-border rounded-lg bg-secondary/30 p-2'>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className='w-8 h-8 flex items-center justify-center text-foreground/60 hover:text-foreground font-bold transition-colors'
                        >
                          −
                        </button>
                        <span className='w-12 text-center font-bold text-foreground'>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className='w-8 h-8 flex items-center justify-center text-foreground/60 hover:text-foreground font-bold transition-colors'
                        >
                          +
                        </button>
                      </div>

                      <p className='w-20 text-right font-bold text-foreground'>
                        $
                        {(
                          parseFloat(item.price.replace('$', '')) *
                          item.quantity
                        ).toFixed(2)}
                      </p>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className='p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors'
                        aria-label='Remove from cart'
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className='lg:col-span-1'>
                <div className='bg-card border border-border rounded-xl p-6 sticky top-24 space-y-6'>
                  <h2 className='font-bold text-xl text-foreground'>
                    Order Summary
                  </h2>

                  <div className='space-y-3'>
                    <div className='flex justify-between text-foreground/60'>
                      <span>Subtotal</span>
                      <span>${getTotalPrice()}</span>
                    </div>
                    <div className='flex justify-between text-foreground/60'>
                      <span>Items</span>
                      <span>{getTotalItems()}</span>
                    </div>
                    <div className='flex justify-between text-foreground/60'>
                      <span>Shipping</span>
                      <span>FREE</span>
                    </div>
                  </div>

                  <div className='border-t border-border pt-4'>
                    <div className='flex justify-between items-center mb-6'>
                      <span className='font-bold text-foreground'>Total</span>
                      <span className='font-bold text-2xl text-accent'>
                        ${getTotalPrice()}
                      </span>
                    </div>
                  </div>

                  <Button className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-base'>
                    Proceed to Checkout
                  </Button>

                  <Link href='/shop'>
                    <Button
                      variant='outline'
                      className='w-full border-primary text-primary hover:bg-primary/5 bg-transparent font-bold'
                    >
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
