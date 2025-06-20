// src/game-client/core/GameLoop.ts

type UpdateCallback = (deltaTime: number) => void;
type RenderCallback = () => void;

export class GameLoop {
  private lastTime: number = 0;
  private accumulatedTime: number = 0;
  private timeStep: number = 1000 / 60; // Target 60 FPS
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;

  private updateFn: UpdateCallback;
  private renderFn: RenderCallback;

  constructor(updateFn: UpdateCallback, renderFn: RenderCallback) {
    this.updateFn = updateFn;
    this.renderFn = renderFn;
    console.log("GameLoop initialized.");
  }

  private loop(currentTime: number): void {
    if (!this.isRunning) return;

    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    this.accumulatedTime += deltaTime;

    // Fixed time step updates for physics and game logic
    while (this.accumulatedTime >= this.timeStep) {
      this.updateFn(this.timeStep / 1000); // Pass deltaTime in seconds
      this.accumulatedTime -= this.timeStep;
    }

    this.renderFn();

    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    console.log("GameLoop started.");
  }

  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    console.log("GameLoop stopped.");
  }
}

console.log("GameLoop class (src/game-client/core/GameLoop.ts) loaded.");
