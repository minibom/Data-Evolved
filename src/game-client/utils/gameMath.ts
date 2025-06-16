// src/game-client/utils/gameMath.ts
// Collection of math utility functions specific to game logic.

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function normalizeVector(x: number, y: number): { x: number; y: number } {
  const len = Math.sqrt(x * x + y * y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: x / len, y: y / len };
}

// Linear interpolation
export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

// Degrees to Radians
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Radians to Degrees
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

// Get random integer between min (inclusive) and max (exclusive)
export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

// Get random float between min (inclusive) and max (exclusive)
export function getRandomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

console.log("Game Math utilities (src/game-client/utils/gameMath.ts) loaded.");
