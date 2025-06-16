// src/app/game/page.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import GameLoader from '@/components/GameLoader';
import { initializeGame, type GameClient } from '@/game-client'; // Ensure GameClient type is exported if needed

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameClientRef = useRef<GameClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      console.error("Canvas element not found.");
      setError("Canvas element not available for game initialization.");
      setIsLoading(false);
      return;
    }

    let gameInstance: GameClient | null = null;

    const initGame = async () => {
      console.log("GamePage: Attempting to initialize game engine...");
      try {
        // Ensure canvas has dimensions before passing to game client
        // This is important for rendering engines that rely on initial canvas size
        if(canvasRef.current) {
            canvasRef.current.width = 1280; // Or from a config
            canvasRef.current.height = 720; // Or from a config
        }

        gameInstance = initializeGame(canvasRef.current!); // initializeGame should return GameClient instance
        gameClientRef.current = gameInstance;

        // Simulate asset loading or initial setup if needed
        // await gameInstance.assetManager.loadAssets({ /* initial manifest */ });
        // For now, just a small delay to show loader
        await new Promise(resolve => setTimeout(resolve, 500));

        if (gameInstance) {
          gameInstance.startGameLoop(); // Start the game loop
          console.log("GamePage: Game engine initialized and loop started.");
        } else {
          throw new Error("GameClient initialization returned null.");
        }
        setIsLoading(false);
      } catch (e: any) {
        console.error("GamePage: Error initializing game:", e);
        setError(`Failed to initialize game: ${e.message}`);
        setIsLoading(false);
      }
    };

    initGame();

    return () => {
      console.log("GamePage: Cleaning up game engine...");
      gameInstance?.stopGameLoop();
      // Add any other cleanup logic for gameInstance here, e.g., gameInstance.destroy();
      gameClientRef.current = null;
    };
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-background text-destructive p-4">
        <h1 className="text-2xl font-bold mb-4">Error Initializing Game</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return <GameLoader />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-black text-foreground focus:outline-none" tabIndex={0}>
      {/* The canvas will be focused for input by InputManager */}
      <canvas
        ref={canvasRef}
        className="outline-none focus:outline-none"
        // Width and height are set in useEffect to ensure canvasRef.current exists
      />
      {/* Other UI overlays can be added here */}
    </div>
  );
}
