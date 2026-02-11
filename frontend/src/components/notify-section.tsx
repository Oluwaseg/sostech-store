'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell } from 'lucide-react';
import { useState } from 'react';

export function NotifySection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to a backend
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <section id='notify' className='py-20 px-4 sm:px-6 lg:px-8 bg-background'>
      <div className='max-w-3xl mx-auto'>
        <div className='text-center space-y-8'>
          {/* Icon */}
          <div className='flex justify-center'>
            <div className='w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center'>
              <Bell className='text-accent' size={32} />
            </div>
          </div>

          {/* Content */}
          <div className='space-y-4'>
            <h2 className='text-4xl sm:text-5xl font-bold text-foreground text-balance'>
              Get Notified Before Launch
            </h2>
            <p className='text-lg text-foreground/60 max-w-2xl mx-auto text-balance'>
              Good products don't stay available for long. Get early access to
              product drops, restocks, and exclusive launch offers.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4 max-w-md mx-auto'>
            <div className='flex flex-col sm:flex-row gap-3'>
              <Input
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='flex-1 h-12 bg-secondary/50 border-border'
                required
              />
              <Button
                type='submit'
                size='lg'
                className='bg-accent hover:bg-accent/90 text-white font-semibold w-full sm:w-auto'
              >
                {submitted ? 'Confirmed! ✓' : 'Notify Me'}
              </Button>
            </div>
          </form>

          {/* Benefits */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-border'>
            {[
              {
                icon: '📦',
                title: 'New Drops First',
                desc: 'See product releases first',
              },
              {
                icon: '⚡',
                title: 'Restocks',
                desc: 'Get restocks before sold out',
              },
              {
                icon: '🎁',
                title: 'Exclusive Offers',
                desc: 'Early access to special deals',
              },
            ].map((benefit, idx) => (
              <div key={idx} className='space-y-2'>
                <p className='text-3xl'>{benefit.icon}</p>
                <h3 className='font-bold text-foreground'>{benefit.title}</h3>
                <p className='text-sm text-foreground/60'>{benefit.desc}</p>
              </div>
            ))}
          </div>

          {/* Privacy Notice */}
          <div className='bg-secondary/30 rounded-lg p-6 border border-border'>
            <h3 className='font-bold text-foreground mb-3'>
              Your Privacy Matters
            </h3>
            <ul className='space-y-2 text-sm text-foreground/70'>
              <li className='flex items-center gap-2'>
                <div className='w-1.5 h-1.5 bg-accent rounded-full' />
                No spam
              </li>
              <li className='flex items-center gap-2'>
                <div className='w-1.5 h-1.5 bg-accent rounded-full' />
                No unnecessary messages
              </li>
              <li className='flex items-center gap-2'>
                <div className='w-1.5 h-1.5 bg-accent rounded-full' />
                No selling or sharing your data
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
