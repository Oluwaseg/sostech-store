'use client';

import { DashboardNavbar } from '@/components/dashboard-navbar';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/hooks/use-cart';
import { useProducts } from '@/hooks/use-product';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoading: userLoading, isAuthenticated } = useAuth();
  const { data: cartData } = useCart(isAuthenticated);
  const { data: productsData } = useProducts({ limit: 5 });

  const stats = [
    {
      label: 'Total Orders',
      value: '0',
      icon: ShoppingBag,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Cart Items',
      value: cartData?.items?.length?.toString() || '0',
      icon: Package,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Total Spent',
      value: `$${cartData?.total?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Available Products',
      value: productsData?.total?.toString() || '0',
      icon: TrendingUp,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  if (userLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-foreground/60'>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-background'>
      <DashboardNavbar />
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Welcome Section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className='text-foreground/60'>
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className='bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow'
              >
                <div className='flex items-center justify-between mb-4'>
                  <div
                    className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}
                  >
                    <Icon size={24} />
                  </div>
                </div>
                <h3 className='text-2xl font-bold text-foreground mb-1'>
                  {stat.value}
                </h3>
                <p className='text-sm text-foreground/60'>{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          {/* Recent Orders */}
          <div className='bg-card rounded-xl border border-border p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-foreground'>Recent Orders</h2>
              <Link
                href='/dashboard/orders'
                className='text-sm text-primary hover:underline'
              >
                View all
              </Link>
            </div>
            <div className='space-y-4'>
              {cartData?.items && cartData.items.length > 0 ? (
                cartData.items.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-4 bg-secondary/30 rounded-lg'
                  >
                    <div>
                      <p className='font-medium text-foreground'>
                        Product {item.product}
                      </p>
                      <p className='text-sm text-foreground/60'>
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className='font-semibold text-foreground'>
                      ${item.subtotal?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                ))
              ) : (
                <div className='text-center py-8 text-foreground/60'>
                  <ShoppingBag size={48} className='mx-auto mb-4 opacity-50' />
                  <p>No orders yet</p>
                  <Link href='/shop'>
                    <span className='text-primary hover:underline'>
                      Start shopping
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Account Info */}
          <div className='bg-card rounded-xl border border-border p-6'>
            <h2 className='text-xl font-bold text-foreground mb-4'>
              Account Information
            </h2>
            <div className='space-y-4'>
              <div>
                <p className='text-sm text-foreground/60 mb-1'>Name</p>
                <p className='font-medium text-foreground'>
                  {user?.name || 'N/A'}
                </p>
              </div>
              <div>
                <p className='text-sm text-foreground/60 mb-1'>Email</p>
                <p className='font-medium text-foreground'>
                  {user?.email || 'N/A'}
                </p>
              </div>
              <div>
                <p className='text-sm text-foreground/60 mb-1'>Role</p>
                <p className='font-medium text-foreground capitalize'>
                  {user?.role || 'user'}
                </p>
              </div>
              <div className='pt-4'>
                <Link href='/dashboard/profile'>
                  <button className='w-full bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium'>
                    Edit Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className='bg-card rounded-xl border border-border p-6'>
          <h2 className='text-xl font-bold text-foreground mb-4'>Quick Links</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <Link
              href='/shop'
              className='p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors text-center'
            >
              <Package size={24} className='mx-auto mb-2 text-primary' />
              <p className='text-sm font-medium text-foreground'>Shop</p>
            </Link>
            <Link
              href='/dashboard/orders'
              className='p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors text-center'
            >
              <ShoppingBag size={24} className='mx-auto mb-2 text-primary' />
              <p className='text-sm font-medium text-foreground'>Orders</p>
            </Link>
            <Link
              href='/dashboard/profile'
              className='p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors text-center'
            >
              <Users size={24} className='mx-auto mb-2 text-primary' />
              <p className='text-sm font-medium text-foreground'>Profile</p>
            </Link>
            <Link
              href='/dashboard/settings'
              className='p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors text-center'
            >
              <Activity size={24} className='mx-auto mb-2 text-primary' />
              <p className='text-sm font-medium text-foreground'>Settings</p>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
