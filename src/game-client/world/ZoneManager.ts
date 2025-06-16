// src/game-client/world/ZoneManager.ts
// Manages different game zones, their states, transitions, and potentially zone-specific assets or logic.
// This is client-side representation, actual state authoritative on server.
// import { apiClient } from '../api-client';
// import type { ZoneStateDoc } from '@packages/common-types/db'; // Assuming type

interface ClientZoneState extends Partial<any> { // Replace 'any' with ZoneStateDoc
    zoneId: string;
    name: string;
    // Client-side specific data if needed, e.g., loaded assets for this zone
    isCurrentlyActive?: boolean; 
}

export class ZoneManager {
  private allZoneData: Map<string, ClientZoneState> = new Map(); // zoneId -> ZoneState
  private currentPlayerZoneId: string | null = null;

  constructor() {
    console.log("ZoneManager initialized.");
    this.loadInitialZoneData();
  }

  private async loadInitialZoneData(): Promise<void> {
    console.log("Loading initial zone data...");
    // const zonesFromServer = await apiClient.getAllZoneStates();
    // zonesFromServer.forEach((zoneData: any) => {
    //   this.allZoneData.set(zoneData.zoneId, { ...zoneData, isCurrentlyActive: false });
    // });
    // console.log("All zone data loaded:", this.allZoneData);

    // Mock data
    this.allZoneData.set("zone_nexus_hub", { zoneId: "zone_nexus_hub", name: "Nexus Hub", status: "stable", controllingFactionId: "AICore" });
    this.allZoneData.set("zone_data_wastes", { zoneId: "zone_data_wastes", name: "Data Wastes", status: "contested"});
    console.log("Initial zone data loaded (mock).");
  }

  public getZoneData(zoneId: string): ClientZoneState | undefined {
    return this.allZoneData.get(zoneId);
  }

  public getAllZones(): ClientZoneState[] {
    return Array.from(this.allZoneData.values());
  }

  public getCurrentPlayerZoneId(): string | null {
    return this.currentPlayerZoneId;
  }

  // Called when player transitions to a new zone
  public async enterZone(zoneId: string /*, player: Player */): Promise<void> {
    if (this.currentPlayerZoneId === zoneId) return;

    const newZoneData = this.allZoneData.get(zoneId);
    if (!newZoneData) {
      console.error(`Attempted to enter unknown zone: ${zoneId}`);
      return;
    }

    console.log(`Player entering zone: ${newZoneData.name || zoneId}`);
    // 1. Unload assets/entities from previous zone (if applicable)
    // if (this.currentPlayerZoneId) {
    //   const oldZone = this.allZoneData.get(this.currentPlayerZoneId);
    //   if (oldZone) oldZone.isCurrentlyActive = false;
    //   // gameClient.sceneManager.unloadZoneAssets(this.currentPlayerZoneId);
    // }
    
    // 2. Load assets/entities for the new zone
    // newZoneData.isCurrentlyActive = true;
    // await gameClient.sceneManager.loadZoneAssets(zoneId); // This would trigger map loading, NPC spawning etc.
    // player.setPosition(newZoneData.entryPoint.x, newZoneData.entryPoint.y); // Move player to zone entry

    this.currentPlayerZoneId = zoneId;
    console.log(`Player is now in zone: ${this.currentPlayerZoneId}`);
  }

  public updateZoneState(zoneId: string, updatedData: Partial<ClientZoneState>): void {
    const zone = this.allZoneData.get(zoneId);
    if (zone) {
      this.allZoneData.set(zoneId, { ...zone, ...updatedData });
      console.log(`Zone ${zoneId} state updated:`, this.allZoneData.get(zoneId));
      // If this is the active zone, UI might need to refresh (e.g., map display, faction control indicators)
      // if (zone.isCurrentlyActive) { /* uiManager.refreshZoneDisplay(zoneId); */ }
    }
  }
}

console.log("ZoneManager class (src/game-client/world/ZoneManager.ts) loaded.");
