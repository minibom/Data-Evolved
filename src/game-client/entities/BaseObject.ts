// src/game-client/entities/BaseObject.ts
import type { GameClient } from '../index';

export abstract class BaseObject {
  public id: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  protected gameClient: GameClient;
  public type: string = "BaseObject"; // For easier identification/debugging

  constructor(gameClient: GameClient, x: number, y: number, width: number = 32, height: number = 32) {
    this.id = `obj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.gameClient = gameClient;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    console.log(`${this.constructor.name} (ID: ${this.id}) created at (${x}, ${y}).`);
  }

  // Common update logic, can be overridden by subclasses
  public update(deltaTime: number): void {
    // Default: no update logic
  }

  // Common render logic, must be implemented by subclasses if they draw themselves
  public abstract render(renderer: CanvasRenderingContext2D | any): void; // Adjust renderer type

  // Basic bounding box collision check
  public collidesWith(other: BaseObject): boolean {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  // Method to handle cleanup when the object is removed
  public destroy(): void {
    console.log(`${this.constructor.name} (ID: ${this.id}) destroyed.`);
    // Unsubscribe from events, release resources, etc.
  }
}

console.log("BaseObject class (src/game-client/entities/BaseObject.ts) loaded.");
