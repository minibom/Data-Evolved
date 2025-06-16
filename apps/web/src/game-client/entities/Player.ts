// src/game-client/entities/Player.ts
import { Entity } from './Entity';
import type { GameClient } from '../core/GameClient';
import type { InputManager } from '../core/InputManager';
import type { PlayerData, Item, Quest, Skill, FactionType, Base, Reputation, CodeInjectionData, PlayerAppearance } from '@packages/common-types/game';

export class Player extends Entity {
  public inventory: Item[] = []; // Should be ItemInstance[]
  public quests: Quest[] = []; // Should be PlayerQuestDoc[]
  public skills: Skill[] = [];
  public faction: FactionType = "Neutral";
  public base: Base | null = null;
  public reputation: Reputation | null = null;
  public appearance: PlayerAppearance; // Added appearance
  public progressionGHZ: number = 0; // Tracks progress towards faction choice etc.


  public width: number = 32; 
  public height: number = 48; 

  // Player's movement speed in pixels per second
  private readonly baseSpeed: number = 150; 

  constructor(game: GameClient, x: number, y: number, data: PlayerData) {
    super(game, x, y, data.name, data.stats); // Pass full stats object
    
    this.inventory = (data.inventory || []) as Item[]; // Cast for now, should be ItemInstance[]
    this.quests = (data.activeQuests || []).map(id => ({id, title: `Quest ${id}`}) as Quest); // Mock conversion
    this.skills = data.skills || [];
    this.faction = data.factionId || "Neutral";
    this.appearance = data.appearance || { primaryColor: '#FFFFFF', secondaryColor: '#000000' };
    this.progressionGHZ = data.currentGHZ || 0; // Use currentGHZ from PlayerData for progression
    
    // GHZ for combat comes from data.stats.ghz via Entity constructor
    
    console.log(`Player entity (ID: ${this.id}, Name: ${this.name}) initialized.`);
  }

  public move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
    // Add boundary checks or collision detection here
  }

  public update(deltaMs: number, inputManager?: InputManager): void {
    if (!this.isAlive()) return;

    if (inputManager) {
        let moveX = 0;
        let moveY = 0;
        const deltaTimeSeconds = deltaMs / 1000; // Convert ms to seconds for speed calculation

        if (inputManager.isKeyDown('KeyW') || inputManager.isKeyDown('ArrowUp')) moveY -= 1;
        if (inputManager.isKeyDown('KeyS') || inputManager.isKeyDown('ArrowDown')) moveY += 1;
        if (inputManager.isKeyDown('KeyA') || inputManager.isKeyDown('ArrowLeft')) moveX -= 1;
        if (inputManager.isKeyDown('KeyD') || inputManager.isKeyDown('ArrowRight')) moveX += 1;

        if (moveX !== 0 || moveY !== 0) {
          const length = Math.sqrt(moveX * moveX + moveY * moveY);
          // Normalize vector and apply speed
          const normalizedDx = (moveX / length) * this.baseSpeed * deltaTimeSeconds;
          const normalizedDy = (moveY / length) * this.baseSpeed * deltaTimeSeconds;
          this.move(normalizedDx, normalizedDy);
          
          // Placeholder: Clamp position to canvas bounds (remove if map/camera handles this)
          this.x = Math.max(this.width / 2, Math.min(this.x, this.game.canvas.width - this.width / 2));
          this.y = Math.max(this.height / 2, Math.min(this.y, this.game.canvas.height - this.height / 2));
        }
    }
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (this.sprite) {
      // renderer.drawImage(this.sprite, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    } else {
      // Use appearance colors
      renderer.fillStyle = this.appearance.primaryColor || 'green';
      renderer.strokeStyle = this.appearance.secondaryColor || 'darkgreen';
      renderer.lineWidth = 2;
      
      renderer.beginPath();
      renderer.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      renderer.fill();
      renderer.stroke();
      
      renderer.fillStyle = 'hsl(var(--foreground))';
      renderer.font = '10px Space Grotesk';
      renderer.textAlign = 'center';
      renderer.fillText(this.name.substring(0, 8), this.x, this.y - this.height / 2 - 5);
      renderer.textAlign = 'left'; // Reset
    }
  }

  public useItem(item: Item): void {
    console.log(`${this.name} uses item: ${item.name}`);
    // Implement item usage logic
  }

  public gainXP(amount: number): void {
    this.xp += amount; // Assuming xp is part of Entity or Player directly
    console.log(`${this.name} gained ${amount} XP. Total XP: ${this.xp}`);
    // Check for level up
  }
  
  public applyCodeInjection(code: CodeInjectionData): void {
    console.log(`${this.name} is attempting to apply code injection:`, code);
    // Implement code injection logic
  }

  protected onDeath(): void {
    super.onDeath();
    console.log(`Player ${this.name} has been disconnected from the Nexus. Awaiting respawn protocol...`);
    // Handle player death (e.g., respawn timer, UI update, event dispatch)
  }
}
