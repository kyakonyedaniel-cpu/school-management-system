import { Navbar } from '@/components/sections/navbar';
import { HeroSection } from '@/components/sections/hero';
import { FeaturesSection } from '@/components/sections/features';
import { AfricanAdvantageSection } from '@/components/sections/african-advantage';
import { TrustSection } from '@/components/sections/trust';
import { TestimonialsCarousel } from '@/components/sections/testimonials';
import { PricingSection } from '@/components/sections/pricing';
import { FinalCTASection } from '@/components/sections/final-cta';
import { Footer } from '@/components/sections/footer';
import { ScrollToTopButton } from '@/components/sections/scroll-to-top';

export const metadata = {
  title: 'SmartSchool Pro - School Management Made Simple',
  description:
    'Digital school management platform for African schools. Manage students, fees, attendance, and more. Built for offline, supports MTN MoMo & Airtel Money.',
  keywords:
    'school management, student management, fee tracking, attendance, African schools, Uganda, Kenya, Tanzania',
  authors: [{ name: 'SmartSchool Pro' }],
  openGraph: {
    title: 'SmartSchool Pro - School Management Made Simple',
    description:
      'Digital school management platform for African schools with offline support and mobile money integration.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SmartSchool Pro',
    description: 'School management made simple for African schools',
  },
};

export default function Home() {
  return (
    <main className="bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <AfricanAdvantageSection />
      <TrustSection />
      <TestimonialsCarousel />
      <PricingSection />
      <FinalCTASection />
      <Footer />
      <ScrollToTopButton />
    </main>
  );
}
