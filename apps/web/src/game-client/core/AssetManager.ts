// src/game-client/core/AssetManager.ts

export interface AssetManifest {
  images?: { name: string; url: string }[];
  audio?: { name: string; url: string }[];
  tilemaps?: { name: string; url: string }[]; // URL to the Tiled JSON file
  // Add other asset types like fonts, shaders, etc.
}

export class AssetManager {
  private assets: Map<string, any> = new Map();

  constructor() {
    console.log("AssetManager initialized.");
  }

  public async loadAssets(manifest: AssetManifest): Promise<void> {
    const promises: Promise<any>[] = [];

    if (manifest.images) {
      manifest.images.forEach(img => promises.push(this.loadImage(img.name, img.url)));
    }
    if (manifest.audio) {
      manifest.audio.forEach(aud => promises.push(this.loadAudio(aud.name, aud.url)));
    }
    if (manifest.tilemaps) {
      manifest.tilemaps.forEach(map => promises.push(this.loadTilemap(map.name, map.url)));
    }
    // Add loading for other asset types

    await Promise.all(promises);
    console.log("All specified assets loaded from manifest.");
  }

  private async loadImage(name: string, url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (this.assets.has(name)) {
        resolve(this.assets.get(name)!);
        return;
      }
      const img = new Image();
      img.onload = () => {
        this.assets.set(name, img);
        console.log(`AssetManager: Image '${name}' loaded from ${url}`);
        resolve(img);
      };
      img.onerror = (err) => {
        console.error(`AssetManager: Failed to load image ${name} from ${url}:`, err);
        reject(`Failed to load image ${name} from ${url}: ${err}`);
      }
      img.src = url;
    });
  }

  private async loadAudio(name: string, url: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      if (this.assets.has(name)) {
        resolve(this.assets.get(name)!);
        return;
      }
      const aud = new Audio();
      aud.oncanplaythrough = () => { // Ensures enough data is loaded
        this.assets.set(name, aud);
        console.log(`AssetManager: Audio '${name}' loaded from ${url}`);
        resolve(aud);
      };
      aud.onerror = (err) => {
         console.error(`AssetManager: Failed to load audio ${name} from ${url}:`, err);
        reject(`Failed to load audio ${name} from ${url}: ${err}`);
      }
      aud.src = url;
      aud.load(); // Important for some browsers
    });
  }

  private async loadTilemap(name: string, url: string): Promise<any> {
    if (this.assets.has(name)) {
        return this.assets.get(name)!;
    }
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        this.assets.set(name, data);
        console.log(`AssetManager: Tilemap '${name}' loaded from ${url}`);
        return data;
    } catch (error) {
        console.error(`AssetManager: Failed to load tilemap ${name} from ${url}:`, error);
        throw error;
    }
  }

  public getAsset<T>(key: string): T {
    const asset = this.assets.get(key);
    if (!asset) {
      console.warn(`AssetManager: Asset with key "${key}" not found.`);
      // Depending on strictness, you might throw an error or return undefined/null
    }
    return asset as T;
  }

  // Specific getters for convenience
  public getImage(name: string): HTMLImageElement | undefined {
    return this.getAsset<HTMLImageElement>(name);
  }

  public getAudio(name: string): HTMLAudioElement | undefined {
    return this.getAsset<HTMLAudioElement>(name);
  }

  public getTilemap(name: string): any | undefined { // Replace 'any' with a proper Tilemap type
    return this.getAsset<any>(name);
  }
}

console.log("AssetManager class (src/game-client/core/AssetManager.ts) updated.");
