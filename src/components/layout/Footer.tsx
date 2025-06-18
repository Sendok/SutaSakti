export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-card border-t border-border py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} FormFlow AI. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Crafted with care to simplify your document needs.
        </p>
      </div>
    </footer>
  );
}
