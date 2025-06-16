// src/game-client/entities/GlitchedLoreFragment.ts
import { Item } from './Item';
import type { GameClient } from '../index';

// Placeholder type
type GlitchedLoreData = { 
    itemId: string, 
    name: string, 
    description: string, 
    fragmentId: string, 
    encryptedContent: string,
    rarity?: string,
    decryptionKeyHint?: string // Optional hint for decryption
};

export class GlitchedLoreFragment extends Item {
  public fragmentId: string;
  public encryptedContent: string;
  public decryptedContent: string | null = null;
  public decryptionKeyHint?: string;

  constructor(game: GameClient, x: number, y: number, data: GlitchedLoreData, quantity: number = 1, isWorldItem: boolean = false) {
    super(game, x, y, {
      itemId: data.itemId,
      name: data.name,
      description: data.description,
      type: 'LoreFragment', // Override item type
      rarity: data.rarity || 'Rare',
      properties: { isGlitched: true }
    }, quantity, isWorldItem);
    
    this.fragmentId = data.fragmentId;
    this.encryptedContent = data.encryptedContent;
    this.decryptionKeyHint = data.decryptionKeyHint;

    console.log(`GlitchedLoreFragment "${this.name}" (FragmentID: ${this.fragmentId}) created.`);
  }

  public attemptDecryption(key: string): boolean {
    // Placeholder for decryption logic
    // In a real game, this might involve an API call or complex client-side puzzle
    console.log(`Attempting decryption of ${this.name} with key: ${key}`);
    if (key === "correct_key_placeholder") { // Replace with actual logic
      this.decryptedContent = `Decrypted: ${this.encryptedContent.split('').reverse().join('')}`; // Simple mock decryption
      console.log("Decryption successful!");
      return true;
    }
    console.log("Decryption failed.");
    return false;
  }

  // Override render if these look different in the world
  public render(renderer: CanvasRenderingContext2D | any): void {
    if (!this.isWorldItem) return;

    if (this.sprite) {
      // renderer.drawImage(this.sprite, this.x, this.y, 22, 22); // Example size
    } else {
      renderer.fillStyle = 'magenta'; 
      renderer.beginPath();
      // Simple distorted square shape
      renderer.moveTo(this.x - 10, this.y - 8);
      renderer.lineTo(this.x + 8, this.y - 10);
      renderer.lineTo(this.x + 10, this.y + 8);
      renderer.lineTo(this.x - 8, this.y + 10);
      renderer.closePath();
      renderer.fill();
      renderer.fillStyle = 'white';
      renderer.font = '8px Arial';
      renderer.textAlign = 'center';
      renderer.fillText('?', this.x, this.y + 3);
      renderer.textAlign = 'left';
    }
  }
}

console.log("GlitchedLoreFragment class (src/game-client/entities/GlitchedLoreFragment.ts) created.");
