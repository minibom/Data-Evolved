// This file is planned for removal. Its contents are superseded by Entity.ts
// src/game-client/entities/BaseObject.ts

// This class will be removed. Use Entity.ts instead.
console.warn("BaseObject.ts is deprecated and will be removed. Use Entity.ts.");

export abstract class BaseObjectDeprecated {
  public id: string;
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  // protected gameClient: any; // GameClient type was used here
  public type: string = "BaseObjectDeprecated";

  constructor(gameClient: any, x: number, y: number, width: number = 32, height: number = 32) {
    this.id = `obj_dep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    // this.gameClient = gameClient;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  public update(deltaTime: number): void {}
  public render(renderer: any): void {}
  public destroy(): void {}
}
