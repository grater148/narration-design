
import Link from 'next/link';
import { AudioLines } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react'; // Import React for React.Fragment

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Our Process' },
  { href: '#hybrid-approach', label: 'Hybrid Approach' },
];

export function AppHeader() {
  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-40 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2">
          <AudioLines className="h-7 w-7 text-primary" />
          <span className="text-xl font-semibold tracking-tight text-primary">
            Narration.Design
          </span>
        </Link>

        {/* Right Aligned Section: Nav Links + Button */}
        <div className="flex items-center space-x-6"> {/* This groups Nav and Button, and adds space between them */}
          <nav className="hidden md:flex items-center"> {/* Removed space-x-4, spacing handled by separator margins */}
            {navLinks.map((link, index) => (
              <React.Fragment key={link.href}>
                <Link
                  href={link.href}
                  className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
                {index < navLinks.length - 1 && (
                  <span className="mx-3 text-foreground/60" aria-hidden="true">|</span>
                )}
              </React.Fragment>
            ))}
          </nav>
          
          <Button 
            asChild 
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transform transition-transform hover:scale-105 font-bold"
          >
            <Link href="#cost-estimation-tool">Audiobook Estimator</Link>
          </Button>
          {/* Placeholder for mobile menu toggle if needed in the future */}
        </div>
      </div>
    </header>
  );
}

