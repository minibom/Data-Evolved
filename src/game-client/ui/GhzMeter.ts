// src/game-client/ui/GhzMeter.ts
// Displays the player's current GHZ and progress towards the next significant threshold (e.g., faction selection).

export class GhzMeter {
  private player: any; // Player entity, expected to have `currentGHZ` and `ghzToNextMilestone` (or similar)
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private ghzColor: string = 'rgba(0, 220, 220, 0.9)'; // Cyan for GHZ
  private progressColor: string = 'rgba(100, 255, 255, 0.7)';
  private backgroundColor: string = 'rgba(40, 40, 70, 0.8)';
  private borderColor: string = 'rgba(150, 220, 255, 0.9)';
  private font: string = "12px 'Source Code Pro', monospace";
  private labelColor: string = 'rgba(220, 220, 255, 1)';

  // GHZ_FACTION_THRESHOLD would come from constants
  private FACTION_THRESHOLD: number = 10; 

  constructor(playerEntity: any, canvasWidth: number, canvasHeight: number) {
    this.player = playerEntity;
    this.width = 150;
    this.height = 20;
    this.x = 20; // Positioned top-left
    this.y = 20;
    console.log("GhzMeter initialized.");
  }

  public updatePlayer(playerEntity: any): void {
    this.player = playerEntity;
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (!this.player || typeof this.player.currentGHZ !== 'number') {
      // console.warn("GhzMeter: Player entity or currentGHZ not available.");
      return;
    }

    const currentGhz = this.player.currentGHZ;
    // For now, next milestone is always faction threshold if not yet reached
    const nextMilestoneGhz = this.player.factionId ? (Math.floor(currentGhz / 10) + 1) * 10 : this.FACTION_THRESHOLD; // Example: next level up, or faction choice
    const ghzForCurrentLevel = this.player.factionId ? (Math.floor(currentGhz / 10)) * 10 : 0;
    
    const progressRatio = (currentGhz - ghzForCurrentLevel) / (nextMilestoneGhz - ghzForCurrentLevel);


    // Background
    renderer.fillStyle = this.backgroundColor;
    renderer.fillRect(this.x, this.y, this.width, this.height);

    // Progress Fill
    renderer.fillStyle = this.progressColor;
    renderer.fillRect(this.x + 2, this.y + 2, (this.width - 4) * Math.min(1,Math.max(0,progressRatio)), this.height - 4);
    
    // GHZ Bar (representing current absolute GHZ, could be a different visual)
    // For simplicity, we'll just use text for current GHZ.

    // Border
    renderer.strokeStyle = this.borderColor;
    renderer.lineWidth = 1;
    renderer.strokeRect(this.x, this.y, this.width, this.height);

    // Text Label
    renderer.fillStyle = this.labelColor;
    renderer.font = this.font;
    renderer.textAlign = 'center';
    const labelText = `GHZ: ${currentGhz.toFixed(1)} / ${nextMilestoneGhz}`;
    renderer.fillText(labelText, this.x + this.width / 2, this.y + this.height / 2 + 4);
    renderer.textAlign = 'left'; // Reset alignment
  }
}

console.log("GhzMeter class (src/game-client/ui/GhzMeter.ts) loaded.");
