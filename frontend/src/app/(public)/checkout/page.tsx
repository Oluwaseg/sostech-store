'use client';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useCheckout } from '@/hooks/use-checkout';
import { CheckoutRequest } from '@/types/checkout';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Tag,
  Truck,
} from 'lucide-react';
import { useState } from 'react';

import { useCartContext } from '@/contexts/cart-context';
import { useCurrency } from '@/contexts/currency-context';
import { formatPrice } from '@/lib/format-price';

export default function CheckoutPage() {
  const { mutate: checkout, isPending } = useCheckout();
  const [form, setForm] = useState<CheckoutRequest>({
    shipping: {
      addressLine: '',
      city: '',
      country: '',
      method: 'standard',
      state: '',
      postalCode: '',
    },
    couponCode: '',
  });

  const [couponApplied, setCouponApplied] = useState(false);

  // Cart and currency context
  const { cartItems } = useCartContext();
  const { currency, convert } = useCurrency();

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    const price =
      typeof item.price === 'number'
        ? item.price
        : parseFloat(String(item.price));
    return total + price * item.quantity;
  }, 0);

  // Shipping cost
  const shippingCost =
    form.shipping.method === 'pickup'
      ? 0
      : form.shipping.method === 'express'
        ? 24.99
        : 9.99;

  // Discount (10% for demo if coupon applied)
  const discount = couponApplied ? subtotal * 0.1 : 0;

  // Total
  const total = subtotal + shippingCost - discount;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name in form.shipping) {
      setForm((prev) => ({
        ...prev,
        shipping: { ...prev.shipping, [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleApplyCoupon = () => {
    if (form.couponCode && form.couponCode.trim()) {
      setCouponApplied(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkout(form);
  };

  const shippingMethods = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Delivery in 5-7 business days',
      price: 9.99,
      icon: Truck,
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Delivery in 2-3 business days',
      price: 24.99,
      icon: Clock,
    },
    {
      id: 'pickup',
      name: 'Store Pickup',
      description: 'Ready in 24 hours',
      price: 0,
      icon: Package,
    },
  ];

  return (
    <main>
      <Navbar />
      <section className='pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-background min-h-screen'>
        <div className='max-w-7xl mx-auto'>
          {/* Header */}
          <div className='mb-12 space-y-3'>
            <h1 className='text-4xl lg:text-5xl font-bold text-foreground'>
              Complete Your Purchase
            </h1>
            <p className='text-lg text-foreground/60 max-w-2xl'>
              Secure checkout • Free returns • Money-back guarantee
            </p>
          </div>

          <div className='grid lg:grid-cols-3 gap-8'>
            {/* Main Checkout Form */}
            <div className='lg:col-span-2 space-y-8'>
              <form onSubmit={handleSubmit} className='space-y-8'>
                {/* Shipping Address Section */}
                <div className='bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='p-2.5 rounded-lg bg-primary/20'>
                      <MapPin size={24} className='text-primary' />
                    </div>
                    <div>
                      <h2 className='text-2xl font-bold text-foreground'>
                        Shipping Address
                      </h2>
                      <p className='text-sm text-foreground/60'>
                        Where should we send your order?
                      </p>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-semibold text-foreground mb-2'>
                        Street Address
                      </label>
                      <input
                        className='w-full px-4 py-3 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200'
                        name='addressLine'
                        placeholder='123 Main Street'
                        value={form.shipping.addressLine}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className='grid sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-semibold text-foreground mb-2'>
                          City
                        </label>
                        <input
                          className='w-full px-4 py-3 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200'
                          name='city'
                          placeholder='New York'
                          value={form.shipping.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-semibold text-foreground mb-2'>
                          State/Province
                        </label>
                        <input
                          className='w-full px-4 py-3 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200'
                          name='state'
                          placeholder='NY'
                          value={form.shipping.state}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className='grid sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-semibold text-foreground mb-2'>
                          Postal Code
                        </label>
                        <input
                          className='w-full px-4 py-3 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200'
                          name='postalCode'
                          placeholder='10001'
                          value={form.shipping.postalCode}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-semibold text-foreground mb-2'>
                          Country
                        </label>
                        <input
                          className='w-full px-4 py-3 border-2 border-border rounded-xl bg-background text-foreground placeholder:text-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200'
                          name='country'
                          placeholder='United States'
                          value={form.shipping.country}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Method Section */}
                <div className='space-y-4'>
                  <div className='flex items-center gap-3 mb-6'>
                    <div className='p-2.5 rounded-lg bg-accent/20'>
                      <Truck size={24} className='text-accent' />
                    </div>
                    <h2 className='text-2xl font-bold text-foreground'>
                      Shipping Method
                    </h2>
                  </div>

                  <div className='grid gap-4'>
                    {shippingMethods.map((method) => {
                      const Icon = method.icon;
                      const isSelected = form.shipping.method === method.id;
                      return (
                        <label
                          key={method.id}
                          className={`p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4 ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50 bg-card/30 hover:bg-card/60'
                          }`}
                        >
                          <input
                            type='radio'
                            name='method'
                            value={method.id}
                            checked={isSelected}
                            onChange={handleChange}
                            className='w-5 h-5 cursor-pointer accent-primary'
                            required
                          />
                          <div className='flex-1'>
                            <div className='font-bold text-foreground flex items-center gap-2'>
                              <Icon size={20} className='text-primary' />
                              {method.name}
                            </div>
                            <p className='text-sm text-foreground/60'>
                              {method.description}
                            </p>
                          </div>
                          <div className='text-right'>
                            <p className='font-bold text-foreground'>
                              {method.price === 0 ? 'FREE' : `$${method.price}`}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Promo Code Section */}
                <div className='bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl p-8 border border-accent/10'>
                  <div className='flex items-center gap-3 mb-4'>
                    <Tag size={24} className='text-accent' />
                    <h2 className='text-xl font-bold text-foreground'>
                      Have a Promo Code?
                    </h2>
                  </div>

                  <div className='flex gap-3'>
                    <input
                      className={`flex-1 px-4 py-3 border-2 rounded-xl bg-background text-foreground placeholder:text-foreground/40 focus:ring-2 focus:ring-accent/20 transition-all duration-200 ${
                        couponApplied
                          ? 'border-green-500/50 focus:border-green-500'
                          : 'border-border focus:border-accent'
                      }`}
                      name='couponCode'
                      placeholder='Enter coupon code'
                      value={form.couponCode}
                      onChange={handleChange}
                      disabled={couponApplied}
                    />
                    <Button
                      type='button'
                      onClick={handleApplyCoupon}
                      disabled={
                        couponApplied || !(form.couponCode ?? '').trim()
                      }
                      className='bg-accent hover:bg-accent/90 text-accent-foreground font-bold px-6 rounded-xl'
                    >
                      {couponApplied ? (
                        <>
                          <CheckCircle2 size={18} />
                          Applied
                        </>
                      ) : (
                        'Apply'
                      )}
                    </Button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type='submit'
                  disabled={isPending}
                  className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2'
                >
                  {isPending ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      Processing Your Order...
                    </>
                  ) : (
                    <>
                      Complete Purchase
                      <ArrowRight size={20} />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className='lg:col-span-1'>
              <div className='sticky top-24 space-y-6'>
                <div className='bg-gradient-to-br from-card to-card/50 rounded-2xl p-8 border border-border/50 shadow-lg'>
                  <h3 className='text-2xl font-bold text-foreground mb-6'>
                    Order Summary
                  </h3>

                  {/* Summary Items */}
                  <div className='space-y-4 pb-6 border-b border-border'>
                    <div className='flex justify-between items-center'>
                      <span className='text-foreground/70'>Subtotal</span>
                      <span className='font-semibold text-foreground'>
                        {formatPrice(convert(subtotal), currency)}
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-foreground/70'>Shipping</span>
                      <span className='font-semibold text-foreground'>
                        {shippingCost === 0
                          ? 'FREE'
                          : formatPrice(convert(shippingCost), currency)}
                      </span>
                    </div>
                    {couponApplied && (
                      <div className='flex justify-between items-center'>
                        <span className='text-green-600 font-semibold'>
                          Discount (10%)
                        </span>
                        <span className='text-green-600 font-bold'>
                          -{formatPrice(convert(discount), currency)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className='pt-6'>
                    <div className='flex justify-between items-center mb-6'>
                      <span className='text-lg font-bold text-foreground'>
                        Total
                      </span>
                      <span className='text-3xl font-bold text-accent'>
                        {formatPrice(convert(total), currency)}
                      </span>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className='space-y-3 pt-6 border-t border-border'>
                    <div className='flex items-center gap-2 text-sm text-foreground/70'>
                      <CheckCircle2
                        size={18}
                        className='text-green-500 flex-shrink-0'
                      />
                      <span>Secure payment processing</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-foreground/70'>
                      <CheckCircle2
                        size={18}
                        className='text-green-500 flex-shrink-0'
                      />
                      <span>30-day money back guarantee</span>
                    </div>
                    <div className='flex items-center gap-2 text-sm text-foreground/70'>
                      <CheckCircle2
                        size={18}
                        className='text-green-500 flex-shrink-0'
                      />
                      <span>Free returns on all orders</span>
                    </div>
                  </div>
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
