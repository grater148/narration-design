
'use client'; // Add this line to make the component a client component
import Link from 'next/link';
import { AudioLines, Menu, X } from 'lucide-react'; // Import Menu and X icons
import { Button } from '@/components/ui/button';
import React from 'react'; // Import React for React.Fragment
import { useState, useEffect } from 'react'; // Import useState and useEffect hooks
import { useIsMobile } from '@/hooks/use-mobile'; // Corrected import

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Our Process' },
  { href: '#hybrid-approach', label: 'Hybrid Approach' },
];

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu visibility
  const isMobile = useIsMobile(); // Use the hook

  // This effect will handle showing the mobile menu based on screen size.
  // It sets isMenuOpen to false when transitioning from mobile to desktop view.
  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);


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
        <div className="flex items-center space-x-2 sm:space-x-6">
          {/* Hamburger Menu Button for Mobile/Tablet */}
          {isMobile && ( // Show only if isMobile is true
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 h-16 w-16 lg:hidden" // Custom size for the button, hidden on lg and up
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-14 w-14" /> : <Menu className="h-14 w-14" />}
            </Button>
          )}

          {/* Desktop Navigation */}
          {!isMobile && ( // Show only if not isMobile
            <nav className="flex items-center">
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

          {/* Audiobook Estimator Button - always visible on desktop */}
          {!isMobile && ( // Show only if not isMobile
             <Button
              asChild
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transform transition-transform hover:scale-105 font-bold"
            >
              <Link href="#cost-estimation-tool">Audiobook Estimator</Link>
            </Button>
          )}
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobile && isMenuOpen && ( // Show only if isMobile and isMenuOpen are true
        <div className="lg:hidden bg-background border-b">
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
            <Button
              asChild
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transform transition-transform hover:scale-105 font-bold w-3/4"
              onClick={() => setIsMenuOpen(false)} // Close menu on link click
            >
              <Link href="#cost-estimation-tool">Audiobook Estimator</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
