import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/ui/HeroSection';
import FeaturesSection from '@/components/ui/FeaturesSection';
import TestimonialsSection from '@/components/ui/TestimonialsSection';
import CTASection from '@/components/ui/CTASection';
import FAQSection from '@/components/ui/FAQSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}
