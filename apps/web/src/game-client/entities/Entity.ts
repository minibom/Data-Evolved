// src/game-client/entities/Entity.ts
import type { GameClient } from '../index';

// Placeholder for rendering object type (e.g., PIXI.Sprite or THREE.Object3D)
type RenderableObject = any; 

export abstract class Entity {
  public id: string;
  public x: number;
  public y: number;
  public name: string;
  public sprite: RenderableObject | null = null; // Placeholder for actual sprite/model

  // Combat Stats from diagram
  public power: number;    // Core HP
  public memory: number;   // Mental HP / Mana / Skill resource
  public firewall: number; // Defense
  public ghz: number;      // Attack / Processing Speed / Primary damage stat

  protected game: GameClient; // Reference to the game client

  constructor(
    game: GameClient, 
    x: number, 
    y: number, 
    name: string,
    initialStats?: { power?: number, memory?: number, firewall?: number, ghz?: number }
  ) {
    this.id = `${this.constructor.name}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.game = game;
    this.x = x;
    this.y = y;
    this.name = name;

    // Initialize stats
    this.power = initialStats?.power || 100;
    this.memory = initialStats?.memory || 50;
    this.firewall = initialStats?.firewall || 5;
    this.ghz = initialStats?.ghz || 10;

    console.log(`${this.name} (ID: ${this.id}) created at (${x.toFixed(0)}, ${y.toFixed(0)}).`);
  }

  public isAlive(): boolean {
    return this.power > 0;
  }

  public takeDamage(amount: number): void {
    if (!this.isAlive()) return;

    const mitigatedDamage = Math.max(0, amount - this.firewall); // Simple mitigation
    this.power -= mitigatedDamage;
    console.log(`${this.name} took ${mitigatedDamage} damage. Current Power: ${this.power}`);

    if (this.power <= 0) {
      this.power = 0;
      this.onDeath();
    }
  }
  
  protected onDeath(): void {
    console.log(`${this.name} (ID: ${this.id}) has been defeated.`);
    // Default death behavior, can be overridden
    // e.g., mark for removal from game world, play death animation
  }

  public abstract update(delta: number): void;

  public abstract render(renderer: CanvasRenderingContext2D | any): void;

  public destroy(): void {
    console.log(`${this.name} (ID: ${this.id}) destroyed.`);
    // Cleanup resources, remove from scene, etc.
  }
}

console.log("Entity base class (src/game-client/entities/Entity.ts) created.");
