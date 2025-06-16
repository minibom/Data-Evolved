// src/game-client/ui/DialogueRenderer.ts
// Renders dialogue text and options on the game canvas.
// This is an alternative to using HTML-based DialogueBox component if dialogue needs to be part of the canvas.

interface DialogueLine {
  speaker?: string;
  text: string;
}

interface DialogueOption {
  text: string;
  id: string; // For selection
}

export class DialogueRenderer {
  private currentDialogue: DialogueLine | null = null;
  private currentOptions: DialogueOption[] = [];
  private isVisible: boolean = false;

  // Styling (configurable)
  private boxX: number = 50;
  private boxY: number = 450; // Position at bottom of canvas (assuming 600px height)
  private boxWidth: number = 700; // Assuming 800px width canvas
  private boxHeight: number = 100;
  private padding: number = 15;
  private font: string = "16px 'Space Grotesk', sans-serif";
  private speakerFont: string = "bold 18px 'Space Grotesk', sans-serif";
  private optionFont: string = "14px 'Space Grotesk', sans-serif";
  privatetextColor: string = "#FFFFFF";
  private speakerColor: string = "#87CEEB"; // Light Sky Blue
  private boxColor: string = "rgba(0, 0, 50, 0.8)"; // Dark blue, semi-transparent
  private borderColor: string = "#4682B4"; // Steel Blue

  constructor(canvasWidth: number = 800, canvasHeight: number = 600) {
    this.boxWidth = canvasWidth * 0.8;
    this.boxHeight = canvasHeight * 0.2;
    this.boxX = (canvasWidth - this.boxWidth) / 2;
    this.boxY = canvasHeight - this.boxHeight - 20; // 20px from bottom
    console.log("DialogueRenderer (Canvas-based) initialized.");
  }

  public showDialogue(line: DialogueLine, options?: DialogueOption[]): void {
    this.currentDialogue = line;
    this.currentOptions = options || [];
    this.isVisible = true;
    console.log("Showing dialogue on canvas:", line.text);
  }

  public hideDialogue(): void {
    this.isVisible = false;
    this.currentDialogue = null;
    this.currentOptions = [];
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (!this.isVisible || !this.currentDialogue) return;

    // Draw dialogue box background
    renderer.fillStyle = this.boxColor;
    renderer.strokeStyle = this.borderColor;
    renderer.lineWidth = 2;
    renderer.fillRect(this.boxX, this.boxY, this.boxWidth, this.boxHeight);
    renderer.strokeRect(this.boxX, this.boxY, this.boxWidth, this.boxHeight);

    let currentY = this.boxY + this.padding;

    // Draw speaker name
    if (this.currentDialogue.speaker) {
      renderer.font = this.speakerFont;
      renderer.fillStyle = this.speakerColor;
      renderer.fillText(this.currentDialogue.speaker + ":", this.boxX + this.padding, currentY);
      currentY += 25; // Line height for speaker
    }

    // Draw dialogue text (with simple word wrap)
    renderer.font = this.font;
    renderer.fillStyle = this.textColor;
    this.wrapText(renderer, this.currentDialogue.text, this.boxX + this.padding, currentY, this.boxWidth - (this.padding * 2), 20);

    // Draw options (if any) - very basic layout
    if (this.currentOptions.length > 0) {
      currentY = this.boxY + this.boxHeight - this.padding - (this.currentOptions.length * 20); // Position options at bottom
      renderer.font = this.optionFont;
      this.currentOptions.forEach((option, index) => {
        // Highlight selected option based on mouse position or keyboard (not implemented here)
        renderer.fillText(`${index + 1}. ${option.text}`, this.boxX + this.padding + 10, currentY + (index * 20));
      });
    }
  }

  // Simple text wrapping function
  private wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): void {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
  }
  
  // Method to handle click/selection on canvas dialogue options (needs input manager integration)
  // public handleOptionClick(mouseX: number, mouseY: number): string | null { /* ... */ return null; }
}

console.log("DialogueRenderer class (src/game-client/ui/DialogueRenderer.ts) loaded.");
