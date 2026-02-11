import { DifferenceSection } from '@/components/difference-section';
import { FaqSection } from '@/components/faq-section';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/hero';
import { Navbar } from '@/components/navbar';
import { NotifySection } from '@/components/notify-section';
import { WhySection } from '@/components/why-section';

export default function Page() {
  return (
    <main className='min-h-screen'>
      <Navbar />
      <Hero />
      <WhySection />
      <DifferenceSection />
      <NotifySection />
      <FaqSection />
      <Footer />
    </main>
  );
}
