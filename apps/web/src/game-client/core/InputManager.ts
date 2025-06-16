// src/game-client/core/InputManager.ts
/**
 * InputManager handles player input from keyboard and mouse.
 * It tracks the state of keys (up, down, pressed, released) and mouse buttons,
 * as well as mouse position relative to the game canvas.
 */

type KeyState = 'up' | 'down' | 'pressed' | 'released';

export class InputManager {
  private keyStates: Map<string, KeyState> = new Map(); // Stores the state of each key (e.g., "KeyW", "Space")
  private mousePosition: { x: number; y: number } = { x: 0, y: 0 };
  private mouseButtonStates: Map<number, KeyState> = new Map(); // 0: left, 1: middle, 2: right
  private canvas: HTMLCanvasElement | null = null; // Reference to the game canvas for mouse coordinates

  // Bound event handlers to ensure `this` context is correct when used as listeners
  private boundHandleKeyDown: (event: KeyboardEvent) => void;
  private boundHandleKeyUp: (event: KeyboardEvent) => void;
  private boundHandleMouseMove: (event: MouseEvent) => void;
  private boundHandleMouseDown: (event: MouseEvent) => void;
  private boundHandleMouseUp: (event: MouseEvent) => void;
  private boundPreventContextMenu: (event: Event) => void;


  constructor(canvas?: HTMLCanvasElement) {
    if (canvas) this.attachToCanvas(canvas);

    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    this.boundHandleKeyUp = this.handleKeyUp.bind(this);
    this.boundHandleMouseMove = this.handleMouseMove.bind(this);
    this.boundHandleMouseDown = this.handleMouseDown.bind(this);
    this.boundHandleMouseUp = this.handleMouseUp.bind(this);
    this.boundPreventContextMenu = (e) => e.preventDefault();
    
    // Listeners are typically set up in init() or when a canvas is attached,
    // to ensure the canvas is ready and to allow for re-attachment if needed.
    console.log("InputManager initialized.");
  }

  /**
   * Attaches the InputManager to a specific canvas element.
   * This is important for calculating mouse coordinates relative to the canvas.
   * Also sets up canvas-specific listeners.
   * @param canvas The HTMLCanvasElement to attach to.
   */
  public attachToCanvas(canvas: HTMLCanvasElement): void {
    if (this.canvas) { // If previously attached, remove old listeners
      this.removeCanvasListeners();
    }
    this.canvas = canvas;
    // Ensure canvas can receive focus for keyboard events if not already globally listened
    if (!this.canvas.hasAttribute('tabindex')) {
        this.canvas.setAttribute('tabindex', '0'); 
    }
    this.setupCanvasListeners();
  }
  
  /**
   * Initializes the InputManager by setting up event listeners.
   * Should be called after the game canvas is available in the DOM.
   */
  public init(): void {
    this.setupGlobalListeners();
    if (this.canvas) {
        this.setupCanvasListeners();
    }
    console.log("InputManager event listeners attached.");
  }

  private setupGlobalListeners(): void {
    // Keyboard events are usually global
    window.addEventListener('keydown', this.boundHandleKeyDown);
    window.addEventListener('keyup', this.boundHandleKeyUp);
  }

  private setupCanvasListeners(): void {
    if (!this.canvas) return;
    // Mouse events are relative to the canvas
    this.canvas.addEventListener('mousemove', this.boundHandleMouseMove);
    this.canvas.addEventListener('mousedown', this.boundHandleMouseDown);
    this.canvas.addEventListener('mouseup', this.boundHandleMouseUp);
    // Prevent right-click context menu on the canvas
    this.canvas.addEventListener('contextmenu', this.boundPreventContextMenu);
  }
  
  private removeGlobalListeners(): void {
    window.removeEventListener('keydown', this.boundHandleKeyDown);
    window.removeEventListener('keyup', this.boundHandleKeyUp);
  }

  private removeCanvasListeners(): void {
    if (!this.canvas) return;
    this.canvas.removeEventListener('mousemove', this.boundHandleMouseMove);
    this.canvas.removeEventListener('mousedown', this.boundHandleMouseDown);
    this.canvas.removeEventListener('mouseup', this.boundHandleMouseUp);
    this.canvas.removeEventListener('contextmenu', this.boundPreventContextMenu);
  }


  private handleKeyDown(event: KeyboardEvent): void {
    // Prevent default browser action for certain keys if needed (e.g., spacebar scrolling)
    // if (event.code === "Space") event.preventDefault();
    if (this.keyStates.get(event.code) !== 'down') { // Avoid re-triggering 'pressed' if key is held
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
        // Fallback to clientX/Y if no canvas (less useful for game coords)
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

  /**
   * Updates the internal state of keys and mouse buttons.
   * Should be called once per game loop, typically at the beginning.
   * This transitions 'pressed' states to 'down' and 'released' states to 'up'.
   */
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
    // 'Pressed' is true only for the single frame after the key is initially pressed.
    return this.keyStates.get(keyCode) === 'pressed';
  }

  public isKeyReleased(keyCode: string): boolean {
    // 'Released' is true only for the single frame after the key is released.
    return this.keyStates.get(keyCode) === 'released';
  }

  public getMousePosition(): { x: number; y: number } {
    return { ...this.mousePosition }; // Return a copy
  }

  public isMouseButtonDown(button: number): boolean { // 0: left, 1: middle, 2: right
    const state = this.mouseButtonStates.get(button);
    return state === 'down' || state === 'pressed';
  }

  public isMouseButtonPressed(button: number): boolean {
    return this.mouseButtonStates.get(button) === 'pressed';
  }
  
  public isMouseButtonReleased(button: number): boolean {
    return this.mouseButtonStates.get(button) === 'released';
  }

  /**
   * Cleans up event listeners when the InputManager is no longer needed.
   */
  public destroy(): void {
    this.removeGlobalListeners();
    this.removeCanvasListeners();
    this.keyStates.clear();
    this.mouseButtonStates.clear();
    console.log("InputManager listeners removed and state cleared.");
  }
}

console.log("InputManager class (src/game-client/core/InputManager.ts) updated and detailed.");
