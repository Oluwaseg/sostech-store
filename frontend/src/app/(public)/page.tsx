import { AnimatedShowcase } from '@/components/animated-showcase';
import { DifferenceSection } from '@/components/difference-section';
import { FaqSection } from '@/components/faq-section';
import { Hero } from '@/components/hero';
import { NotifySection } from '@/components/notify-section';
import { ParallaxGallery } from '@/components/parallax-gallery';
import { WhySection } from '@/components/why-section';

export default function Page() {
  return (
    <main className='min-h-screen'>
      <Hero />
      <WhySection />
      <DifferenceSection />
      <ParallaxGallery />
      <AnimatedShowcase />
      <NotifySection />
      <FaqSection />
    </main>
  );
}
