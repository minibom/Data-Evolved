// src/game-client/systems/PathfindingSystem.ts
// Implements pathfinding algorithms (e.g., A*) for AI entities.
// This would typically operate on a grid representation of the game world.

// Basic Point interface for pathfinding
interface Point {
  x: number;
  y: number;
}

// Node for A* algorithm
interface AStarNode {
  point: Point;
  gCost: number; // Cost from start to this node
  hCost: number; // Heuristic cost from this node to end
  fCost: number; // gCost + hCost
  parent: AStarNode | null;
}

export class PathfindingSystem {
  private worldGrid: boolean[][] | null = null; // true for walkable, false for obstacle
  private gridWidth: number = 0;
  private gridHeight: number = 0;
  private tileWidth: number = 32; // Example tile size
  private tileHeight: number = 32;

  constructor(/* worldData: any , tileWidth: number, tileHeight: number */) {
    // Initialize with world data to build the grid
    // e.g., from a tilemap's collision layer
    // this.tileWidth = tileWidth;
    // this.tileHeight = tileHeight;
    // this.buildGrid(worldData);
    console.log("PathfindingSystem initialized. (Grid needs to be built with world data)");
  }

  // Example: Build grid from a simple 2D array where 0 is walkable, 1 is obstacle
  public buildGrid(tilemapData: number[][]): void {
    this.gridHeight = tilemapData.length;
    this.gridWidth = tilemapData[0]?.length || 0;
    this.worldGrid = tilemapData.map(row => row.map(tile => tile === 0)); // 0 is walkable
    console.log(`Pathfinding grid built: ${this.gridWidth}x${this.gridHeight}`);
  }
  
  private worldToGrid(worldX: number, worldY: number): Point {
    return { x: Math.floor(worldX / this.tileWidth), y: Math.floor(worldY / this.tileHeight) };
  }

  private gridToWorld(gridX: number, gridY: number): Point {
    return { x: gridX * this.tileWidth + this.tileWidth / 2, y: gridY * this.tileHeight + this.tileHeight / 2 };
  }


  // Basic A* pathfinding implementation (simplified)
  public findPath(startWorld: Point, endWorld: Point): Point[] | null {
    if (!this.worldGrid) {
        console.warn("Pathfinding grid not initialized.");
        return null;
    }
    
    const startGrid = this.worldToGrid(startWorld.x, startWorld.y);
    const endGrid = this.worldToGrid(endWorld.x, endWorld.y);

    const openSet: AStarNode[] = [];
    const closedSet: Set<string> = new Set(); // Store "x,y" strings

    const startNode: AStarNode = { point: startGrid, gCost: 0, hCost: this.heuristic(startGrid, endGrid), fCost: 0, parent: null };
    startNode.fCost = startNode.gCost + startNode.hCost;
    openSet.push(startNode);

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.fCost - b.fCost || a.hCost - b.hCost); // Sort by fCost, then hCost
      const currentNode = openSet.shift()!; // Get node with lowest fCost

      if (currentNode.point.x === endGrid.x && currentNode.point.y === endGrid.y) {
        return this.reconstructPath(currentNode).map(p => this.gridToWorld(p.x, p.y)); // Path found
      }

      closedSet.add(`${currentNode.point.x},${currentNode.point.y}`);

      for (const neighborPoint of this.getNeighbors(currentNode.point)) {
        if (closedSet.has(`${neighborPoint.x},${neighborPoint.y}`) || !this.isWalkable(neighborPoint.x, neighborPoint.y)) {
          continue;
        }

        const gCostToNeighbor = currentNode.gCost + 1; // Assuming cost of 1 to move to neighbor
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
    return null; // No path found
  }

  private heuristic(a: Point, b: Point): number {
    // Manhattan distance heuristic
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  private getNeighbors(point: Point): Point[] {
    const neighbors: Point[] = [];
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // N, E, S, W (Can add diagonals)
    for (const [dx, dy] of directions) {
      const nx = point.x + dx;
      const ny = point.y + dy;
      if (nx >= 0 && nx < this.gridWidth && ny >= 0 && ny < this.gridHeight) {
        neighbors.push({ x: nx, y: ny });
      }
    }
    return neighbors;
  }
  
  private isWalkable(x: number, y: number): boolean {
    if (!this.worldGrid || x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) {
        return false;
    }
    return this.worldGrid[y][x];
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

console.log("PathfindingSystem class (src/game-client/systems/PathfindingSystem.ts) loaded.");
