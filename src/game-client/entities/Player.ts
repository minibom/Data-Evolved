// src/game-client/entities/Player.ts
import { BaseObject } from './BaseObject';
import type { GameClient } from '../index';
import type { InputManager } from '../core/InputManager'; // Assuming InputManager exists
import type { PlayerStats } from '@packages/common-types/game'; // Assuming game types are defined

export class Player extends BaseObject {
  public stats: PlayerStats;
  public speed: number = 200; // Pixels per second
  private sprite: HTMLImageElement | null = null; // Placeholder for player sprite

  constructor(gameClient: GameClient, x: number, y: number) {
    super(gameClient, x, y, 32, 48); // Example dimensions
    this.type = "Player";
    this.stats = { // Default/Initial stats, should be loaded from server
      power: 100,
      memory: 100,
      firewall: 10,
      ghz: 5,
    };
    this.loadSprite(); // Example of loading an asset
    console.log(`Player entity (ID: ${this.id}) initialized with stats.`);
  }

  private async loadSprite() {
    // Example: this.sprite = await this.gameClient.getAssetManager()?.getImage('player_sprite');
    // For now, just a log
    console.log("Player sprite loading initiated (placeholder).");
  }

  public update(deltaTime: number, inputManager: InputManager): void {
    super.update(deltaTime);

    let dx = 0;
    let dy = 0;

    if (inputManager.isKeyDown('KeyW') || inputManager.isKeyDown('ArrowUp')) dy -= 1;
    if (inputManager.isKeyDown('KeyS') || inputManager.isKeyDown('ArrowDown')) dy += 1;
    if (inputManager.isKeyDown('KeyA') || inputManager.isKeyDown('ArrowLeft')) dx -= 1;
    if (inputManager.isKeyDown('KeyD') || inputManager.isKeyDown('ArrowRight')) dx += 1;

    if (dx !== 0 || dy !== 0) {
      // Normalize diagonal movement
      const length = Math.sqrt(dx * dx + dy * dy);
      dx = (dx / length) * this.speed * deltaTime;
      dy = (dy / length) * this.speed * deltaTime;

      this.x += dx;
      this.y += dy;
      // Add boundary checks or collision detection here
    }

    // Handle actions like attacking, using skills based on input
    // if (inputManager.isKeyPressed('Space')) this.performAttack();
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    // Example rendering
    if (this.sprite) {
      renderer.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    } else {
      // Fallback rendering if sprite not loaded
      renderer.fillStyle = 'blue'; // Player color
      renderer.fillRect(this.x, this.y, this.width, this.height);
      renderer.fillStyle = 'white';
      renderer.font = '10px Arial';
      renderer.fillText(this.id.substring(0,4), this.x + 2, this.y + 10);
    }

    // Render health bar, etc.
    // const healthBarWidth = (this.stats.power / MAX_POWER_STAT) * this.width;
    // renderer.fillStyle = 'red';
    // renderer.fillRect(this.x, this.y - 10, healthBarWidth, 5);
  }

  // Example method
  public takeDamage(amount: number): void {
    const mitigatedDamage = Math.max(0, amount - this.stats.firewall);
    this.stats.power -= mitigatedDamage;
    console.log(`Player ${this.id} took ${mitigatedDamage} damage. Power: ${this.stats.power}`);
    if (this.stats.power <= 0) {
      this.onDeath();
    }
  }

  private onDeath(): void {
    console.log(`Player ${this.id} has been defeated.`);
    // Handle player death (respawn logic, notify server, etc.)
  }
  
  public getStats(): PlayerStats {
      return {...this.stats};
  }
}

console.log("Player class (src/game-client/entities/Player.ts) loaded.");
