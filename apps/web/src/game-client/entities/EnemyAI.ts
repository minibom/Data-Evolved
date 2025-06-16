// src/game-client/entities/EnemyAI.ts
import { Entity } from './Entity';
import type { GameClient } from '../index';
import type { Player } from './Player'; // For targeting

// Placeholder types
type EnemyData = { name?: string, initialStats?: any, aggroRange?: number, attackRange?: number, enemyType?: string };

export class EnemyAI extends Entity {
  public target: Entity | null = null;
  public aggroRange: number;
  public attackRange: number;
  public enemyType: string;

  private attackCooldown: number = 2000; // ms
  private lastAttackTime: number = 0;
  private speed: number;

  constructor(game: GameClient, x: number, y: number, data: EnemyData) {
    super(game, x, y, data.name || "EnemyAI", data.initialStats);
    this.enemyType = data.enemyType || "GenericEnemy";
    this.aggroRange = data.aggroRange || 200;
    this.attackRange = data.attackRange || 50;
    this.speed = data.initialStats?.speed || 100; // Default speed if not in stats
    console.log(`EnemyAI "${this.name}" (Type: ${this.enemyType}, ID: ${this.id}) initialized.`);
  }

  public findTarget(): void {
    // Find the closest player or highest threat target within aggroRange
    // Example:
    // const players = this.game.getEntitiesByType(Player); // Assuming GameClient has such a method
    // let closestPlayer: Player | null = null;
    // let minDistance = this.aggroRange;
    // for (const player of players) {
    //   if (!player.isAlive()) continue;
    //   const distance = Math.sqrt(Math.pow(this.x - player.x, 2) + Math.pow(this.y - player.y, 2));
    //   if (distance < minDistance) {
    //     minDistance = distance;
    //     closestPlayer = player;
    //   }
    // }
    // this.target = closestPlayer;
    // if (this.target) console.log(`${this.name} targeted ${this.target.name}`);
  }

  public pathfindToTarget(): void {
    if (!this.target || !this.isAlive()) return;

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distanceToTarget = Math.sqrt(dx * dx + dy * dy);

    if (distanceToTarget > this.attackRange) { // Only move if outside attack range
      const moveSpeed = this.speed * (this.game.gameLoop?.timeStep / 1000 || 1/60) ; // Assuming gameLoop is accessible and provides timeStep
      this.x += (dx / distanceToTarget) * moveSpeed;
      this.y += (dy / distanceToTarget) * moveSpeed;
    }
  }

  public attack(): void {
    if (!this.target || !this.target.isAlive() || !this.isAlive()) return;
    
    const currentTime = Date.now();
    if (currentTime - this.lastAttackTime > this.attackCooldown) {
      console.log(`${this.name} attacks ${this.target.name} for ${this.ghz} (conceptual) GHZ damage.`);
      // In a real system, this would trigger damage calculation via CombatSystem
      // this.game.getSystem(CombatSystem).processAttack(this, this.target);
      this.target.takeDamage(this.ghz); // Direct damage for placeholder
      this.lastAttackTime = currentTime;
    }
  }

  public update(delta: number): void { // delta is deltaTime in ms
    if (!this.isAlive()) return;

    if (!this.target || !this.target.isAlive()) {
      this.findTarget();
    }

    if (this.target) {
      this.pathfindToTarget();
      const distanceToTarget = Math.sqrt(Math.pow(this.x - this.target.x, 2) + Math.pow(this.y - this.target.y, 2));
      if (distanceToTarget <= this.attackRange) {
        this.attack();
      }
      // Check if target is too far to lose aggro
      if (distanceToTarget > this.aggroRange * 1.5) {
          // console.log(`${this.name} lost aggro on ${this.target.name}`);
          // this.target = null;
      }
    }
    // Other AI logic (using skills, evading, etc.)
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (!this.isAlive() && this.sprite) { /* Render differently if dead */ }

    if (this.sprite) {
      // renderer.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    } else {
      renderer.fillStyle = 'red'; // Enemy color
      renderer.fillRect(this.x - 16, this.y - 16, 32, 32); // Example size
      renderer.fillStyle = 'white';
      renderer.font = '10px Arial';
      renderer.textAlign = 'center';
      renderer.fillText(this.name.substring(0, 6), this.x, this.y - 20);
      renderer.textAlign = 'left'; // Reset
    }
  }
  
  protected onDeath(): void {
    super.onDeath();
    console.log(`Enemy ${this.name} (Type: ${this.enemyType}) destroyed. Drops loot (conceptual).`);
    // Handle enemy death: drop loot, grant XP, remove from game world
    // this.game.entityManager.removeEntity(this); // Example
  }
}

console.log("EnemyAI class (src/game-client/entities/EnemyAI.ts) updated.");
