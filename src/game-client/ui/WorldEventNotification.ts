// src/game-client/ui/WorldEventNotification.ts
// Displays temporary notifications for global world events on the game canvas.

interface NotificationMessage {
  id: string;
  title: string;
  message: string;
  duration: number; // ms
  startTime: number; // ms (timestamp)
  icon?: string; // Optional icon name (e.g., from Lucide)
}

export class WorldEventNotification {
  private activeNotifications: NotificationMessage[] = [];
  private maxDisplay: number = 3; // Max notifications shown at once
  
  // Styling (configurable)
  private boxWidth: number = 300;
  private boxHeightPerMessage: number = 60;
  private padding: number = 10;
  private xPosition: number; // e.g., canvas.width - boxWidth - 20
  private yPosition: number = 20; // From top
  private font: string = "14px 'Space Grotesk', sans-serif";
  private titleFont: string = "bold 16px 'Space Grotesk', sans-serif";
  privatetextColor: string = "#FFFFFF";
  private boxColor: string = "rgba(100, 100, 150, 0.85)"; // Muted purple, semi-transparent
  private borderColor: string = "#C0C0FF"; // Light purple


  constructor(canvasWidth: number) {
    this.xPosition = canvasWidth - this.boxWidth - 20;
    console.log("WorldEventNotification (Canvas-based) initialized.");
  }

  public addNotification(title: string, message: string, duration: number = 5000, icon?: string): void {
    const newNotification: NotificationMessage = {
      id: `notif_${Date.now()}`,
      title,
      message,
      duration,
      startTime: Date.now(),
      icon,
    };
    this.activeNotifications.unshift(newNotification); // Add to front
    if (this.activeNotifications.length > this.maxDisplay + 2) { // Keep a small buffer
        this.activeNotifications.splice(this.maxDisplay + 2);
    }
    console.log("New world event notification added:", title);
  }

  public update(currentTime: number): void {
    // Remove expired notifications
    this.activeNotifications = this.activeNotifications.filter(
      notif => currentTime < notif.startTime + notif.duration
    );
  }

  public render(renderer: CanvasRenderingContext2D | any): void {
    if (this.activeNotifications.length === 0) return;

    const displayCount = Math.min(this.activeNotifications.length, this.maxDisplay);

    for (let i = 0; i < displayCount; i++) {
      const notif = this.activeNotifications[i];
      const currentY = this.yPosition + (i * (this.boxHeightPerMessage + this.padding));
      const timeRemaining = (notif.startTime + notif.duration) - Date.now();
      const alpha = Math.min(1, Math.max(0.2, timeRemaining / notif.duration)); // Fade out effect


      renderer.save();
      renderer.globalAlpha = alpha;

      // Draw notification box
      renderer.fillStyle = this.boxColor;
      renderer.strokeStyle = this.borderColor;
      renderer.lineWidth = 1;
      renderer.fillRect(this.xPosition, currentY, this.boxWidth, this.boxHeightPerMessage);
      renderer.strokeRect(this.xPosition, currentY, this.boxWidth, this.boxHeightPerMessage);
      
      let textX = this.xPosition + this.padding;
      // Optional: Render icon here if provided
      // if (notif.icon) { /* renderer.drawIcon(...) */ textX += ICON_WIDTH + PADDING; }


      // Draw Title
      renderer.font = this.titleFont;
      renderer.fillStyle = this.textColor;
      renderer.fillText(notif.title, textX, currentY + this.padding + 14, this.boxWidth - (this.padding*2));

      // Draw Message
      renderer.font = this.font;
      this.wrapText(renderer, notif.message, textX, currentY + this.padding + 34, this.boxWidth - (this.padding*2) - (notif.icon ? 20 : 0), 16, 2); // Max 2 lines for message

      renderer.restore();
    }
  }
  
  private wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number): void {
    const words = text.split(' ');
    let line = '';
    let linesDrawn = 0;
    for (let n = 0; n < words.length; n++) {
      if (linesDrawn >= maxLines) break;
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
        linesDrawn++;
      } else {
        line = testLine;
      }
    }
    if (linesDrawn < maxLines) {
      context.fillText(line, x, y);
    } else if (linesDrawn === maxLines && line.trim() !== '') {
        // If max lines reached but still text, add ellipsis to last drawn line
        // This is tricky to do perfectly without re-drawing previous line. For simplicity, we might just cut off.
    }
  }
}

console.log("WorldEventNotification class (src/game-client/ui/WorldEventNotification.ts) loaded.");
