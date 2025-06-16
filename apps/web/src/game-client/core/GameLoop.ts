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
    // Pass deltaTime in milliseconds to updateFn as per diagram (delta implies time change)
    while (this.accumulatedTime >= this.timeStep) {
      this.updateFn(this.timeStep); 
      this.accumulatedTime -= this.timeStep;
    }

    this.renderFn();

    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.accumulatedTime = 0; // Reset accumulated time on start
    this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    console.log("GameLoop started.");
  }

  public stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    console.log("GameLoop stopped.");
  }

  // Methods to match UML diagram (already covered by constructor and loop logic)
  public update(delta: number): void {
    // This method in UML might represent the internal update call,
    // which is handled by `this.updateFn(delta)` in the loop.
    // If it's meant to be an external way to force an update, its usage would differ.
    // For now, assuming it's covered by the internal loop.
    this.updateFn(delta);
  }

  public render(): void {
    // Similar to update, this is covered by `this.renderFn()` in the loop.
    this.renderFn();
  }
}

console.log("GameLoop class (src/game-client/core/GameLoop.ts) updated.");
