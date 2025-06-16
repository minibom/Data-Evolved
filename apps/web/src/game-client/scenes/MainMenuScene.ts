// src/game-client/scenes/MainMenuScene.ts
import { BaseScene } from './BaseScene';
import type { GameClient } from '../core/GameClient'; // Adjusted path
import { GamePlayScene } from './GamePlayScene';

export class MainMenuScene extends BaseScene {
  private startButtonRect = { x: 0, y: 0, width: 0, height: 0 };

  constructor(game: GameClient) {
    super(game);
    console.log("MainMenuScene constructed.");
  }

  protected async preload(): Promise<void> {
    await super.preload();
    console.log("MainMenuScene preloading assets...");
    // No assets needed for this basic menu for now
    this.create(); // Call create after assets are (not) loaded
  }
  
  protected create(): void {
    super.create();
    console.log("MainMenuScene creating objects...");
    
    const canvas = this.game.getCanvas();
    if (canvas) {
      this.startButtonRect = {
        x: canvas.width / 2 - 100,
        y: canvas.height / 2,
        width: 200,
        height: 50,
      };
      
      // Add click listener specifically for this scene
      canvas.addEventListener('click', this.handleMouseClick);
      this.game.getInputManager().attachToCanvas(canvas); // Ensure input manager is focused
    }
  }

  private handleMouseClick = (event: MouseEvent) => {
    if (!this.isActive) return;
    const canvas = this.game.getCanvas();
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (
      mouseX >= this.startButtonRect.x &&
      mouseX <= this.startButtonRect.x + this.startButtonRect.width &&
      mouseY >= this.startButtonRect.y &&
      mouseY <= this.startButtonRect.y + this.startButtonRect.height
    ) {
      console.log("Start Game button clicked - transitioning to GamePlayScene.");
      this.game.loadScene(new GamePlayScene(this.game));
      // No need to call startGameLoop here, as GamePage should have already started it
    }
  };

  public update(delta: number): void {
    if (!this.isActive) return;
    // No complex update logic for this simple menu
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (!this.isActive) return;
    const canvas = this.game.getCanvas();

    // Background
    renderer.fillStyle = 'hsl(var(--background))'; // Dark blueish background
    renderer.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    renderer.font = "bold 48px 'Space Grotesk', sans-serif";
    renderer.fillStyle = 'hsl(var(--primary))';
    renderer.textAlign = 'center';
    renderer.fillText('Data Equilibrium', canvas.width / 2, canvas.height / 2 - 100);
    
    // Start Button
    renderer.fillStyle = 'hsl(var(--primary-foreground))'; // Button text color (assuming it's on primary bg)
    renderer.fillStyle = 'hsl(var(--primary))'; // Button background
    renderer.fillRect(this.startButtonRect.x, this.startButtonRect.y, this.startButtonRect.width, this.startButtonRect.height);
    
    renderer.font = "24px 'Space Grotesk', sans-serif";
    renderer.fillStyle = 'hsl(var(--primary-foreground))'; // Text on button
    renderer.fillText('Start Game', canvas.width / 2, this.startButtonRect.y + this.startButtonRect.height / 2 + 8); // Adjust for text alignment
    
    renderer.textAlign = 'left'; // Reset alignment
  }

  public destroy(): void {
    const canvas = this.game.getCanvas();
    if (canvas) {
      canvas.removeEventListener('click', this.handleMouseClick);
    }
    super.destroy();
    console.log("MainMenuScene specific resources cleaned up.");
  }
}
