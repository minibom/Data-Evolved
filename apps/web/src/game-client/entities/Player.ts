// src/game-client/entities/Player.ts
import { Entity } from './Entity';
import type { GameClient } from '../core/GameClient'; // Corrected import path
import type { InputManager } from '../core/InputManager';

// Placeholder types - these should come from @packages/common-types
type Item = any;
type Quest = any;
type Skill = any;
type FactionType = "AICore" | "Hacker" | "Neutral" | string;
type Base = any; // Player's home base structure
type Reputation = any; // Reputation with factions
type PlayerData = any; // For initial player data from server
type CodeInjectionData = any;

export class Player extends Entity {
  public inventory: Item[] = [];
  public quests: Quest[] = [];
  public skills: Skill[] = [];
  public faction: FactionType = "Neutral";
  public base: Base | null = null;
  public reputation: Reputation | null = null; // More complex type needed

  private speed: number = 200; // Pixels per second

  // Conceptual properties for icon representation based on evolution stage
  public evolutionStage: 'initial' | 'faction_chosen' | 'fully_developed' = 'initial';
  public currentIconName: string = 'Code'; // Default icon for initial stage

  constructor(game: GameClient, x: number, y: number, data?: PlayerData) {
    super(game, x, y, data?.name || "PlayerEntity", data?.initialStats);
    // Initialize player-specific properties from data if provided
    if (data) {
      this.inventory = data.inventory || [];
      this.quests = data.quests || [];
      this.skills = data.skills || [];
      this.faction = data.faction || "Neutral";
      this.evolutionStage = data.evolutionStage || 'initial';
      this.currentIconName = data.currentIconName || (this.evolutionStage === 'initial' ? 'Code' : 'Bot');
      // GHZ, Power, Memory, Firewall are handled by Entity constructor
    }
    console.log(`Player entity (ID: ${this.id}, Name: ${this.name}, Icon: ${this.currentIconName}) initialized.`);
  }

  public move(dx: number, dy: number): void {
    // This method might be called by update based on input
    this.x += dx;
    this.y += dy;
    // Add boundary checks or collision detection here from CombatSystem or MapManager
  }

  public update(delta: number, inputManager?: InputManager): void { // delta is in ms
    if (!this.isAlive()) return;

    if (inputManager) {
        let moveX = 0;
        let moveY = 0;
        const actualDeltaTimeSeconds = delta / 1000; // Convert ms to seconds for speed calculation

        if (inputManager.isKeyDown('KeyW') || inputManager.isKeyDown('ArrowUp')) moveY -= 1;
        if (inputManager.isKeyDown('KeyS') || inputManager.isKeyDown('ArrowDown')) moveY += 1;
        if (inputManager.isKeyDown('KeyA') || inputManager.isKeyDown('ArrowLeft')) moveX -= 1;
        if (inputManager.isKeyDown('KeyD') || inputManager.isKeyDown('ArrowRight')) moveX += 1;

        if (moveX !== 0 || moveY !== 0) {
          const length = Math.sqrt(moveX * moveX + moveY * moveY);
          const normalizedDx = (moveX / length) * this.speed * actualDeltaTimeSeconds;
          const normalizedDy = (moveY / length) * this.speed * actualDeltaTimeSeconds;
          this.move(normalizedDx, normalizedDy);
        }
        // Handle actions like attacking, using skills based on input
        // if (inputManager.isKeyPressed('Space')) this.performAttack();
    }
    // Other player-specific updates
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (!this.isAlive() && this.sprite) {
        // Optional: render differently if not alive (e.g. dimmed, or specific death sprite)
    }

    if (this.sprite) {
      // renderer.drawImage(this.sprite, this.x, this.y, this.width, this.height); // Assuming width/height are set
    } else {
      renderer.fillStyle = this.faction === 'AICore' ? 'hsl(var(--primary))' : this.faction === 'Hacker' ? 'hsl(var(--accent))' : 'green';
      renderer.fillRect(this.x - 16, this.y - 24, 32, 48); // Example size
      renderer.fillStyle = 'white';
      renderer.font = '10px Space Grotesk';
      renderer.textAlign = 'center';
      renderer.fillText(this.name.substring(0, 8), this.x, this.y - 30);
      renderer.textAlign = 'left'; // Reset
    }
    // Render health bar, name, etc.
  }

  public useItem(item: Item): void {
    console.log(`${this.name} uses item: ${item.name}`);
    // Implement item usage logic, e.g., call InventorySystem
  }

  public gainXP(amount: number): void {
    console.log(`${this.name} gained ${amount} XP.`);
    // Implement XP and leveling logic
  }
  
  public applyCodeInjection(code: CodeInjectionData): void {
    console.log(`${this.name} is attempting to apply code injection:`, code);
    // This would likely interact with the CombatSystem or a new CodeInjectionSystem
    // to modify stats, abilities, or apply effects.
    // Example: this.game.getSystem(CombatSystem).processCodeInjectionEffects(this, code);
  }

  protected onDeath(): void {
    super.onDeath(); // Call Entity's onDeath
    console.log(`Player ${this.name} has been disconnected from the Nexus. Awaiting respawn protocol...`);
    // Implement player-specific death logic (e.g., respawn timer, drop items with penalty)
  }
}

console.log("Player class (apps/web/src/game-client/entities/Player.ts) updated with evolutionStage and currentIconName.");
