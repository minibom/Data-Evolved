// src/game-client/core/InputManager.ts

type KeyState = 'up' | 'down' | 'pressed' | 'released';

export class InputManager {
  private keys: Map<string, KeyState> = new Map(); // Renamed from keyStates
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private mouseButtonStates: Map<number, KeyState> = new Map(); // 0: left, 1: middle, 2: right
  private canvas: HTMLCanvasElement | null = null;

  constructor(canvas?: HTMLCanvasElement) {
    if (canvas) this.attachToCanvas(canvas);
    // Listeners are set up in init() to allow canvas to be passed later or for testing.
    console.log("InputManager initialized.");
  }

  public init(): void {
    this.setupListeners();
    console.log("InputManager event listeners attached.");
  }
  
  public attachToCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    if (!this.canvas.hasAttribute('tabindex')) {
        this.canvas.setAttribute('tabindex', '0'); 
    }
     // If listeners were already set up on window, remove them before attaching to canvas
    this.removeListeners(window);
    this.setupListeners(); // Re-setup with canvas as target if available
  }

  private setupListeners(): void {
    const eventTarget = this.canvas || window;

    // Ensure no duplicate listeners by removing old ones first if target changes
    this.removeListeners(this.canvas ? window : undefined); // remove from window if now targeting canvas
    this.removeListeners(eventTarget === window ? this.canvas : undefined); // remove from canvas if now targeting window


    eventTarget.addEventListener('keydown', this.handleKeyDown.bind(this) as EventListener);
    eventTarget.addEventListener('keyup', this.handleKeyUp.bind(this) as EventListener);
    eventTarget.addEventListener('mousemove', this.handleMouseMove.bind(this) as EventListener);
    eventTarget.addEventListener('mousedown', this.handleMouseDown.bind(this) as EventListener);
    eventTarget.addEventListener('mouseup', this.handleMouseUp.bind(this) as EventListener);
    
    if (this.canvas) {
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
  }
  
  private removeListeners(target?: Window | HTMLCanvasElement | null): void {
    const eventTarget = target || this.canvas || window;
    eventTarget.removeEventListener('keydown', this.handleKeyDown.bind(this) as EventListener);
    eventTarget.removeEventListener('keyup', this.handleKeyUp.bind(this) as EventListener);
    eventTarget.removeEventListener('mousemove', this.handleMouseMove.bind(this) as EventListener);
    eventTarget.removeEventListener('mousedown', this.handleMouseDown.bind(this) as EventListener);
    eventTarget.removeEventListener('mouseup', this.handleMouseUp.bind(this) as EventListener);
    if (target && target instanceof HTMLCanvasElement) {
        target.removeEventListener('contextmenu', (e) => e.preventDefault());
    }
  }


  private handleKeyDown(event: KeyboardEvent): void {
    if (this.keys.get(event.code) !== 'down') {
      this.keys.set(event.code, 'pressed');
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.keys.set(event.code, 'released');
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

  public update(): void {
    this.keys.forEach((state, key) => {
      if (state === 'pressed') this.keys.set(key, 'down');
      if (state === 'released') this.keys.set(key, 'up');
    });
    this.mouseButtonStates.forEach((state, button) => {
      if (state === 'pressed') this.mouseButtonStates.set(button, 'down');
      if (state === 'released') this.mouseButtonStates.set(button, 'up');
    });
  }

  public isKeyDown(keyCode: string): boolean {
    const state = this.keys.get(keyCode);
    return state === 'down' || state === 'pressed';
  }

  public isKeyPressed(keyCode: string): boolean {
    return this.keys.get(keyCode) === 'pressed';
  }

  public isKeyReleased(keyCode: string): boolean {
    return this.keys.get(keyCode) === 'released';
  }

  public getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition };
  }

  public isMouseButtonDown(button: number): boolean {
    const state = this.mouseButtonStates.get(button);
    return state === 'down' || state === 'pressed';
  }

  public isMouseButtonPressed(button: number): boolean {
    return this.mouseButtonStates.get(button) === 'pressed';
  }
  
  public isMouseButtonReleased(button: number): boolean {
    return this.mouseButtonStates.get(button) === 'released';
  }

  public destroy(): void {
    this.removeListeners(this.canvas);
    this.removeListeners(window); // Ensure window listeners are also cleared if canvas wasn't primary target
    console.log("InputManager listeners removed.");
  }
}

console.log("InputManager class (src/game-client/core/InputManager.ts) updated.");
