// src/game-client/systems/LootSystem.ts
/**
 * The LootSystem is responsible for determining and distributing loot
 * when an entity (typically an EnemyAI or WorldBoss) is defeated.
 * It subscribes to `EntityDiedEvent` (or similar) from the EventManager.
 */

import type { GameClient } from '../index';
import type { Entity } from '../entities/Entity';
// import type { InventorySystem } from './InventorySystem'; // To add items to player inventory
// import type { ItemData } from '@packages/common-types/game'; // For item definitions
// import enemiesData from '@/data/enemies.json'; // Static enemy loot tables
// import bossesData from '@/data/bosses.json'; // Static boss loot tables

interface LootTableEntry {
  itemId: string;
  chance: number; // 0.0 to 1.0
  quantityMin: number;
  quantityMax: number;
  isUnique?: boolean; // If true, only drops once or for specific conditions
}

export class LootSystem /* extends BaseSystem */ { // Assuming BaseSystem provides access to game instance
  private game: GameClient;
  // private inventorySystem: InventorySystem;

  constructor(game: GameClient) {
    // super(game); // If extending BaseSystem
    this.game = game;
    // this.inventorySystem = game.getSystem(InventorySystem);
    // this.game.eventManager.subscribe('ENTITY_DIED_EVENT', this.handleEntityDeath.bind(this));
    console.log("LootSystem initialized and subscribed to entity death events.");
  }

  /**
   * Handles the event when an entity dies, potentially dropping loot.
   * @param event The game event containing data about the killed entity.
   */
  private handleEntityDeath(event: any /* EntityDiedEvent */): void {
    const killedEntity = event.data.entity as Entity; // Assuming event data structure
    const killerEntity = event.data.killer as Entity; // Player or another AI

    if (!killedEntity || !(killedEntity /* instanceof EnemyAI || killedEntity instanceof WorldBoss */)) {
      return; // Only process loot for specific enemy types
    }

    console.log(`LootSystem: Processing death of ${killedEntity.name} (ID: ${killedEntity.id}).`);

    const lootTable = this.getLootTableForEntity(killedEntity);
    if (!lootTable || lootTable.length === 0) {
      console.log(`No loot table defined for ${killedEntity.name}.`);
      return;
    }

    const droppedItems: { itemId: string, quantity: number }[] = [];
    lootTable.forEach(entry => {
      if (Math.random() < entry.chance) {
        const quantity = Math.floor(Math.random() * (entry.quantityMax - entry.quantityMin + 1)) + entry.quantityMin;
        droppedItems.push({ itemId: entry.itemId, quantity });
      }
    });

    if (droppedItems.length > 0) {
      console.log(`Dropped loot for ${killedEntity.name}:`, droppedItems);
      // Distribute loot:
      // - If killed by a player, add to their inventory or create world items.
      // - If a boss with shared loot, handle distribution logic.
      if (killerEntity /* && killerEntity instanceof Player */) {
        droppedItems.forEach(item => {
          // this.inventorySystem.addItem(killerEntity.id, item.itemId, item.quantity);
          console.log(`Mock: Added ${item.quantity}x ${item.itemId} to ${killerEntity.name}'s inventory.`);
          // Alternatively, spawn WorldItem entities at killedEntity's position
          // new WorldItem(this.game, killedEntity.x, killedEntity.y, itemDefinition, item.quantity);
        });
      } else {
        // Handle loot drops if not killed by a player (e.g., spawn as world items)
        console.log("Loot dropped on ground (conceptual).");
      }
    } else {
      console.log(`${killedEntity.name} dropped no loot this time.`);
    }
  }

  /**
   * Retrieves the loot table for a given entity.
   * This would typically fetch from pre-defined data (e.g., enemies.json, bosses.json).
   * @param entity The entity for which to get the loot table.
   */
  private getLootTableForEntity(entity: Entity): LootTableEntry[] | null {
    // Example:
    // if (entity instanceof WorldBoss) {
    //   const bossData = bossesData.find(b => b.id === (entity as any).bossDataId);
    //   return bossData?.lootTable || null;
    // } else if (entity instanceof EnemyAI) {
    //   const enemyData = enemiesData.find(e => e.id === (entity as any).enemyType);
    //   return enemyData?.lootTable || null;
    // }
    // Mock implementation:
    if (entity.name.toLowerCase().includes("boss")) {
        return [{ itemId: "epic_core_fragment", chance: 0.5, quantityMin: 1, quantityMax: 1 }];
    } else if (entity.name.toLowerCase().includes("drone")) {
        return [{ itemId: "data_scrap_common", chance: 0.8, quantityMin: 1, quantityMax: 3 }];
    }
    return null;
  }

  public destroy(): void {
    // this.game.eventManager.unsubscribe('ENTITY_DIED_EVENT', this.handleEntityDeath.bind(this));
    console.log("LootSystem destroyed and unsubscribed from events.");
  }
}

console.log("LootSystem class (src/game-client/systems/LootSystem.ts) created.");
