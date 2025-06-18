import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, FileText } from 'lucide-react';

export default function Header() {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/templates', label: 'Templates' },
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-headline font-bold text-primary">
          <FileText className="h-7 w-7" />
          FormFlow AI
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild>
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
          <Button asChild>
            <Link href="/login">Login / Sign Up</Link>
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <div className="flex flex-col space-y-4 p-6">
                <Link href="/" className="flex items-center gap-2 text-xl font-headline font-bold text-primary mb-4">
                   <FileText className="h-6 w-6" />
                   FormFlow AI
                </Link>
                {navItems.map((item) => (
                  <Button key={item.label} variant="ghost" className="justify-start text-lg" asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
                <Button asChild className="w-full mt-4 text-lg">
                  <Link href="/login">Login / Sign Up</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
