'use client';

import { Button } from '@/components/ui/button';
import { Bell, Settings } from 'lucide-react';

export function DashboardHeader() {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12'>
      <div>
        <h1 className='text-4xl font-bold text-foreground'>My Dashboard</h1>
        <p className='text-foreground/60 mt-2'>
          Welcome back! Here's your account overview
        </p>
      </div>
      <div className='flex items-center gap-3'>
        <Button variant='outline' size='icon' className='rounded-full'>
          <Bell size={20} />
        </Button>
        <Button variant='outline' size='icon' className='rounded-full'>
          <Settings size={20} />
        </Button>
      </div>
    </div>
  );
}
