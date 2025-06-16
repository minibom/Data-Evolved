// src/game-client/utils/animationUtils.ts
// Utilities for handling sprite animations or other visual effects.

// Example: A simple sprite sheet animation helper
export interface AnimationFrame {
  sourceX: number;
  sourceY: number;
  width: number;
  height: number;
  duration: number; // ms
}

export class SpriteAnimation {
  private frames: AnimationFrame[];
  private currentFrameIndex: number = 0;
  private timeSinceLastFrame: number = 0;
  public isPlaying: boolean = false;
  public loop: boolean = true;

  constructor(frames: AnimationFrame[], loop: boolean = true) {
    this.frames = frames;
    this.loop = loop;
  }

  public play(): void {
    this.isPlaying = true;
    this.currentFrameIndex = 0;
    this.timeSinceLastFrame = 0;
  }

  public stop(): void {
    this.isPlaying = false;
  }

  public update(deltaTimeMs: number): void {
    if (!this.isPlaying || this.frames.length === 0) return;

    this.timeSinceLastFrame += deltaTimeMs;
    const currentFrameData = this.frames[this.currentFrameIndex];

    if (this.timeSinceLastFrame >= currentFrameData.duration) {
      this.timeSinceLastFrame -= currentFrameData.duration; // Account for overshoot
      this.currentFrameIndex++;

      if (this.currentFrameIndex >= this.frames.length) {
        if (this.loop) {
          this.currentFrameIndex = 0;
        } else {
          this.isPlaying = false;
          this.currentFrameIndex = this.frames.length - 1; // Stay on last frame
        }
      }
    }
  }

  public getCurrentFrame(): AnimationFrame | null {
    if (this.frames.length === 0) return null;
    return this.frames[this.currentFrameIndex];
  }
}

// Example: Basic easing functions (t usually from 0 to 1)
export const EasingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  // Add more easing functions (cubic, sine, etc.)
};

console.log("Animation Utilities (src/game-client/utils/animationUtils.ts) loaded.");
