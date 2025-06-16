// src/game-client/ui/HealthBar.ts
// Renders a health bar (Power & Memory) for an entity on the game canvas.

export class HealthBar {
  private entity: any; // The entity this health bar is for (e.g., Player, EnemyAI)
  private xOffset: number;
  private yOffset: number;
  private width: number;
  private height: number;
  private powerColor: string = 'rgba(255, 0, 0, 0.8)'; // Red for Power
  private memoryColor: string = 'rgba(0, 0, 255, 0.8)'; // Blue for Memory
  private backgroundColor: string = 'rgba(50, 50, 50, 0.7)';
  private borderColor: string = 'rgba(200, 200, 200, 0.9)';

  constructor(entity: any, width: number = 50, height: number = 8, xOffset: number = 0, yOffset: number = -15) {
    this.entity = entity;
    this.width = width;
    this.height = height;
    this.xOffset = xOffset;
    this.yOffset = yOffset; // Position above the entity
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (!this.entity.stats || typeof this.entity.stats.power !== 'number' || typeof this.entity.stats.memory !== 'number') {
      // console.warn("HealthBar: Entity missing required stats (power, memory).", this.entity);
      return;
    }
    // Assuming entity has a 'maxPower' and 'maxMemory' stat or a way to get it
    const maxPower = this.entity.maxPower || this.entity.stats.power / (this.entity.stats.power > 0 ? (this.entity.stats.power / (this.entity.maxPower || 100)) : 1) || 100; // Prevent division by zero if stats are missing or 0
    const maxMemory = this.entity.maxMemory || this.entity.stats.memory / (this.entity.stats.memory > 0 ? (this.entity.stats.memory / (this.entity.maxMemory || 100)) : 1) || 100;

    const barX = this.entity.x + this.xOffset - this.width / 2 + this.entity.width / 2; // Centered above entity
    const barY = this.entity.y + this.yOffset;

    // Background
    renderer.fillStyle = this.backgroundColor;
    renderer.fillRect(barX, barY, this.width, this.height * 2 + 2); // Taller to accommodate two bars

    // Power Bar
    const powerRatio = Math.max(0, this.entity.stats.power) / maxPower;
    renderer.fillStyle = this.powerColor;
    renderer.fillRect(barX + 1, barY + 1, (this.width - 2) * powerRatio, this.height - 2);

    // Memory Bar (below Power bar)
    const memoryRatio = Math.max(0, this.entity.stats.memory) / maxMemory;
    renderer.fillStyle = this.memoryColor;
    renderer.fillRect(barX + 1, barY + this.height + 1, (this.width - 2) * memoryRatio, this.height - 2);
    
    // Border
    renderer.strokeStyle = this.borderColor;
    renderer.lineWidth = 0.5;
    renderer.strokeRect(barX, barY, this.width, this.height * 2 + 2);
  }
}

console.log("HealthBar class (src/game-client/ui/HealthBar.ts) loaded.");
