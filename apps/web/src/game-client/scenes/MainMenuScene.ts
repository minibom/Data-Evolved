// src/game-client/scenes/MainMenuScene.ts
import { BaseScene } from './BaseScene';
import type { GameClient } from '../index';
import { GamePlayScene } from './GamePlayScene';

export class MainMenuScene extends BaseScene {
  constructor(game: GameClient) {
    super(game);
    console.log("MainMenuScene constructed.");
  }

  protected async preload(): Promise<void> {
    await super.preload(); // Call base class preload
    console.log("MainMenuScene preloading assets...");
    // Example: await this.game.getAssetManager().loadAssets({ images: [{ name: 'menu_bg', url: '/assets/menu_bg.png' }] });
  }
  
  protected create(): void {
    super.create(); // Call base class create
    console.log("MainMenuScene creating objects...");
    // Example: Play menu music
    // this.game.getAssetManager()?.getAudio('menu_music')?.play();

    const canvas = this.game.canvas;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(30, 30, 70, 0.9)'; // Dark blueish background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.font = "bold 48px 'Space Grotesk', sans-serif";
        ctx.fillStyle = 'hsl(var(--primary))';
        ctx.textAlign = 'center';
        ctx.fillText('Data Evolved', canvas.width / 2, canvas.height / 2 - 100);
        
        ctx.font = "24px 'Space Grotesk', sans-serif";
        ctx.fillStyle = 'hsl(var(--primary-foreground))';
        // Placeholder for "Start Game" button
        const startButton = { x: canvas.width / 2 - 100, y: canvas.height / 2, width: 200, height: 50 };
        ctx.fillRect(startButton.x, startButton.y, startButton.width, startButton.height);
        ctx.fillStyle = 'hsl(var(--primary))';
        ctx.fillText('Start Game', canvas.width / 2, startButton.y + 35);
        
        // Simple click listener to transition
        const startGameHandler = (event: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            if (mouseX >= startButton.x && mouseX <= startButton.x + startButton.width &&
                mouseY >= startButton.y && mouseY <= startButton.y + startButton.height) {
                console.log("Start Game button clicked - transitioning to GamePlayScene.");
                this.game.loadScene(new GamePlayScene(this.game));
                canvas.removeEventListener('click', startGameHandler);
            }
        };
        canvas.addEventListener('click', startGameHandler);
        this.game.inputManager.attachToCanvas(canvas); // Ensure input manager is using this canvas for mouse coords
      }
    }
  }

  public update(delta: number): void { // delta is deltaTime
    if (!this.isActive) return;
    // Handle menu interactions if any (e.g., button highlights on hover)
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (!this.isActive) return;
    // Menu is re-drawn in create() for this simple version.
    // For dynamic menus, rendering logic would go here.
  }

  public destroy(): void {
    super.destroy();
    // Stop menu music, remove event listeners specific to this scene
    const canvas = this.game.canvas;
    // TODO: Need a way to remove the specific 'startGameHandler' if scene is destroyed before click
    console.log("MainMenuScene specific resources cleaned up.");
  }
}

console.log("MainMenuScene class (src/game-client/scenes/MainMenuScene.ts) updated.");
