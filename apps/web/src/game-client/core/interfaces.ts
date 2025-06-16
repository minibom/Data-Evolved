// src/game-client/core/interfaces.ts
/**
 * This file defines common TypeScript interfaces used by game entities and systems
 * to ensure consistent behavior and interactions. These promote a loosely coupled architecture.
 */

// import type { Entity } from '../entities/Entity'; // Or BaseObject if that's the base

/**
 * Represents an object that can be updated each frame.
 */
export interface IUpdatable {
  /**
   * Updates the state of the object.
   * @param deltaTime The time elapsed since the last frame, in seconds or milliseconds.
   * @param context Optional context, e.g., InputManager instance for player-controlled entities.
   */
  update(deltaTime: number, context?: any): void;
}

/**
 * Represents an object that can be rendered on the screen.
 */
export interface IRenderable {
  /**
   * Renders the object using the provided rendering context.
   * @param renderer The rendering context (e.g., CanvasRenderingContext2D, WebGL context, custom Renderer class).
   */
  render(renderer: any): void;
}

/**
 * Represents an object that can take damage.
 */
export interface IDamageable {
  /**
   * Applies damage to the object.
   * @param amount The amount of damage to apply.
   * @param type Optional. The type of damage (e.g., 'physical', 'data_corruption', 'firewall_breach').
   * @param source Optional. The entity or source that dealt the damage.
   */
  takeDamage(amount: number, type?: string, source?: any /* Entity */): void;

  /**
   * Checks if the object is currently alive or operational.
   * @returns True if alive/operational, false otherwise.
   */
  isAlive(): boolean;

  /**
   * Called when the object's health/power reaches zero or it's otherwise defeated.
   */
  onDeath?(): void; // Optional, as not all damageable things might "die" in the same way
}

/**
 * Represents an object that can be interacted with by other entities (e.g., player).
 */
export interface IInteractable {
  /**
   * Called when an entity attempts to interact with this object.
   * @param interactor The entity performing the interaction (e.g., the Player).
   * @returns A promise or value indicating the result or outcome of the interaction.
   */
  interact(interactor: any /* Entity */): Promise<any> | any;

  /**
   * Optional: A short description or prompt to display when the interactor is nearby.
   * @returns A string like "Press E to talk" or "Inspect Anomaly".
   */
  getInteractionPrompt?(): string;

  /**
   * Optional: Checks if the object is currently interactable by the given entity.
   * @param interactor The entity attempting to interact.
   * @returns True if interaction is possible, false otherwise.
   */
  canInteract?(interactor: any /* Entity */): boolean;
}

// Example of combining interfaces for an Entity
// export interface IGameEntity extends IUpdatable, IRenderable, IDamageable, IInteractable {
//   id: string;
//   x: number;
//   y: number;
//   // ... other common entity properties
// }

console.log("Core game interfaces (src/game-client/core/interfaces.ts) defined.");
