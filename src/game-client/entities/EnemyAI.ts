// src/game-client/entities/EnemyAI.ts
import { BaseObject } from './BaseObject';
import type { GameClient } from '../index';
// import type { Player } from './Player'; // For targeting

interface EnemyStats { // Simplified for example
    power: number;
    memory: number;
    firewall: number;
    ghz: number;
    speed: number;
}

export class EnemyAI extends BaseObject {
  public enemyType: string; // e.g., "CorruptedDrone", "DataAnomalyAlpha"
  public stats: EnemyStats;
  private target: BaseObject | null = null; // Current target (e.g., player)
  private aggroRadius: number = 200;
  private attackRange: number = 50;
  private attackCooldown: number = 2000; // ms
  private lastAttackTime: number = 0;

  constructor(gameClient: GameClient, x: number, y: number, enemyType: string) {
    super(gameClient, x, y, 40, 40); // Example dimensions
    this.type = "EnemyAI";
    this.enemyType = enemyType;
    // Load stats and abilities based on enemyType (from data/enemies.json or similar)
    this.stats = { power: 50, memory: 20, firewall: 5, ghz: 10, speed: 100 }; // Mock stats
    console.log(`Enemy "${enemyType}" (ID: ${this.id}) initialized.`);
  }

  public setTarget(target: BaseObject | null): void {
    this.target = target;
  }

  public update(deltaTime: number /*, playerList: Player[] */): void {
    super.update(deltaTime);

    // Basic AI: find player target if none, move towards target, attack if in range
    // if (!this.target) {
    //   for (const player of playerList) {
    //     const distance = Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2));
    //     if (distance < this.aggroRadius) {
    //       this.setTarget(player);
    //       break;
    //     }
    //   }
    // }

    if (this.target) {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const distanceToTarget = Math.sqrt(dx * dx + dy * dy);

      if (distanceToTarget > this.attackRange) {
        // Move towards target
        this.x += (dx / distanceToTarget) * this.stats.speed * deltaTime;
        this.y += (dy / distanceToTarget) * this.stats.speed * deltaTime;
      } else if (Date.now() - this.lastAttackTime > this.attackCooldown) {
        // Attack target
        this.performAttack(this.target);
        this.lastAttackTime = Date.now();
      }
      
      // if (distanceToTarget > this.aggroRadius * 1.5) { // Lose aggro if too far
      //    this.setTarget(null);
      // }
    }
    // Implement pathfinding, using abilities, etc.
  }

  private performAttack(target: BaseObject): void {
    console.log(`Enemy ${this.id} attacks ${target.id} for ${this.stats.ghz} GHZ damage (conceptual).`);
    // In a real system, this would trigger damage calculation on the target
    // e.g., if (target instanceof Player) target.takeDamage(this.stats.ghz);
  }
  
  public takeDamage(amount: number): void {
    const mitigatedDamage = Math.max(0, amount - this.stats.firewall);
    this.stats.power -= mitigatedDamage;
    console.log(`Enemy ${this.id} took ${mitigatedDamage} damage. Power: ${this.stats.power}`);
    if (this.stats.power <= 0) {
      this.onDefeat();
    }
  }

  private onDefeat(): void {
    console.log(`Enemy ${this.id} (${this.enemyType}) defeated.`);
    // Handle enemy death: drop loot, grant XP, remove from game world
    this.destroy(); // Mark for removal
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    renderer.fillStyle = 'red'; // Enemy color
    renderer.fillRect(this.x, this.y, this.width, this.height);
    renderer.fillStyle = 'white';
    renderer.font = '10px Arial';
    renderer.fillText(this.enemyType.substring(0,6), this.x + 2, this.y + 10);
  }
}

console.log("EnemyAI class (src/game-client/entities/EnemyAI.ts) loaded.");
