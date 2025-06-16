// src/game-client/ui/BossHealthBar.ts
// Renders a prominent health bar for a World Boss, usually at the top or bottom of the screen.

export class BossHealthBar {
  private boss: any; // The WorldBoss entity
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private healthColor: string = 'rgba(220, 20, 60, 0.9)'; // Crimson for boss health
  private backgroundColor: string = 'rgba(30, 30, 30, 0.8)';
  private borderColor: string = 'rgba(255, 255, 255, 0.7)';
  private nameColor: string = 'rgba(255, 255, 255, 1)';
  private nameFont: string = "bold 20px 'Space Grotesk', sans-serif";
  private isVisible: boolean = false;

  constructor(canvasWidth: number, boss?: any) {
    this.width = canvasWidth * 0.6; // 60% of canvas width
    this.height = 25;
    this.x = (canvasWidth - this.width) / 2; // Centered
    this.y = 20; // Positioned near the top
    if (boss) this.setBoss(boss);
    console.log("BossHealthBar initialized.");
  }

  public setBoss(bossEntity: any): void {
    this.boss = bossEntity;
    this.isVisible = true;
    console.log(`BossHealthBar tracking boss: ${this.boss?.bossDataId || this.boss?.name || 'Unknown Boss'}`);
  }

  public hide(): void {
    this.isVisible = false;
    this.boss = null;
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (!this.isVisible || !this.boss || !this.boss.stats || typeof this.boss.stats.power !== 'number') {
      return;
    }
    // Assuming boss has maxPower or similar (e.g., from its definition)
    const maxHp = this.boss.maxHp || this.boss.stats.maxPower || 1; // Prevent division by zero
    const currentHp = Math.max(0, this.boss.stats.power);
    const healthRatio = currentHp / maxHp;

    // Background
    renderer.fillStyle = this.backgroundColor;
    renderer.fillRect(this.x, this.y, this.width, this.height);

    // Health Fill
    renderer.fillStyle = this.healthColor;
    renderer.fillRect(this.x + 2, this.y + 2, (this.width - 4) * healthRatio, this.height - 4);
    
    // Border
    renderer.strokeStyle = this.borderColor;
    renderer.lineWidth = 2;
    renderer.strokeRect(this.x, this.y, this.width, this.height);

    // Boss Name Text
    renderer.fillStyle = this.nameColor;
    renderer.font = this.nameFont;
    renderer.textAlign = 'center';
    const bossName = this.boss.name || this.boss.bossDataId || "World Boss";
    renderer.fillText(bossName, this.x + this.width / 2, this.y + this.height / 2 + 7); // Adjust for text alignment
    renderer.textAlign = 'left'; // Reset alignment
  }
}

console.log("BossHealthBar class (src/game-client/ui/BossHealthBar.ts) loaded.");
