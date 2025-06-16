// src/game-client/entities/CodeFragment.ts
import { Item } from './Item';
import type { GameClient } from '../index';

// Placeholder type
type CodeFragmentData = { 
    itemId: string, 
    name: string, 
    description: string, 
    fragmentId: string, 
    type: 'function' | 'variable' | string, // Allow string for flexibility
    content: string,
    rarity?: string
};

export class CodeFragment extends Item {
  public fragmentId: string;
  public codeFragmentType: 'function' | 'variable' | string;
  public content: string; // The actual code snippet

  constructor(game: GameClient, x: number, y: number, data: CodeFragmentData, quantity: number = 1, isWorldItem: boolean = false) {
    super(game, x, y, {
      itemId: data.itemId,
      name: data.name,
      description: data.description,
      type: 'CodeFragment', // Override item type
      rarity: data.rarity || 'Uncommon',
      // CodeFragments might not have typical item properties or code injection slots themselves
      properties: {}, 
      codeInjectionSlots: []
    }, quantity, isWorldItem);
    
    this.fragmentId = data.fragmentId;
    this.codeFragmentType = data.type;
    this.content = data.content;

    console.log(`CodeFragment "${this.name}" (FragmentID: ${this.fragmentId}, Type: ${this.codeFragmentType}) created.`);
  }

  // Override render if CodeFragments look different in the world
  public render(renderer: CanvasRenderingContext2D | any): void {
    if (!this.isWorldItem) return;

    if (this.sprite) {
      // renderer.drawImage(this.sprite, this.x, this.y, 20, 20); // Example size
    } else {
      renderer.fillStyle = 'lightgreen'; 
      renderer.beginPath();
      // Simple diamond shape for code fragments
      renderer.moveTo(this.x, this.y - 10);
      renderer.lineTo(this.x + 10, this.y);
      renderer.lineTo(this.x, this.y + 10);
      renderer.lineTo(this.x - 10, this.y);
      renderer.closePath();
      renderer.fill();
      renderer.fillStyle = 'black';
      renderer.font = '8px Arial';
      renderer.textAlign = 'center';
      renderer.fillText('</>', this.x, this.y + 3);
      renderer.textAlign = 'left';
    }
  }
}

console.log("CodeFragment class (src/game-client/entities/CodeFragment.ts) created.");
