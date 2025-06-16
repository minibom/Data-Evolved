// src/game-client/entities/Player.ts
import { Entity } from './Entity';
import type { GameClient } from '../core/GameClient';
import type { InputManager } from '../core/InputManager';
import type { PlayerData, Item, Quest, Skill, FactionType, Base, Reputation, CodeInjectionData } from '@packages/common-types/game'; // Assuming these types exist

export class Player extends Entity {
  public inventory: Item[] = []; // Should be ItemInstance[]
  public quests: Quest[] = []; // Should be PlayerQuestDoc[]
  public skills: Skill[] = [];
  public faction: FactionType = "Neutral";
  public base: Base | null = null; // Define Base type
  public reputation: Reputation | null = null; // Define Reputation type
  public width: number = 32; // Default width for rendering
  public height: number = 48; // Default height for rendering

  private speed: number = 150; // Pixels per second

  // Conceptual properties for icon representation based on evolution stage
  public evolutionStage: 'initial' | 'faction_chosen' | 'fully_developed' = 'initial';
  public currentIconName: string = 'Code'; // Default icon for initial stage

  constructor(game: GameClient, x: number, y: number, data: PlayerData) { // data is now PlayerData
    super(game, x, y, data?.name || "PlayerEntity", data?.stats); // Pass stats from PlayerData
    // Initialize player-specific properties from data if provided
    this.inventory = data.inventory || [];
    this.quests = (data.activeQuests || []).map(id => ({id, title: `Quest ${id}`}) as Quest[]); // Mock conversion
    this.skills = data.skills || [];
    this.faction = data.factionId || "Neutral";
    this.evolutionStage = data.evolutionStage || 'initial';
    this.currentIconName = data.currentIconName || (this.evolutionStage === 'initial' ? 'Code' : 'Bot');
    
    // Ensure GHZ is set from data if available, otherwise Entity constructor's default
    if (data.currentGHZ) this.ghz = data.currentGHZ;

    console.log(`Player entity (ID: ${this.id}, Name: ${this.name}, Icon: ${this.currentIconName}) initialized.`);
  }

  public move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }

  public update(deltaMs: number, inputManager?: InputManager): void {
    if (!this.isAlive()) return;

    if (inputManager) {
        let moveX = 0;
        let moveY = 0;
        const deltaTimeSeconds = deltaMs / 1000;

        if (inputManager.isKeyDown('KeyW') || inputManager.isKeyDown('ArrowUp')) moveY -= 1;
        if (inputManager.isKeyDown('KeyS') || inputManager.isKeyDown('ArrowDown')) moveY += 1;
        if (inputManager.isKeyDown('KeyA') || inputManager.isKeyDown('ArrowLeft')) moveX -= 1;
        if (inputManager.isKeyDown('KeyD') || inputManager.isKeyDown('ArrowRight')) moveX += 1;

        if (moveX !== 0 || moveY !== 0) {
          const length = Math.sqrt(moveX * moveX + moveY * moveY);
          const normalizedDx = (moveX / length) * this.speed * deltaTimeSeconds;
          const normalizedDy = (moveY / length) * this.speed * deltaTimeSeconds;
          this.move(normalizedDx, normalizedDy);
        }
    }
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (this.sprite) {
      // renderer.drawImage(this.sprite, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    } else {
      renderer.fillStyle = this.faction === 'AICore' ? 'hsl(var(--primary))' : this.faction === 'Hacker' ? 'hsl(var(--accent))' : 'green';
      renderer.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      
      // Draw name centered above
      renderer.fillStyle = 'hsl(var(--foreground))';
      renderer.font = '10px Space Grotesk';
      renderer.textAlign = 'center';
      renderer.fillText(this.name.substring(0, 8), this.x, this.y - this.height / 2 - 5);
      renderer.textAlign = 'left'; // Reset
    }
  }

  public useItem(item: Item): void {
    console.log(`${this.name} uses item: ${item.name}`);
  }

  public gainXP(amount: number): void {
    console.log(`${this.name} gained ${amount} XP.`);
  }
  
  public applyCodeInjection(code: CodeInjectionData): void {
    console.log(`${this.name} is attempting to apply code injection:`, code);
  }

  protected onDeath(): void {
    super.onDeath();
    console.log(`Player ${this.name} has been disconnected from the Nexus. Awaiting respawn protocol...`);
  }
}
