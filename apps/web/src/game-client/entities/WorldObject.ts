// src/game-client/entities/WorldObject.ts
import { Entity } from './Entity';
import type { GameClient } from '../index';
// import type { IInteractable, IUpdatable, IRenderable } from '../core/interfaces'; // Assuming interfaces are defined

/**
 * Represents a generic interactive or static object in the game world
 * that isn't necessarily a character (Player, NPC, Enemy) or a simple Item.
 * Examples: Doors, levers, lore terminals, resource nodes (if complex), environmental hazards.
 *
 * This class might be simpler than full-fledged characters and focus more on
 * specific interactions or environmental effects.
 */
export abstract class WorldObject extends Entity /* implements IUpdatable, IRenderable, Partial<IInteractable> */ {
  public objectType: string; // e.g., "Door", "ResourceNode_Crystal", "LoreTerminal"
  public isInteractive: boolean = false;

  constructor(
    game: GameClient,
    x: number,
    y: number,
    name: string,
    objectType: string,
    initialStats?: { power?: number, memory?: number, firewall?: number, ghz?: number }
  ) {
    // WorldObjects might not have typical combat stats, but Entity base requires them.
    // We can provide defaults or make stats optional in Entity if many non-combat entities exist.
    super(game, x, y, name, initialStats || { power: 1, memory: 0, firewall: 0, ghz: 0 });
    this.objectType = objectType;
    console.log(`WorldObject "${this.name}" (Type: ${this.objectType}, ID: ${this.id}) created.`);
  }

  // Most WorldObjects might not update every frame unless they have animations or timed effects.
  public update(delta: number): void {
    // Override if needed for animations, effects, etc.
  }

  // Render method needs to be implemented by concrete subclasses.
  public abstract render(renderer: CanvasRenderingContext2D | any): void;

  // Optional interaction methods (if IInteractable is implemented)
  public interact?(interactor: Entity): Promise<any> | any {
    if (!this.isInteractive) {
      console.log(`${this.name} is not interactive.`);
      return;
    }
    console.log(`${interactor.name} interacted with ${this.name}.`);
    // Default interaction logic, to be overridden by subclasses.
  }

  public getInteractionPrompt?(): string {
    if (!this.isInteractive) return "";
    return `Interact with ${this.name}`;
  }

  public canInteract?(interactor: Entity): boolean {
    return this.isInteractive;
  }

  // WorldObjects might not "die" in the same way as creatures.
  // They might be destroyed, depleted, or deactivated.
  protected onDeath(): void {
    super.onDeath(); // Call Entity's onDeath if relevant (e.g. if it has Power stat)
    console.log(`WorldObject "${this.name}" (Type: ${this.objectType}) has been destroyed/deactivated.`);
    // Trigger any specific effects on destruction (e.g., explode, drop items, change map state).
    // this.game.entityManager.removeEntity(this); // Example
  }
}

console.log("WorldObject base class (src/game-client/entities/WorldObject.ts) created.");
