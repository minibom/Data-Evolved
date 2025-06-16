// src/game-client/entities/Entity.ts
import type { GameClient } from '../core/GameClient'; // Adjusted path
import type { PlayerStats as CommonPlayerStats } from '@packages/common-types/game';

// Placeholder for rendering object type (e.g., PIXI.Sprite or THREE.Object3D)
type RenderableObject = any; 

// Ensure PlayerStats here aligns with or extends CommonPlayerStats
export interface EntityStats extends CommonPlayerStats {
  // Add any additional entity-specific stats if needed, otherwise CommonPlayerStats is enough
  speed?: number; // Optional: movement speed
}

export abstract class Entity {
  public id: string;
  public x: number;
  public y: number;
  public name: string;
  public sprite: RenderableObject | null = null;

  // Combat Stats from PlayerStats (common type)
  public power: number;
  public memory: number;
  public firewall: number;
  public ghz: number;
  public speed: number; // Added for movement

  protected game: GameClient;

  constructor(
    game: GameClient, 
    x: number, 
    y: number, 
    name: string,
    initialStats?: Partial<EntityStats> // Use Partial to allow providing only some stats
  ) {
    this.id = `${this.constructor.name}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.game = game;
    this.x = x;
    this.y = y;
    this.name = name;

    // Initialize stats with defaults, then override with initialStats
    this.power = initialStats?.power || 100;
    this.memory = initialStats?.memory || 50;
    this.firewall = initialStats?.firewall || 5;
    this.ghz = initialStats?.ghz || 10;
    this.speed = initialStats?.speed || 100; // Default speed

    // console.log(`${this.name} (ID: ${this.id}) created at (${x.toFixed(0)}, ${y.toFixed(0)}) with stats.`);
  }

  public isAlive(): boolean {
    return this.power > 0;
  }

  public takeDamage(amount: number): void {
    if (!this.isAlive()) return;

    const mitigatedDamage = Math.max(0, amount - this.firewall);
    this.power -= mitigatedDamage;
    console.log(`${this.name} took ${mitigatedDamage} damage. Current Power: ${this.power}`);

    if (this.power <= 0) {
      this.power = 0;
      this.onDeath();
    }
  }
  
  protected onDeath(): void {
    console.log(`${this.name} (ID: ${this.id}) has been defeated.`);
  }

  // deltaMs is deltaTime in milliseconds
  public abstract update(deltaMs: number, ...args: any[]): void;

  public abstract render(renderer: CanvasRenderingContext2D | any): void;

  public destroy(): void {
    console.log(`${this.name} (ID: ${this.id}) destroyed.`);
  }
}
