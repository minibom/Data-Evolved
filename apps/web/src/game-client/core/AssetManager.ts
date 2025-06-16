// src/game-client/core/AssetManager.ts
/**
 * AssetManager is responsible for loading and providing access to
 * game assets such as images, audio files, tilemap data, etc.
 * It uses an AssetManifest (typically a JSON file) to know what to load.
 */

// Describes the structure of the manifest file (e.g., public/data/asset-manifest.json)
export interface AssetManifest {
  images?: { name: string; url: string }[];
  audio?: { name: string; url: string }[];
  tilemaps?: { name: string; url: string }[]; // URL to the Tiled JSON file or other map data format
  // Add other asset types like fonts, shaders, models (for 3D), etc.
}

export class AssetManager {
  // Using separate maps for different asset types for type safety and easier management.
  private images: Map<string, HTMLImageElement> = new Map();
  private audioTracks: Map<string, HTMLAudioElement> = new Map();
  private tilemapData: Map<string, any> = new Map(); // Store parsed JSON tilemap data
  // Add maps for other asset types if needed

  constructor() {
    console.log("AssetManager initialized.");
  }

  /**
   * Loads all assets specified in the provided manifest.
   * @param manifest An object describing the assets to load.
   * @returns A promise that resolves when all assets are loaded.
   */
  public async loadAssets(manifest: AssetManifest): Promise<void> {
    const promises: Promise<any>[] = [];

    if (manifest.images) {
      manifest.images.forEach(imgAsset => 
        promises.push(this.loadImage(imgAsset.name, imgAsset.url))
      );
    }
    if (manifest.audio) {
      manifest.audio.forEach(audioAsset => 
        promises.push(this.loadAudio(audioAsset.name, audioAsset.url))
      );
    }
    if (manifest.tilemaps) {
      manifest.tilemaps.forEach(tilemapAsset => 
        promises.push(this.loadTilemap(tilemapAsset.name, tilemapAsset.url))
      );
    }
    // Add loading for other asset types here

    try {
      await Promise.all(promises);
      console.log("AssetManager: All specified assets loaded successfully from manifest.");
    } catch (error) {
      console.error("AssetManager: Error loading assets from manifest:", error);
      // Depending on game design, you might want to throw this error further
      // or handle it by, for example, loading fallback assets.
      throw error; // Re-throw to indicate loading failure
    }
  }

  /**
   * Loads a single image asset.
   * @param name The key/name to store the image under.
   * @param url The URL of the image file.
   * @returns A promise that resolves with the loaded HTMLImageElement.
   */
  public async loadImage(name: string, url: string): Promise<HTMLImageElement> {
    if (this.images.has(name)) {
      return this.images.get(name)!;
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(name, img);
        console.log(`AssetManager: Image '${name}' loaded from ${url}`);
        resolve(img);
      };
      img.onerror = (err) => {
        console.error(`AssetManager: Failed to load image '${name}' from ${url}:`, err);
        reject(new Error(`Failed to load image ${name}: ${err instanceof Event ? url : err}`));
      };
      img.src = url;
    });
  }

  /**
   * Loads a single audio asset.
   * @param name The key/name to store the audio under.
   * @param url The URL of the audio file.
   * @returns A promise that resolves with the loaded HTMLAudioElement.
   */
  public async loadAudio(name: string, url: string): Promise<HTMLAudioElement> {
    if (this.audioTracks.has(name)) {
      return this.audioTracks.get(name)!;
    }
    return new Promise((resolve, reject) => {
      const aud = new Audio();
      // 'canplaythrough' event ensures enough data is loaded to play without interruption.
      aud.oncanplaythrough = () => {
        this.audioTracks.set(name, aud);
        console.log(`AssetManager: Audio '${name}' loaded from ${url}`);
        resolve(aud);
      };
      aud.onerror = (err) => {
        console.error(`AssetManager: Failed to load audio '${name}' from ${url}:`, err);
        reject(new Error(`Failed to load audio ${name}: ${err instanceof Event ? url : err}`));
      };
      aud.src = url;
      aud.load(); // Important: initiates loading for some browsers/audio types.
    });
  }

  /**
   * Loads and parses a single tilemap JSON asset.
   * @param name The key/name to store the tilemap data under.
   * @param url The URL of the tilemap JSON file.
   * @returns A promise that resolves with the parsed tilemap data (typically an object).
   */
  public async loadTilemap(name: string, url: string): Promise<any> {
    if (this.tilemapData.has(name)) {
      return this.tilemapData.get(name)!;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error loading tilemap ${name}! status: ${response.status}`);
      }
      const data = await response.json();
      this.tilemapData.set(name, data);
      console.log(`AssetManager: Tilemap '${name}' loaded and parsed from ${url}`);
      return data;
    } catch (error) {
      console.error(`AssetManager: Failed to load or parse tilemap '${name}' from ${url}:`, error);
      throw error; // Re-throw to indicate failure
    }
  }

  /**
   * Retrieves a previously loaded asset by its key/name.
   * This is a generic getter; specific getters like getImage, getAudio are preferred.
   * @param key The name/key of the asset.
   * @param type The type of asset to retrieve ('image', 'audio', 'tilemap').
   * @returns The asset, or undefined if not found or type mismatch.
   */
  public getAsset<T>(key: string, type: 'image' | 'audio' | 'tilemap' /* | other types */): T | undefined {
    let asset: any;
    switch (type) {
      case 'image': asset = this.images.get(key); break;
      case 'audio': asset = this.audioTracks.get(key); break;
      case 'tilemap': asset = this.tilemapData.get(key); break;
      default:
        console.warn(`AssetManager: Unknown asset type '${type}' requested for key '${key}'.`);
        return undefined;
    }
    if (!asset) {
      console.warn(`AssetManager: Asset with key "${key}" of type "${type}" not found.`);
    }
    return asset as T;
  }

  // Specific getters for convenience and type safety
  public getImage(name: string): HTMLImageElement | undefined {
    return this.images.get(name);
  }

  public getAudio(name: string): HTMLAudioElement | undefined {
    return this.audioTracks.get(name);
  }

  public getTilemap(name: string): any | undefined { // Replace 'any' with a proper TilemapData type if defined
    return this.tilemapData.get(name);
  }
}

console.log("AssetManager class (src/game-client/core/AssetManager.ts) updated and detailed.");
