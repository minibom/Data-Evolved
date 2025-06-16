// src/game-client/systems/BaseSystem.ts
import type { GameClient } from '../index';

export abstract class BaseSystem {
  protected game: GameClient; // Changed from #game to protected

  constructor(game: GameClient) {
    this.game = game;
    console.log(`System "${this.constructor.name}" initialized.`);
  }

  public init(): void {
    // Optional: Initialization logic for the system, called once
    console.log(`System "${this.constructor.name}" init() called.`);
  }

  public abstract update(delta: number): void; // delta is deltaTime in ms

  public destroy(): void {
    // Optional: Cleanup logic when the system is shut down
    console.log(`System "${this.constructor.name}" destroyed.`);
  }
}

console.log("BaseSystem class (src/game-client/systems/BaseSystem.ts) created.");
