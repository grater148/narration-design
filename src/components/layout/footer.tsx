
export function AppFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Narration.Design. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
