// src/game-client/systems/PathfindingSystem.ts
import { BaseSystem } from './BaseSystem';
import type { GameClient } from '../index';
// Define TileMap and Point types, ideally from @packages/common-types
// For now, using local simple interfaces
interface Point { x: number; y: number; }
interface TileMap { 
    tiles: { isWalkable: boolean }[][]; // Simplified tile structure for pathfinding
    width: number; 
    height: number;
    tileWidth: number;
    tileHeight: number;
}

interface AStarNode {
  point: Point; // Grid coordinates
  gCost: number;
  hCost: number;
  fCost: number;
  parent: AStarNode | null;
}

export class PathfindingSystem extends BaseSystem {
  private currentMap: TileMap | null = null;

  constructor(game: GameClient) {
    super(game);
  }

  public init(): void {
    super.init();
    // Could load map data or receive it from MapManager
    // this.currentMap = this.game.getMapManager().getCurrentMapDataForPathfinding();
  }
  
  public setCurrentMap(map: TileMap): void {
      this.currentMap = map;
      console.log("PathfindingSystem: Map data set for pathfinding.");
  }

  public update(delta: number): void {
    // Pathfinding is usually on-demand, not per-frame update for all entities
  }

  public findPath(startWorld: Point, endWorld: Point): Point[] | null {
    if (!this.currentMap) {
        console.warn("PathfindingSystem: No map data loaded to find path.");
        return null;
    }
    
    const startGrid = this.worldToGrid(startWorld.x, startWorld.y);
    const endGrid = this.worldToGrid(endWorld.x, endWorld.y);

    if (!startGrid || !endGrid) {
        console.warn("PathfindingSystem: Start or end point is outside of map bounds.");
        return null;
    }

    const openSet: AStarNode[] = [];
    const closedSet: Set<string> = new Set();

    const startNode: AStarNode = { point: startGrid, gCost: 0, hCost: this.heuristic(startGrid, endGrid), fCost: 0, parent: null };
    startNode.fCost = startNode.gCost + startNode.hCost;
    openSet.push(startNode);

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.fCost - b.fCost || a.hCost - b.hCost);
      const currentNode = openSet.shift()!;

      if (currentNode.point.x === endGrid.x && currentNode.point.y === endGrid.y) {
        return this.reconstructPath(currentNode).map(p => this.gridToWorld(p.x, p.y));
      }

      closedSet.add(`${currentNode.point.x},${currentNode.point.y}`);

      for (const neighborPoint of this.getNeighbors(currentNode.point)) {
        if (closedSet.has(`${neighborPoint.x},${neighborPoint.y}`) || !this.isWalkable(neighborPoint.x, neighborPoint.y)) {
          continue;
        }

        const gCostToNeighbor = currentNode.gCost + 1; // Cost of 1 per step
        let neighborNode = openSet.find(n => n.point.x === neighborPoint.x && n.point.y === neighborPoint.y);

        if (!neighborNode || gCostToNeighbor < neighborNode.gCost) {
          if (!neighborNode) {
            neighborNode = { point: neighborPoint, gCost: gCostToNeighbor, hCost: this.heuristic(neighborPoint, endGrid), fCost: 0, parent: currentNode };
            neighborNode.fCost = neighborNode.gCost + neighborNode.hCost;
            openSet.push(neighborNode);
          } else {
            neighborNode.parent = currentNode;
            neighborNode.gCost = gCostToNeighbor;
            neighborNode.fCost = neighborNode.gCost + neighborNode.hCost;
          }
        }
      }
    }
    console.log(`PathfindingSystem: No path found from (${startWorld.x},${startWorld.y}) to (${endWorld.x},${endWorld.y}).`);
    return null;
  }
  
  private worldToGrid(worldX: number, worldY: number): Point | null {
    if (!this.currentMap) return null;
    const gridX = Math.floor(worldX / this.currentMap.tileWidth);
    const gridY = Math.floor(worldY / this.currentMap.tileHeight);
    if (gridX < 0 || gridX >= this.currentMap.width || gridY < 0 || gridY >= this.currentMap.height) {
        return null; // Outside map bounds
    }
    return { x: gridX, y: gridY };
  }

  private gridToWorld(gridX: number, gridY: number): Point {
    if (!this.currentMap) return { x: 0, y: 0 }; // Should not happen if path is found
    return { 
        x: gridX * this.currentMap.tileWidth + this.currentMap.tileWidth / 2, 
        y: gridY * this.currentMap.tileHeight + this.currentMap.tileHeight / 2 
    };
  }

  private heuristic(a: Point, b: Point): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // Manhattan distance
  }

  private getNeighbors(point: Point): Point[] {
    if (!this.currentMap) return [];
    const neighbors: Point[] = [];
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // N, E, S, W
    for (const [dx, dy] of directions) {
      const nx = point.x + dx;
      const ny = point.y + dy;
      if (nx >= 0 && nx < this.currentMap.width && ny >= 0 && ny < this.currentMap.height) {
        neighbors.push({ x: nx, y: ny });
      }
    }
    return neighbors;
  }

  private isWalkable(gridX: number, gridY: number): boolean {
    if (!this.currentMap || gridX < 0 || gridX >= this.currentMap.width || gridY < 0 || gridY >= this.currentMap.height) {
      return false;
    }
    return this.currentMap.tiles[gridY][gridX].isWalkable;
  }

  private reconstructPath(endNode: AStarNode): Point[] {
    const path: Point[] = [];
    let currentNode: AStarNode | null = endNode;
    while (currentNode) {
      path.unshift(currentNode.point);
      currentNode = currentNode.parent;
    }
    return path;
  }
}

console.log("PathfindingSystem class (src/game-client/systems/PathfindingSystem.ts) updated.");
