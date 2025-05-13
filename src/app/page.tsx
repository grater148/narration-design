
import { AppHeader } from '@/components/layout/header';
import { AppFooter } from '@/components/layout/footer';
import { HeroSection } from '@/components/sections/hero-section';
import { ServicesSection } from '@/components/sections/services-section';
import { ProcessSection } from '@/components/sections/process-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-grow">
        <HeroSection />
        <ServicesSection />
        <ProcessSection />
        {/* Placeholder for additional sections */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              More Coming Soon
            </h2>
            <p className="mt-4 text-lg text-foreground/80">
              We are working on adding more exciting features and content.
            </p>
          </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
