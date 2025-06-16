// src/game-client/core/AssetManager.ts

interface ImageAsset {
  name: string;
  url: string;
}

interface AudioAsset {
  name: string;
  url: string;
}

interface TilemapAsset {
  name: string;
  url: string; // URL to the Tiled JSON file
}

interface AssetsToLoad {
  images?: ImageAsset[];
  audio?: AudioAsset[];
  tilemaps?: TilemapAsset[];
  // Add other asset types like fonts, shaders, etc.
}

export class AssetManager {
  private images: Map<string, HTMLImageElement> = new Map();
  private audio: Map<string, HTMLAudioElement> = new Map();
  private tilemaps: Map<string, any> = new Map(); // Store parsed JSON tilemap data

  constructor() {
    console.log("AssetManager initialized.");
  }

  async loadImage(name: string, url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (this.images.has(name)) {
        resolve(this.images.get(name)!);
        return;
      }
      const img = new Image();
      img.onload = () => {
        this.images.set(name, img);
        resolve(img);
      };
      img.onerror = (err) => reject(`Failed to load image ${name} from ${url}: ${err}`);
      img.src = url;
    });
  }

  async loadAudio(name: string, url: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      if (this.audio.has(name)) {
        resolve(this.audio.get(name)!);
        return;
      }
      const aud = new Audio();
      aud.oncanplaythrough = () => { // Ensures enough data is loaded
        this.audio.set(name, aud);
        resolve(aud);
      };
      aud.onerror = (err) => reject(`Failed to load audio ${name} from ${url}: ${err}`);
      aud.src = url;
      aud.load(); // Important for some browsers
    });
  }

  async loadTilemap(name: string, url: string): Promise<any> {
    if (this.tilemaps.has(name)) {
        return this.tilemaps.get(name)!;
    }
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        this.tilemaps.set(name, data);
        return data;
    } catch (error) {
        console.error(`Failed to load tilemap ${name} from ${url}:`, error);
        throw error;
    }
  }


  async load(assets: AssetsToLoad): Promise<void> {
    const promises: Promise<any>[] = [];

    if (assets.images) {
      assets.images.forEach(img => promises.push(this.loadImage(img.name, img.url)));
    }
    if (assets.audio) {
      assets.audio.forEach(aud => promises.push(this.loadAudio(aud.name, aud.url)));
    }
    if (assets.tilemaps) {
      assets.tilemaps.forEach(map => promises.push(this.loadTilemap(map.name, map.url)));
    }
    // Add loading for other asset types

    await Promise.all(promises);
    console.log("All specified assets loaded.");
  }

  getImage(name: string): HTMLImageElement | undefined {
    return this.images.get(name);
  }

  getAudio(name: string): HTMLAudioElement | undefined {
    return this.audio.get(name);
  }

  getTilemap(name: string): any | undefined {
    return this.tilemaps.get(name);
  }
}

console.log("AssetManager class (src/game-client/core/AssetManager.ts) loaded.");
