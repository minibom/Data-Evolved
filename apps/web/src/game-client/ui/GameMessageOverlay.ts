// src/game-client/ui/GameMessageOverlay.ts
// Used for displaying various in-game messages, system announcements, or AI-generated intel.
// This would typically render as an HTML overlay on top of the game canvas for easier text formatting.
// However, the diagram implies it might be a canvas element. I'll sketch a canvas version.

import type { GameClient } from '../index';
// Define GameIntel type, ideally from @packages/common-types
type GameIntel = { title?: string; message: string; source?: string; priority?: 'low' | 'medium' | 'high' }; // Placeholder

interface DisplayMessage {
  id: string;
  text: string;
  type: 'info' | 'warning' | 'intel' | 'system';
  duration: number; // ms
  startTime: number;
  source?: string; // For intel
  title?: string; // For intel
}

export class GameMessageOverlay {
  protected game: GameClient;
  private messages: DisplayMessage[] = [];
  private maxMessages: number = 5; // Max messages on screen at once

  // Styling (for canvas rendering)
  private x: number = 20;
  private y: number = 100; // Start below GhzMeter/other top UI
  private messageHeight: number = 25;
  private messageSpacing: number = 5;
  private font: string = "14px 'Space Grotesk', sans-serif";
  private colors = {
    info: 'rgba(200, 200, 255, 0.9)',
    warning: 'rgba(255, 200, 100, 0.9)',
    intel: 'rgba(150, 255, 150, 0.9)',
    system: 'rgba(220, 220, 220, 0.9)',
    text: '#FFFFFF'
  };

  constructor(game: GameClient) {
    this.game = game;
    console.log("GameMessageOverlay initialized.");
  }

  public displayMessage(message: string, duration: number = 5000, type: DisplayMessage['type'] = 'info'): void {
    const newMessage: DisplayMessage = {
      id: `msg_${Date.now()}`,
      text: message,
      type,
      duration,
      startTime: Date.now(),
    };
    this.addMessageToList(newMessage);
    console.log(`GameMessageOverlay: Displaying ${type} message: "${message}"`);
  }

  public displayIntel(intel: GameIntel): void {
    const newMessage: DisplayMessage = {
      id: `intel_${Date.now()}`,
      text: intel.message,
      type: 'intel',
      duration: 10000, // Intel messages might stay longer
      startTime: Date.now(),
      source: intel.source,
      title: intel.title,
    };
    this.addMessageToList(newMessage);
    console.log(`GameMessageOverlay: Displaying intel from ${intel.source || 'Unknown'}: "${intel.title || intel.message}"`);
  }
  
  private addMessageToList(message: DisplayMessage): void {
    this.messages.unshift(message); // Add to the top of the list
    if (this.messages.length > this.maxMessages) {
      this.messages.length = this.maxMessages; // Keep only the newest ones if limit exceeded
    }
  }

  public update(delta: number): void {
    const currentTime = Date.now();
    this.messages = this.messages.filter(msg => currentTime < msg.startTime + msg.duration);
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (this.messages.length === 0) return;

    renderer.font = this.font;
    renderer.textAlign = 'left';

    this.messages.forEach((msg, index) => {
      const yPos = this.y + index * (this.messageHeight + this.messageSpacing);
      const timeRemaining = (msg.startTime + msg.duration) - Date.now();
      const alpha = Math.min(1, Math.max(0, timeRemaining / msg.duration)); // Fade out

      renderer.globalAlpha = alpha * 0.9; // Apply base opacity too

      renderer.fillStyle = this.colors[msg.type] || this.colors.info;
      renderer.fillRect(this.x, yPos, 300, this.messageHeight); // Example width

      renderer.fillStyle = this.colors.text;
      let displayText = "";
      if (msg.type === 'intel' && msg.title) {
        displayText = `[${msg.source || 'Intel'} | ${msg.title}]: ${msg.text}`;
      } else {
        displayText = `[${msg.type.toUpperCase()}]: ${msg.text}`;
      }
      // Simple text clipping, real solution needs text wrapping
      const maxWidth = 280;
      let clippedText = displayText;
      if(renderer.measureText(displayText).width > maxWidth) {
          while(renderer.measureText(clippedText + "...").width > maxWidth && clippedText.length > 0) {
              clippedText = clippedText.slice(0, -1);
          }
          clippedText += "...";
      }

      renderer.fillText(clippedText, this.x + 10, yPos + this.messageHeight / 2 + 5);
      renderer.globalAlpha = 1.0; // Reset alpha
    });
  }
}

console.log("GameMessageOverlay class (src/game-client/ui/GameMessageOverlay.ts) created.");
