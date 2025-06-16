// /src/lib/map-validator.ts
import type { GeneratedMapData, Tile } from '@packages/common-types/map';
// import { PathfindingSystem } from '@/game-client/systems/PathfindingSystem'; // For reachability checks (conceptual)
// import tileRulesData from '@/data/tile_rules.json'; // For tile placement validation
// const tileRules: Record<string, { allowAdjacent?: string[], properties?: any }> = tileRulesData.tileTypes;


interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export async function validateGeneratedMap(mapData: GeneratedMapData): Promise<ValidationResult> {
  const errors: string[] = [];

  // 1. Basic structure checks
  if (!mapData.mapId) errors.push("Map ID is missing.");
  if (!mapData.size || mapData.size.width <= 0 || mapData.size.height <= 0) {
    errors.push("Map size is invalid.");
  }
  if (!mapData.tiles || mapData.tiles.length !== mapData.size.height) {
    errors.push(`Tile data has incorrect number of rows. Expected ${mapData.size.height}, got ${mapData.tiles.length}.`);
  } else {
    mapData.tiles.forEach((row, rowIndex) => {
        if (row.length !== mapData.size.width) {
            errors.push(`Row ${rowIndex} in tile data has incorrect number of columns. Expected ${mapData.size.width}, got ${row.length}.`);
        }
        row.forEach((tile: Tile, colIndex: number) => {
            if (!tile || typeof tile.type !== 'string' || typeof tile.isWalkable !== 'boolean' || typeof tile.isTransparent !== 'boolean') {
                errors.push(`Invalid tile structure at [${rowIndex}, ${colIndex}]. Found: ${JSON.stringify(tile)}`);
            }
        });
    });
  }

  if (!mapData.entryPoints || mapData.entryPoints.length === 0) {
    errors.push("Map must have at least one entry point.");
  } else {
    mapData.entryPoints.forEach((ep, index) => {
        if (ep.x < 0 || ep.x >= mapData.size.width || ep.y < 0 || ep.y >= mapData.size.height) {
            errors.push(`Entry point ${index} ('${ep.name}') at (${ep.x}, ${ep.y}) is outside map boundaries (0-${mapData.size.width-1}, 0-${mapData.size.height-1}).`);
        }
        // TODO: Potentially check if entry point tile is walkable using mapData.tiles[ep.y][ep.x].isWalkable
    });
  }


  // 2. Playability checks (conceptual - would require more complex systems)
  //    - Check reachability of key areas or all walkable tiles from entry points.
  //      (This would involve a pathfinding algorithm on the tile data)
  //    - Example:
  //      const pathfinder = new PathfindingSystem(); // Needs to be adapted for server-side use or mock
  //      const gridForPathfinding = mapData.tiles.map(row => row.map(tile => tile.isWalkable));
  //      pathfinder.buildGrid(gridForPathfinding); // Hypothetical grid building
  //      if (mapData.entities?.some(e => e.type === 'quest_objective_location' && !pathfinder.findPath(mapData.entryPoints[0], {x:e.x, y:e.y}))) {
  //        errors.push("A quest objective location is unreachable.");
  //      }

  // 3. Tile rule adherence (conceptual)
  //    - Iterate through tiles and check against `tile_rules.json`
  //    - Example:
  //      for (let y = 0; y < mapData.size.height; y++) {
  //        for (let x = 0; x < mapData.size.width; x++) {
  //          const tileType = mapData.tiles[y][x].type;
  //          const rulesForTile = tileRules[tileType];
  //          if (rulesForTile && rulesForTile.allowAdjacent) { /* Check neighbor tiles against rulesForTile.allowAdjacent */ }
  //        }
  //      }


  // 4. Resource and entity placement checks
  if (mapData.entities) {
    mapData.entities.forEach(entity => {
      if (entity.x < 0 || entity.x >= mapData.size.width || entity.y < 0 || entity.y >= mapData.size.height) {
        errors.push(`Entity type '${entity.type}' (ID: ${entity.id || 'N/A'}) at (${entity.x}, ${entity.y}) is outside map boundaries.`);
      }
      // TODO: Check if entity is placed on a walkable tile (mapData.tiles[entity.y][entity.x].isWalkable)
    });
  }
  
  // 5. Zone boundary checks
  if (mapData.zones) {
    mapData.zones.forEach(zone => {
        if (zone.minX >= zone.maxX || zone.minY >= zone.maxY) {
            errors.push(`Zone '${zone.zoneId}' (${zone.name}) has invalid boundary dimensions (min >= max).`);
        }
        if (zone.maxX > mapData.size.width || zone.maxY > mapData.size.height || zone.minX < 0 || zone.minY < 0) {
            errors.push(`Zone '${zone.zoneId}' (${zone.name}) boundaries extend outside map dimensions.`);
        }
    });
  }


  console.log(`Map Validation for ${mapData.mapId}: ${errors.length > 0 ? 'Failed' : 'Passed'}. Errors:`, errors);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

console.log("Map Validator (src/lib/map-validator.ts) loaded and updated.");
