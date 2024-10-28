'use client';

import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Stats from '@/components/Stats';
import Impact from '@/components/Impact';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import SectionDivider from '@/components/SectionDivider';

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-gradient-to-br from-primary-cream via-primary-mint/20 to-primary-teal/10">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-mint/40 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 right-20 w-96 h-96 bg-primary-teal/30 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-primary-gold/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <Navbar />
      <Hero />
      
      <SectionDivider />
      <Stats />
      
      <SectionDivider />
      <Impact />
      
      <SectionDivider />
      <HowItWorks />
      
      <SectionDivider />
      <Pricing />
      
      <SectionDivider />
      <Testimonials />
      
      <Footer />
    </main>
  );
}
