
'use client'; // Add this line to make the component a client component
import Link from 'next/link';
import { AudioLines, Menu, X } from 'lucide-react'; // Import Menu and X icons
import { Button } from '@/components/ui/button';
import React from 'react'; // Import React for React.Fragment
import { useState, useEffect } from 'react'; // Import useState and useEffect hooks
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile hook

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Our Process' },
  { href: '#hybrid-approach', label: 'Hybrid Approach' },
];

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu visibility
  // const isMobile = useIsMobile(); // Hook to detect mobile screen size - We'll use a new breakpoint logic

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Show mobile menu for screens smaller than lg (1024px typically)
      if (window.innerWidth < 1024) {
        setShowMobileMenu(true);
      } else {
        setShowMobileMenu(false);
        setIsMenuOpen(false); // Close menu if resizing to desktop
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


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
          {showMobileMenu && (
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          )}

          {/* Desktop Navigation */}
          {!showMobileMenu && (
            <nav className="hidden lg:flex items-center">
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

          {/* Audiobook Estimator Button - always visible on desktop, hidden on mobile unless menu is open */}
          {!showMobileMenu && (
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
      {showMobileMenu && isMenuOpen && (
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

