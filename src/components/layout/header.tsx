
'use client'; // Add this line to make the component a client component
import Link from 'next/link';
import { AudioLines, Menu, X } from 'lucide-react'; // Import Menu and X icons
import { Button } from '@/components/ui/button';
import React from 'react'; // Import React for React.Fragment
import { useState } from 'react'; // Import useState hook
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile hook

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Our Process' },
  { href: '#hybrid-approach', label: 'Hybrid Approach' },
];

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu visibility
  const isMobile = useIsMobile(); // Hook to detect mobile screen size

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
        <div className="flex items-center space-x-6">
          {/* Hamburger Menu Button for Mobile */}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center">
            {/* Removed space-x-4, spacing handled by separator margins */}
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
          )}

          <Button 
            asChild 
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transform transition-transform hover:scale-105 font-bold"
          >
            <Link href="#cost-estimation-tool">Audiobook Estimator</Link>
          </Button>
          {/* Placeholder for mobile menu toggle if needed in the future */}

        </div>
      </div>
      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

