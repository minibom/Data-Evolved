// src/game-client/entities/Item.ts
import { Entity } from './Entity';
import type { GameClient } from '../index';

// Placeholder types - should come from @packages/common-types
type ItemType = 'DataScrap' | 'Consumable' | 'Equipment' | 'QuestItem' | 'Material' | 'CodeFragment' | 'LoreFragment' | string;
type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | string;
type ItemProperties = any; // e.g., { damage?: number, defense?: number, effect?: string }
type CodeInjectionSlot = any; // e.g., { type: 'offensive' | 'utility', capacity: number }
type ItemData = { 
    itemId: string, 
    name: string, 
    description: string, 
    type: ItemType, 
    rarity?: Rarity, 
    properties?: ItemProperties,
    codeInjectionSlots?: CodeInjectionSlot[],
    initialStats?: any, // For Entity base class
    icon?: string // Icon name for rendering
};


export class Item extends Entity {
  public itemId: string; // Corresponds to id in items.json
  public itemType: ItemType;
  public rarity: Rarity;
  public properties: ItemProperties;
  public codeInjectionSlots: CodeInjectionSlot[];
  public description: string;
  public iconName?: string; // For rendering

  // For world items / stacks
  public quantity: number = 1; 
  public isWorldItem: boolean = false; // Is it an item instance dropped in the world?

  constructor(game: GameClient, x: number, y: number, data: ItemData, quantity: number = 1, isWorldItem: boolean = false) {
    // Items as entities in the world might not have combat stats like power/memory, 
    // but Entity base class requires them. We can use defaults or make them optional in Entity if many non-combat entities exist.
    // For now, passing minimal stats.
    super(game, x, y, data.name, data.initialStats || { power: 1, memory: 0, firewall: 0, ghz: 0 });
    
    this.itemId = data.itemId;
    this.description = data.description;
    this.itemType = data.type;
    this.rarity = data.rarity || 'Common';
    this.properties = data.properties || {};
    this.codeInjectionSlots = data.codeInjectionSlots || [];
    this.iconName = data.icon;

    this.quantity = quantity;
    this.isWorldItem = isWorldItem;

    if(this.isWorldItem) {
        console.log(`World Item "${this.name}" (ID: ${this.id}, ItemID: ${this.itemId}, Qty: ${this.quantity}) created at (${x}, ${y}).`);
    }
  }

  public update(delta: number): void {
    // If it's a world item, it might have some animation or despawn logic
    if (!this.isWorldItem) return; // Inventory items don't need world updates
    // Example: bobbing animation
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (!this.isWorldItem) return; // Inventory items are rendered by UI, not as world entities

    if (this.sprite) {
      // renderer.drawImage(this.sprite, this.x, this.y, 24, 24); // Assuming width/height are set for world items
    } else {
      // Fallback rendering for world items
      renderer.fillStyle = this.rarity === 'Rare' ? 'gold' : this.rarity === 'Epic' ? 'purple' : 'grey';
      renderer.beginPath();
      renderer.arc(this.x, this.y, 12, 0, Math.PI * 2); // Example size
      renderer.fill();
      if (this.iconName) {
        renderer.fillStyle = 'black';
        renderer.font = '8px Arial';
        renderer.textAlign = 'center';
        renderer.fillText(this.iconName.substring(0,1).toUpperCase(), this.x, this.y + 3);
        renderer.textAlign = 'left';
      }
    }
  }
  
  public onPickup(pickerEntity: Entity): void {
    if (!this.isWorldItem) return;
    console.log(`Item "${this.name}" (ItemID: ${this.itemId}) picked up by ${pickerEntity.name}.`);
    // Logic to add to pickerEntity's inventory via InventorySystem
    // this.game.getSystem(InventorySystem).addItemToPlayer(pickerEntity.id, this);
    this.destroy(); // Remove from world
  }
  
  // Items themselves don't "die" from damage like creatures
  protected onDeath(): void {
      if (this.isWorldItem) {
          console.log(`World item ${this.name} (ItemID: ${this.itemId}) despawned or destroyed.`);
          // this.game.entityManager.removeEntity(this);
      }
  }
}

console.log("Item class (src/game-client/entities/Item.ts) updated to inherit from Entity.");
