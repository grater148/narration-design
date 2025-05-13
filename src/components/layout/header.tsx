
import Link from 'next/link';
import { AudioLines } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="bg-background/80 backdrop-blur-md sticky top-0 z-40 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <AudioLines className="h-7 w-7 text-primary" />
          <span className="text-xl font-semibold tracking-tight text-primary">
            Narration.Design
          </span>
        </Link>
        <nav className="flex items-center space-x-4">
          {/* Future navigation links can go here */}
          {/* Example: <Link href="/about" className="text-sm font-medium text-foreground/80 hover:text-primary">About</Link> */}
        </nav>
      </div>
    </header>
  );
}
