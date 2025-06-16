// src/game-client/scenes/BaseScene.ts
import type { GameClient } from '../index'; // Assuming GameClient is the main orchestrator

export abstract class BaseScene {
  protected gameClient: GameClient;
  protected isActive: boolean = false;

  constructor(gameClient: GameClient) {
    this.gameClient = gameClient;
    console.log(`Scene "${this.constructor.name}" created.`);
  }

  // Called when the scene is first loaded or switched to
  public init(): void {
    this.isActive = true;
    console.log(`Scene "${this.constructor.name}" initialized.`);
    this.preload(); // Load assets specific to this scene
  }

  // Optional: Load assets specific to this scene
  protected async preload(): Promise<void> {
    console.log(`Scene "${this.constructor.name}" preloading assets...`);
    // Example: await this.gameClient.getAssetManager().load({ images: [...] });
    this.create(); // Call create after assets are loaded
  }

  // Called after preload, to set up scene objects
  protected create(): void {
    console.log(`Scene "${this.constructor.name}" creating objects...`);
  }

  // Called every frame by the game loop
  public abstract update(deltaTime: number): void;

  // Called every frame by the game loop, after update
  public abstract render(renderer: any): void; // renderer could be CanvasRenderingContext2D, WebGLRenderingContext, or a custom Renderer class

  // Called when the scene is switched away from or destroyed
  public destroy(): void {
    this.isActive = false;
    console.log(`Scene "${this.constructor.name}" destroyed.`);
    // Clean up resources, event listeners, etc.
  }

  public getIsActive(): boolean {
    return this.isActive;
  }
}

console.log("BaseScene class (src/game-client/scenes/BaseScene.ts) loaded.");
