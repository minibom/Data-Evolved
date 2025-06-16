"use client";

import React, { useEffect, useRef } from 'react';
import GameLoader from '@/components/GameLoader'; // Assuming GameLoader is for loading assets / initial setup

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    // Placeholder for game engine initialization (e.g., PixiJS, Three.js)
    // For now, just simulate loading
    const gameInitialization = async () => {
      console.log("Initializing game engine...");
      // Example: const game = new GameEngine(canvasRef.current);
      // await game.loadAssets();
      // game.start();
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate asset loading
      setIsLoading(false);
      console.log("Game engine initialized and canvas is ready.");
      if (canvasRef.current) {
        // Example: draw something simple
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'hsl(var(--primary))';
          ctx.fillRect(10, 10, 150, 100);
          ctx.fillStyle = 'hsl(var(--primary-foreground))';
          ctx.font = '16px Space Grotesk';
          ctx.fillText('Game Canvas Ready!', 20, 50);
        }
      }
    };

    if (canvasRef.current) {
      gameInitialization();
    }

    return () => {
      // Placeholder for game engine cleanup
      console.log("Cleaning up game engine...");
    };
  }, []);

  if (isLoading) {
    return <GameLoader />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-background text-foreground p-4">
      <h1 className="text-3xl font-bold font-headline mb-4 text-primary">Data Evolved - Game Client</h1>
      <p className="text-muted-foreground mb-6">The Quantum Nexus awaits...</p>
      <div className="w-full max-w-4xl aspect-video bg-card border border-border shadow-lg rounded-lg overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full" width="1280" height="720"></canvas>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Game UI and elements will be rendered here via the game engine.</p>
    </div>
  );
}
