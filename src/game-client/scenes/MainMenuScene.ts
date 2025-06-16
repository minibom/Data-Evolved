// src/game-client/scenes/MainMenuScene.ts
import { BaseScene } from './BaseScene';
import type { GameClient } from '../index';
import { GamePlayScene } from './GamePlayScene'; // To switch to gameplay

export class MainMenuScene extends BaseScene {
  // Define UI elements for the main menu (buttons, title, etc.)
  // These might be HTML elements overlaid, or drawn onto the canvas

  constructor(gameClient: GameClient) {
    super(gameClient);
    console.log("MainMenuScene constructed.");
  }

  protected async preload(): Promise<void> {
    await super.preload();
    console.log("MainMenuScene preloading assets...");
    // Example: Load menu background, button sprites, music
    // await this.gameClient.getAssetManager()?.load({
    //   images: [{ name: 'menu_background', url: '/assets/menu_bg.png' }],
    //   audio: [{ name: 'menu_music', url: '/audio/menu_theme.mp3' }]
    // });
    console.log("MainMenuScene assets preloaded.");
    this.create();
  }
  
  protected create(): void {
    super.create();
    console.log("MainMenuScene creating objects...");
    // Example: Play menu music
    // this.gameClient.getAssetManager()?.getAudio('menu_music')?.play();

    // For testing, draw something simple on the canvas
    const canvas = (this.gameClient as any).canvas; // Access canvas from gameClient
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Main Menu - Data Evolved', canvas.width / 2, canvas.height / 2 - 50);
        ctx.font = '20px Arial';
        ctx.fillText('Click to Start Game (Placeholder)', canvas.width / 2, canvas.height / 2 + 20);

        // Simple click listener to transition (very basic)
        const startGame = () => {
            console.log("Start Game clicked - transitioning scene.");
            // (this.gameClient as any).loadScene(new GamePlayScene(this.gameClient)); // Assuming loadScene exists on GameClient
            canvas.removeEventListener('click', startGame);
        };
        canvas.addEventListener('click', startGame);
      }
    }
  }

  public update(deltaTime: number): void {
    if (!this.isActive) return;
    // Handle menu interactions, button highlights, etc.
    // Example: Check if "Start Game" button is clicked
    // const input = this.gameClient.getInputManager();
    // if (input.isMouseButtonPressed(0)) { // Left mouse button
    //   const mousePos = input.getMousePosition();
      // Check if mousePos is over the "Start Game" button area
      // If yes, this.gameClient.loadScene(new GamePlayScene(this.gameClient));
    // }
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (!this.isActive) return;
    // Render menu background, title, buttons
    // The text drawn in create() will persist if not cleared/redrawn.
  }

  public destroy(): void {
    super.destroy();
    // Stop menu music, remove event listeners specific to this scene
    console.log("MainMenuScene specific resources cleaned up.");
  }
}

console.log("MainMenuScene class (src/game-client/scenes/MainMenuScene.ts) loaded.");
