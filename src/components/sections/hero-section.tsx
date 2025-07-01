
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative bg-secondary/30 py-20 md:py-32">
      <div 
        className="absolute inset-0"
        data-ai-hint="audio studio"
      >
        <Image
          src="/images/hero-image.png" // Changed to new hero image
          alt="Hero background image" // Updated alt text
          layout="fill"
          objectFit="cover"
          className="opacity-20"
          priority
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl">
            Your Audiobook, <span className="text-accent">Your Way</span>
          </h1>
          <p className="mt-6 text-lg text-foreground sm:text-xl">
            Bespoke audiobook narration for self-published authors.
          </p>
          <div className="mt-10 aspect-w-16 aspect-h-9 bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">YouTube video coming soon!</p>
          </div>
          <div className="mt-10">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform transition-transform hover:scale-105">
              <Link href="#services">
                Explore Our Services
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
