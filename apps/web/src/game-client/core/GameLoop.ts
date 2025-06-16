// src/game-client/core/GameLoop.ts

type UpdateCallback = (deltaTimeMs: number) => void; // deltaTime in milliseconds
type RenderCallback = () => void;

export class GameLoop {
  private lastTime: number = 0;
  private accumulatedTime: number = 0;
  private timeStep: number = 1000 / 60; // Target 60 FPS, so timeStep is approx 16.67ms
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;

  private updateFn: UpdateCallback;
  private renderFn: RenderCallback;

  constructor(updateFn: UpdateCallback, renderFn: RenderCallback) {
    this.updateFn = updateFn;
    this.renderFn = renderFn;
    console.log(`GameLoop initialized with timeStep: ${this.timeStep.toFixed(2)}ms.`);
  }

  private loop(currentTime: number): void {
    if (!this.isRunning) return;

    let deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Cap delta time to prevent spiral of death if tab is inactive for too long
    if (deltaTime > 1000) { // Max 1 second jump
        deltaTime = 1000;
    }

    this.accumulatedTime += deltaTime;

    // Fixed time step updates for physics and game logic
    // Pass the fixed timeStep (in ms) to updateFn
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

  // These methods are for external calls if ever needed, but the loop itself uses updateFn and renderFn
  public update(deltaMs: number): void {
    this.updateFn(deltaMs);
  }

  public render(): void {
    this.renderFn();
  }
}
