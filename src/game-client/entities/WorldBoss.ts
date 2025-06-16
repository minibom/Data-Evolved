// src/game-client/entities/WorldBoss.ts
import { EnemyAI } from './EnemyAI'; // Bosses are a type of EnemyAI
import type { GameClient } from '../index';
// import type { Boss as BossData } from '@packages/common-types/boss'; // Game data definition

export class WorldBoss extends EnemyAI {
  public bossDataId: string; // ID from bosses.json or similar
  // Add boss-specific properties: phases, unique abilities, enrage timers, etc.

  constructor(gameClient: GameClient, x: number, y: number, bossDataId: string) {
    // EnemyAI constructor needs enemyType, which can be derived from bossDataId or be bossDataId itself
    super(gameClient, x, y, `boss_${bossDataId}`); 
    this.type = "WorldBoss";
    this.bossDataId = bossDataId;
    
    // Override default EnemyAI stats/dimensions with boss-specific ones
    this.width = 128; // Bosses are typically larger
    this.height = 128;
    // this.stats = loadBossStats(bossDataId); // Load from data
    this.stats = { // Mock boss stats
        power: 50000, memory: 10000, firewall: 100, ghz: 500, speed: 80
    };
    this.aggroRadius = 500;
    this.attackRange = 100;
    this.attackCooldown = 3000;

    console.log(`WorldBoss "${this.bossDataId}" (ID: ${this.id}, Type: ${this.enemyType}) initialized.`);
  }

  public update(deltaTime: number /*, playerList: Player[] */): void {
    super.update(deltaTime /*, playerList */);
    // Boss-specific AI logic: ability cycles, phase transitions, targeting priorities
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    // Custom rendering for bosses (larger, more detailed sprite)
    renderer.fillStyle = 'purple'; // Boss color
    renderer.fillRect(this.x, this.y, this.width, this.height);
    renderer.fillStyle = 'white';
    renderer.font = '16px Arial';
    renderer.textAlign = 'center';
    renderer.fillText(this.bossDataId, this.x + this.width/2, this.y + this.height/2);
    renderer.textAlign = 'left'; // Reset
    // Render health bar, ability cast bars, etc.
  }

  protected onDefeat(): void {
    super.onDefeat(); // Call base EnemyAI onDefeat
    console.log(`WorldBoss "${this.bossDataId}" has been vanquished!`);
    // Trigger world event, distribute global rewards, update leaderboards
    // this.gameClient.getWorldEventManager().triggerEvent('boss_defeated', { bossId: this.bossDataId });
  }
}

console.log("WorldBoss class (src/game-client/entities/WorldBoss.ts) loaded.");
