// This file is planned for removal. Its contents are superseded by Entity.ts
// src/game-client/entities/BaseObject.ts

// This class will be removed. Use Entity.ts instead.
console.warn("BaseObject.ts is deprecated and will be removed. Use Entity.ts.");

export abstract class BaseObjectDeprecated {
  public id: string;
  constructor() {
    this.id = "deprecated";
  }
  // Add placeholder methods to avoid breaking existing imports if any, before they are updated.
  public update(deltaTime: number): void {}
  public render(renderer: any): void {}
  public destroy(): void {}
}
