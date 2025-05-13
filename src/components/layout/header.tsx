
import Link from 'next/link';
import { AudioLines } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
          <nav className="hidden md:flex items-center space-x-4"> {/* space-x-4 between individual nav items */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors" // Increased font size to text-lg
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <Button 
            asChild 
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transform transition-transform hover:scale-105 font-bold" // Added font-bold
          >
            <Link href="#cost-estimation-tool">Audiobook Estimator</Link>
          </Button>
          {/* Placeholder for mobile menu toggle if needed in the future */}
        </div>
      </div>
    </header>
  );
}
