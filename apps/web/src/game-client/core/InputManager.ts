// src/game-client/core/InputManager.ts
/**
 * InputManager handles player input from keyboard and mouse.
 * It tracks the state of keys (up, down, pressed, released) and mouse buttons,
 * as well as mouse position relative to the game canvas.
 */

type KeyState = 'up' | 'down' | 'pressed' | 'released';

export class InputManager {
  private keyStates: Map<string, KeyState> = new Map();
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private mouseButtonStates: Map<number, KeyState> = new Map(); // 0: left, 1: middle, 2: right
  private canvas: HTMLCanvasElement | null = null;

  private boundHandleKeyDown: (event: KeyboardEvent) => void;
  private boundHandleKeyUp: (event: KeyboardEvent) => void;
  private boundHandleMouseMove: (event: MouseEvent) => void;
  private boundHandleMouseDown: (event: MouseEvent) => void;
  private boundHandleMouseUp: (event: MouseEvent) => void;
  private boundPreventContextMenu: (event: Event) => void;

  constructor(canvas?: HTMLCanvasElement) {
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    this.boundHandleKeyUp = this.handleKeyUp.bind(this);
    this.boundHandleMouseMove = this.handleMouseMove.bind(this);
    this.boundHandleMouseDown = this.handleMouseDown.bind(this);
    this.boundHandleMouseUp = this.handleMouseUp.bind(this);
    this.boundPreventContextMenu = (e) => e.preventDefault();

    if (canvas) {
      this.attachToCanvas(canvas);
    }
    console.log("InputManager initialized.");
  }

  public attachToCanvas(canvas: HTMLCanvasElement): void {
    if (this.canvas) {
      this.removeCanvasListeners();
    }
    this.canvas = canvas;
    if (!this.canvas.hasAttribute('tabindex')) {
        this.canvas.setAttribute('tabindex', '0'); // Essential for canvas to receive keyboard events
    }
    this.canvas.focus(); // Focus the canvas to receive keyboard events
    this.setupCanvasListeners();
  }
  
  public init(): void {
    // Keyboard events are global, but we also need canvas to be focusable.
    this.setupGlobalListeners();
    if (this.canvas) {
        this.canvas.focus();
        this.setupCanvasListeners(); // Re-attach if canvas was set after constructor
    } else {
        console.warn("InputManager: Canvas not provided during init. Mouse events might not be relative to game area.");
    }
    console.log("InputManager event listeners attached.");
  }

  private setupGlobalListeners(): void {
    window.addEventListener('keydown', this.boundHandleKeyDown, false);
    window.addEventListener('keyup', this.boundHandleKeyUp, false);
  }

  private setupCanvasListeners(): void {
    if (!this.canvas) return;
    this.canvas.addEventListener('mousemove', this.boundHandleMouseMove, false);
    this.canvas.addEventListener('mousedown', this.boundHandleMouseDown, false);
    this.canvas.addEventListener('mouseup', this.boundHandleMouseUp, false);
    this.canvas.addEventListener('contextmenu', this.boundPreventContextMenu, false);
  }
  
  private removeGlobalListeners(): void {
    window.removeEventListener('keydown', this.boundHandleKeyDown, false);
    window.removeEventListener('keyup', this.boundHandleKeyUp, false);
  }

  private removeCanvasListeners(): void {
    if (!this.canvas) return;
    this.canvas.removeEventListener('mousemove', this.boundHandleMouseMove, false);
    this.canvas.removeEventListener('mousedown', this.boundHandleMouseDown, false);
    this.canvas.removeEventListener('mouseup', this.boundHandleMouseUp, false);
    this.canvas.removeEventListener('contextmenu', this.boundPreventContextMenu, false);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (document.activeElement !== this.canvas && this.canvas) { // Only process if canvas is focused or no specific focus on input fields
      // Check if focus is on an input field outside canvas, if so, ignore game input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
    }
    // console.log("Key down:", event.code);
    if (this.keyStates.get(event.code) !== 'down') {
      this.keyStates.set(event.code, 'pressed');
    }
    // Optionally prevent default for specific keys like space, arrows if they scroll the page
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) {
      event.preventDefault();
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    // console.log("Key up:", event.code);
    this.keyStates.set(event.code, 'released');
  }

  private handleMouseMove(event: MouseEvent): void {
    if (this.canvas) {
        const rect = this.canvas.getBoundingClientRect();
        this.mousePosition.x = event.clientX - rect.left;
        this.mousePosition.y = event.clientY - rect.top;
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
    this.keyStates.forEach((state, key) => {
      if (state === 'pressed') this.keyStates.set(key, 'down');
      if (state === 'released') this.keyStates.set(key, 'up');
    });
    this.mouseButtonStates.forEach((state, button) => {
      if (state === 'pressed') this.mouseButtonStates.set(button, 'down');
      if (state === 'released') this.mouseButtonStates.set(button, 'up');
    });
  }

  public isKeyDown(keyCode: string): boolean {
    const state = this.keyStates.get(keyCode);
    return state === 'down' || state === 'pressed';
  }

  public isKeyPressed(keyCode: string): boolean {
    return this.keyStates.get(keyCode) === 'pressed';
  }

  public isKeyReleased(keyCode: string): boolean {
    return this.keyStates.get(keyCode) === 'released';
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
    this.removeGlobalListeners();
    this.removeCanvasListeners();
    this.keyStates.clear();
    this.mouseButtonStates.clear();
    console.log("InputManager listeners removed and state cleared.");
  }
}
