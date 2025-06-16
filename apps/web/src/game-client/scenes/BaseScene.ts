// src/game-client/scenes/BaseScene.ts
import type { GameClient } from '../index';

export abstract class BaseScene {
  protected game: GameClient; // Changed from #game to protected game
  protected isActive: boolean = false;

  constructor(game: GameClient) { // Renamed parameter to game
    this.game = game;
    console.log(`Scene "${this.constructor.name}" created.`);
  }

  public init(): void {
    this.isActive = true;
    console.log(`Scene "${this.constructor.name}" initializing...`);
    this.preload().then(() => {
        console.log(`Scene "${this.constructor.name}" preloading complete.`);
        this.create();
        console.log(`Scene "${this.constructor.name}" creation complete.`);
    }).catch(error => {
        console.error(`Error during scene ${this.constructor.name} initialization:`, error);
    });
  }

  protected async preload(): Promise<void> {
    console.log(`Scene "${this.constructor.name}" preloading assets (base)...`);
    // Base implementation might be empty, subclasses override
  }

  protected create(): void {
    console.log(`Scene "${this.constructor.name}" creating objects (base)...`);
    // Base implementation might be empty, subclasses override
  }

  public abstract update(delta: number): void; // delta is deltaTime in ms

  public abstract render(renderer: any): void; // renderer could be CanvasRenderingContext2D or custom

  public destroy(): void {
    this.isActive = false;
    console.log(`Scene "${this.constructor.name}" destroyed.`);
  }

  public getIsActive(): boolean {
    return this.isActive;
  }
}

console.log("BaseScene class (src/game-client/scenes/BaseScene.ts) updated.");
