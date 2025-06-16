// apps/web/src/game-client/events/ZoneEvents.ts
/**
 * Defines game events related to game Zones.
 * Published by ZoneControlSystem, RealtimeSyncSystem, or world event triggers.
 * Subscribed to by UI systems (e.g., map display), QuestSystem, FactionSystem.
 */
import type { ClientGameEvent } from '@/lib/types/common-events';
// Assuming a Zone type definition exists, e.g., from @packages/common-types/zone or db
import type { ZoneData } from '@packages/common-types/zone';
import type { ZoneStateDoc } from '@packages/common-types/db';

// --- Player Entered Zone Event ---
export const PLAYER_ENTERED_ZONE_EVENT = "PLAYER_ENTERED_ZONE";
export interface PlayerEnteredZoneEventData {
  playerId: string;
  zoneId: string;
  zoneName?: string; // Denormalized for convenience
  previousZoneId?: string;
}
export interface PlayerEnteredZoneEvent extends ClientGameEvent {
  type: typeof PLAYER_ENTERED_ZONE_EVENT;
  data: PlayerEnteredZoneEventData;
}

// --- Zone Control Changed Event ---
export const ZONE_CONTROL_CHANGED_EVENT = "ZONE_CONTROL_CHANGED";
export interface ZoneControlChangedEventData {
  zoneId: string;
  newControllingFactionId?: string | null; // null if neutral
  oldControllingFactionId?: string | null;
  reason?: 'conquest' | 'decay' | 'event_outcome';
}
export interface ZoneControlChangedEvent extends ClientGameEvent {
  type: typeof ZONE_CONTROL_CHANGED_EVENT;
  data: ZoneControlChangedEventData;
}

// --- Zone Status Changed Event ---
export const ZONE_STATUS_CHANGED_EVENT = "ZONE_STATUS_CHANGED";
export interface ZoneStatusChangedEventData {
  zoneId: string;
  newStatus: ZoneStateDoc['status']; // e.g., "stable", "contested", "under_attack"
  oldStatus?: ZoneStateDoc['status'];
  details?: string; // e.g., "Hacker faction initiated assault"
}
export interface ZoneStatusChangedEvent extends ClientGameEvent {
  type: typeof ZONE_STATUS_CHANGED_EVENT;
  data: ZoneStatusChangedEventData;
}

// --- Zone Upgrade Completed Event ---
export const ZONE_UPGRADE_COMPLETED_EVENT = "ZONE_UPGRADE_COMPLETED";
export interface ZoneUpgradeCompletedEventData {
  zoneId: string;
  upgradeId: string;
  newLevel: number;
  factionId: string; // Faction that completed the upgrade
}
export interface ZoneUpgradeCompletedEvent extends ClientGameEvent {
  type: typeof ZONE_UPGRADE_COMPLETED_EVENT;
  data: ZoneUpgradeCompletedEventData;
}

// --- Zone Core Mission Completed Event ---
export const ZONE_CORE_MISSION_COMPLETED_EVENT = "ZONE_CORE_MISSION_COMPLETED";
export interface ZoneCoreMissionCompletedEventData {
    zoneId: string;
    missionId: string;
    completingFactionId?: string; // Faction that primarily contributed
    consequence?: "zone_now_contestable" | string;
}
export interface ZoneCoreMissionCompletedEvent extends ClientGameEvent {
    type: typeof ZONE_CORE_MISSION_COMPLETED_EVENT;
    data: ZoneCoreMissionCompletedEventData;
}


console.log("Zone-specific game events (apps/web/src/game-client/events/ZoneEvents.ts) defined.");
