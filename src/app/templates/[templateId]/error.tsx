'use client'; 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <AlertTriangle className="w-16 h-16 text-destructive mb-6" />
      <h2 className="text-3xl font-headline font-semibold mb-4">Oops! Something went wrong.</h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        We encountered an error while trying to load the template. Please try again or select a different template.
      </p>
      <p className="text-sm text-muted-foreground mb-2">Error: {error.message}</p>
      <div className="space-x-4">
        <Button onClick={() => reset()} variant="default" size="lg">
          Try Again
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/templates">Back to Templates</Link>
        </Button>
      </div>
    </div>
  );
}
