
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
          src="https://picsum.photos/1600/900?grayscale&blur=2" // Placeholder image
          alt="Abstract background representing audio waves or studio"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
          priority
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl">
            Craft Your Audiobook, <span className="text-accent">Your Way</span>
          </h1>
          <p className="mt-6 text-lg text-foreground/90 sm:text-xl">
            Narration.Design offers bespoke audiobook production services, blending the artistry of human narration with the efficiency of AI.
          </p>
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
