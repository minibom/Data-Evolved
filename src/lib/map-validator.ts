// /src/lib/map-validator.ts
import type { GeneratedMapData } from '@packages/common-types/map'; // Assuming type definition
// import { PathfindingSystem } from '@/game-client/systems/PathfindingSystem'; // For reachability checks (conceptual)
// import tileRules from '@/data/tile_rules.json'; // For tile placement validation

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// This is a placeholder for a more sophisticated map validator.
// In a real scenario, this would involve complex checks.
export async function validateGeneratedMap(mapData: GeneratedMapData): Promise<ValidationResult> {
  const errors: string[] = [];

  // 1. Basic structure checks
  if (!mapData.mapId) errors.push("Map ID is missing.");
  if (!mapData.size || mapData.size.width <= 0 || mapData.size.height <= 0) {
    errors.push("Map size is invalid.");
  }
  if (!mapData.tiles || mapData.tiles.length !== mapData.size.height || mapData.tiles[0]?.length !== mapData.size.width) {
    errors.push("Tile data dimensions do not match map size.");
  }
  if (!mapData.entryPoints || mapData.entryPoints.length === 0) {
    errors.push("Map must have at least one entry point.");
  } else {
    mapData.entryPoints.forEach((ep, index) => {
        if (ep.x < 0 || ep.x >= mapData.size.width || ep.y < 0 || ep.y >= mapData.size.height) {
            errors.push(`Entry point ${index} at (${ep.x}, ${ep.y}) is outside map boundaries.`);
        }
        // Potentially check if entry point tile is walkable
    });
  }


  // 2. Playability checks (conceptual - would require more complex systems)
  //    - Check reachability of key areas or all walkable tiles from entry points.
  //      (This would involve a pathfinding algorithm on the tile data)
  //    - Example:
  //      const pathfinder = new PathfindingSystem();
  //      pathfinder.buildGrid(mapData.tiles.map(row => row.map(tile => tile !== 'wall'))); // Simplified: 'wall' is unwalkable
  //      if (mapData.entities?.some(e => e.type === 'quest_objective_location' && !pathfinder.findPath(mapData.entryPoints[0], {x:e.x, y:e.y}))) {
  //        errors.push("A quest objective location is unreachable.");
  //      }

  // 3. Tile rule adherence (conceptual)
  //    - Iterate through tiles and check against `tile_rules.json`
  //    - Example:
  //      for (let y = 0; y < mapData.size.height; y++) {
  //        for (let x = 0; x < mapData.size.width; x++) {
  //          const tileType = mapData.tiles[y][x];
  //          const rules = tileRules[tileType];
  //          if (rules) { /* Check neighbor tiles against rules */ }
  //        }
  //      }


  // 4. Resource and entity placement checks
  if (mapData.entities) {
    mapData.entities.forEach(entity => {
      if (entity.x < 0 || entity.x >= mapData.size.width || entity.y < 0 || entity.y >= mapData.size.height) {
        errors.push(`Entity ${entity.type} at (${entity.x}, ${entity.y}) is outside map boundaries.`);
      }
      // Check if entity is placed on a walkable tile (conceptual)
    });
  }
  
  // 5. Zone boundary checks
  if (mapData.zoneBoundaries) {
    mapData.zoneBoundaries.forEach(zone => {
        if (zone.minX >= zone.maxX || zone.minY >= zone.maxY) {
            errors.push(`Zone ${zone.zoneId} has invalid boundary dimensions.`);
        }
        // Check if boundaries are within map limits
    });
  }


  console.log(`Map Validation for ${mapData.mapId}: ${errors.length > 0 ? 'Failed' : 'Passed'}. Errors:`, errors);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

console.log("Map Validator (src/lib/map-validator.ts) loaded.");
