// src/game-client/core/InputManager.ts

type KeyState = 'up' | 'down' | 'pressed' | 'released';

export class InputManager {
  private keyStates: Map<string, KeyState> = new Map();
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private mouseButtonStates: Map<number, KeyState> = new Map(); // 0: left, 1: middle, 2: right
  private canvas: HTMLCanvasElement | null = null;

  constructor(canvas?: HTMLCanvasElement) {
    if (canvas) this.attachToCanvas(canvas);
    this.setupListeners();
    console.log("InputManager initialized.");
  }

  attachToCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    // Ensure canvas can receive focus for keyboard events
    if (!this.canvas.hasAttribute('tabindex')) {
        this.canvas.setAttribute('tabindex', '0'); 
    }
  }

  private setupListeners(): void {
    // Keyboard events
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));

    // Mouse events (relative to canvas if attached, otherwise window)
    const eventTarget = this.canvas || window;
    eventTarget.addEventListener('mousemove', this.handleMouseMove.bind(this) as EventListener);
    eventTarget.addEventListener('mousedown', this.handleMouseDown.bind(this) as EventListener);
    eventTarget.addEventListener('mouseup', this.handleMouseUp.bind(this) as EventListener);
    // Consider 'contextmenu' to prevent right-click menu if using right mouse button
    if (this.canvas) {
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (this.keyStates.get(event.code) !== 'down') {
      this.keyStates.set(event.code, 'pressed');
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keyStates.set(event.code, 'released');
  }

  private handleMouseMove(event: MouseEvent): void {
    if (this.canvas) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePosition.x = event.clientX - rect.left;
        this.mousePosition.y = event.clientY - rect.top;
    } else {
        this.mousePosition.x = event.clientX;
        this.mousePosition.y = event.clientY;
    }
  }

  private handleMouseDown(event: MouseEvent): void {
     if (this.mouseButtonStates.get(event.button) !== 'down') {
      this.mouseButtonStates.set(event.button, 'pressed');
    }
  }

  private handleMouseUp(event: MouseEvent): void {
    this.mouseButtonStates.set(event.button, 'released');
  }

  // Call this at the beginning of each game update cycle
  update(): void {
    this.keyStates.forEach((state, key) => {
      if (state === 'pressed') this.keyStates.set(key, 'down');
      if (state === 'released') this.keyStates.set(key, 'up');
    });
    this.mouseButtonStates.forEach((state, button) => {
      if (state === 'pressed') this.mouseButtonStates.set(button, 'down');
      if (state === 'released') this.mouseButtonStates.set(button, 'up');
    });
  }

  isKeyDown(keyCode: string): boolean {
    return this.keyStates.get(keyCode) === 'down' || this.keyStates.get(keyCode) === 'pressed';
  }

  isKeyPressed(keyCode: string): boolean {
    return this.keyStates.get(keyCode) === 'pressed';
  }

  isKeyReleased(keyCode: string): boolean {
    return this.keyStates.get(keyCode) === 'released';
  }

  getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition };
  }

  isMouseButtonDown(button: number): boolean {
    return this.mouseButtonStates.get(button) === 'down' || this.mouseButtonStates.get(button) === 'pressed';
  }

  isMouseButtonPressed(button: number): boolean {
    return this.mouseButtonStates.get(button) === 'pressed';
  }
  
  isMouseButtonReleased(button: number): boolean {
    return this.mouseButtonStates.get(button) === 'released';
  }

  destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    const eventTarget = this.canvas || window;
    eventTarget.removeEventListener('mousemove', this.handleMouseMove.bind(this) as EventListener);
    eventTarget.removeEventListener('mousedown', this.handleMouseDown.bind(this) as EventListener);
    eventTarget.removeEventListener('mouseup', this.handleMouseUp.bind(this) as EventListener);
    console.log("InputManager listeners removed.");
  }
}

console.log("InputManager class (src/game-client/core/InputManager.ts) loaded.");
