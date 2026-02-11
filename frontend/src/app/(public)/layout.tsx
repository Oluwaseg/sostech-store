import { CartProvider } from '@/contexts/cart-context';
import { WishlistProvider } from '@/contexts/wishlist-context';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'SOS-Store | Curated Shopping Done Right',
  description:
    'An online store that respects your time. Curated products, fast checkout, and a smooth buying experience from start to finish. Get notified for early access.',
  generator: 'v0.app',
  openGraph: {
    title: 'SOS-Store | Curated Shopping Done Right',
    description: "Finally, an online store that doesn't waste your time.",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='font-sans antialiased'>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
