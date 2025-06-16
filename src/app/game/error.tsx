"use client"; // Error components must be Client Components

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Game Error Boundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
      <h2 className="text-2xl font-bold font-headline mb-2">Oops! Something went wrong in the game.</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        An unexpected error occurred while trying to load or run the game.
        {error.message && <span className="block mt-2 font-mono text-sm bg-muted p-2 rounded">{error.message}</span>}
      </p>
      <Button
        onClick={() => reset()}
        variant="outline"
      >
        Try to Reload Game
      </Button>
    </div>
  );
}
