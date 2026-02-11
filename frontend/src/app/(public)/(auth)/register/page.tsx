import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <main>
      <Navbar />
      <section className='min-h-[calc(100vh-64px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background pt-20 pb-20'>
        <Card className='w-full max-w-md border-2 border-border'>
          <div className='p-8 space-y-8'>
            <div className='text-center space-y-2'>
              <h1 className='text-3xl font-bold text-foreground'>
                Create Account
              </h1>
              <p className='text-foreground/60'>
                Join SOS-Store for curated shopping
              </p>
            </div>

            <form className='space-y-6'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-foreground'>
                    First Name
                  </label>
                  <Input
                    type='text'
                    placeholder='John'
                    className='bg-secondary/50 border-border'
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-foreground'>
                    Last Name
                  </label>
                  <Input
                    type='text'
                    placeholder='Doe'
                    className='bg-secondary/50 border-border'
                    required
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-foreground'>
                  Email
                </label>
                <Input
                  type='email'
                  placeholder='you@example.com'
                  className='bg-secondary/50 border-border'
                  required
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-foreground'>
                  Password
                </label>
                <Input
                  type='password'
                  placeholder='••••••••'
                  className='bg-secondary/50 border-border'
                  required
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-foreground'>
                  Confirm Password
                </label>
                <Input
                  type='password'
                  placeholder='••••••••'
                  className='bg-secondary/50 border-border'
                  required
                />
              </div>

              <label className='flex items-start gap-2'>
                <input type='checkbox' className='mt-1' required />
                <span className='text-sm text-foreground/70'>
                  I agree to the{' '}
                  <Link href='#' className='text-accent hover:text-accent/80'>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href='#' className='text-accent hover:text-accent/80'>
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <Button
                type='submit'
                className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12'
              >
                Create Account
              </Button>
            </form>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-border' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-card text-foreground/60'>
                  Or sign up with
                </span>
              </div>
            </div>

            <div className='flex gap-3'>
              <Button
                variant='outline'
                className='flex-1 border-2 border-border bg-transparent'
              >
                Google
              </Button>
              <Button
                variant='outline'
                className='flex-1 border-2 border-border bg-transparent'
              >
                GitHub
              </Button>
            </div>

            <p className='text-center text-sm text-foreground/60'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='text-accent hover:text-accent/80 font-semibold'
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </section>
      <Footer />
    </main>
  );
}
