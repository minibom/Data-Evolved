// packages/common-types/zone.ts

// This file defines the static structure and potential of game zones.
// The dynamic state of a zone (e.g., controlling faction, current events)
// would be in db.ts (ZoneStateDoc).

export interface ZoneResourceNode {
  resourceId: string; // e.g., "common_data_scraps_node", "rare_crystal_vein"
  density: 'sparse' | 'moderate' | 'rich';
  regenerationRateMinutes?: number;
}

export interface ZonePOI { // Point of Interest
  poiId: string;
  name: string;
  type: 'landmark' | 'quest_hub' | 'vendor_location' | 'hidden_cache' | 'anomaly_hotspot';
  description?: string;
  coordinates?: { x: number; y: number; z?: number }; // Relative to zone origin
}

export interface ZoneUpgradePath {
  upgradeId: string; // e.g., "defense_grid", "resource_extractor", "comms_tower"
  name: string;
  description: string;
  maxLevel: number;
  costPerLevel: { level: number; resources: Record<string, number> }[]; // resourceId: amount
  effectsPerLevel: { level: number; description: string; buffs?: any[] }[];
}

export interface ZoneCoreMission {
  missionId: string;
  title: string;
  description: string;
  objectives: string[]; // Text descriptions of objectives
  // Rewards for initial completion might be tied to global progression or faction firsts
}

export interface ZoneData {
  id: string; // Unique zone ID, e.g., "alpha_sector_01", "nexus_core_ring"
  name: string;
  description: string;
  lore?: string;
  ambientMusicTrack?: string;
  environmentType: 'urban_digital' | 'corrupted_data_stream' | 'serene_nexus_garden' | 'industrial_processing_unit';
  sizeCategory: 'small' | 'medium' | 'large' | 'vast';
  connectivity?: Record<string, string>; // adjacentZoneId: connectionType (e.g., "direct_path", "teleporter_link")
  
  defaultControllingFaction?: 'AICore' | 'Hacker' | null; // Initial state
  initialStability?: number; // 0-1

  resources?: ZoneResourceNode[];
  pointsOfInterest?: ZonePOI[];
  availableUpgrades?: ZoneUpgradePath[]; // Upgrades that can be built by controlling faction
  coreMission?: ZoneCoreMission; // The main objective to "clear" or "stabilize" the zone initially
}

console.log("Common Zone Data types (packages/common-types/zone.ts) loaded.");
