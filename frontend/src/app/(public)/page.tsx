import { AnimatedShowcase } from '@/components/animated-showcase';
import { DifferenceSection } from '@/components/difference-section';
import { FaqSection } from '@/components/faq-section';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/hero';
import { Navbar } from '@/components/navbar';
import { NotifySection } from '@/components/notify-section';
import { ParallaxGallery } from '@/components/parallax-gallery';
import { WhySection } from '@/components/why-section';

export default function Page() {
  return (
    <main className='min-h-screen'>
      <Navbar />
      <Hero />
      <WhySection />
      <DifferenceSection />
      <ParallaxGallery />
      <AnimatedShowcase />
      <NotifySection />
      <FaqSection />
      <Footer />
    </main>
  );
}
