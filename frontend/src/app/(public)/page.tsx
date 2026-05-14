import { AnimatedShowcase } from '@/components/animated-showcase';
import { DifferenceSection } from '@/components/difference-section';
import { FaqSection } from '@/components/faq-section';
import { Hero, type CarouselSlide } from '@/components/hero';
import { NotifySection } from '@/components/notify-section';
import { ParallaxGallery } from '@/components/parallax-gallery';
import { WhySection } from '@/components/why-section';

const heroSlides: CarouselSlide[] = [
  {
    id: '1',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=600&fit=crop',
    alt: 'Featured Collection 1',
    title: 'Summer Collection',
    subtitle: 'Discover the Latest Trends',
    buttonText: 'Shop Now',
    buttonHref: '/products',
    position: 'center-left',
  },
  {
    id: '2',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=600&fit=crop',
    alt: 'Featured Collection 2',
    title: 'Exclusive Deals',
    subtitle: 'Limited Time Offers',
    buttonText: 'Explore',
    buttonHref: '/products?filter=sale',
  },
  {
    id: '3',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=600&fit=crop',
    alt: 'Featured Collection 3',
    title: 'New Arrivals',
    subtitle: 'Fresh Stock Just Added',
    buttonText: 'View All',
    buttonHref: '/products?sort=newest',
  },
];

export default function Page() {
  return (
    <main className='min-h-screen'>
      <Hero slides={heroSlides} />
      <WhySection />
      <DifferenceSection />
      <ParallaxGallery />
      <AnimatedShowcase />
      <NotifySection />
      <FaqSection />
    </main>
  );
}
