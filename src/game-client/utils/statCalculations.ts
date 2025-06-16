// src/game-client/utils/statCalculations.ts
// Functions for calculating derived stats or effects based on primary stats.
import type { PlayerStats } from '@packages/common-types/game';

// Example: Calculate critical hit chance based on GHZ and Memory
export function calculateCritChance(stats: PlayerStats): number {
  // Simplified formula: (GHZ / 200) + (Memory / 500), capped at 50%
  const ghzBonus = (stats.ghz || 0) / 200;
  const memoryBonus = (stats.memory || 0) / 500;
  return Math.min(0.50, Math.max(0.01, ghzBonus + memoryBonus)); // Min 1%, Max 50%
}

// Example: Calculate skill cooldown reduction based on Memory
export function calculateCooldownReduction(stats: PlayerStats): number {
  // Simplified: 1% CDR per 20 Memory, capped at 30%
  const cdr = (stats.memory || 0) / 2000; // 20 memory = 0.01 (1%)
  return Math.min(0.30, Math.max(0, cdr));
}

// Example: Calculate dodge chance based on Firewall and GHZ (as processing speed for reaction)
export function calculateDodgeChance(stats: PlayerStats): number {
  const firewallBonus = (stats.firewall || 0) / 300;
  const ghzBonus = (stats.ghz || 0) / 400;
  return Math.min(0.25, Math.max(0, firewallBonus + ghzBonus)); // Max 25%
}

// Example: Calculate bonus damage for a specific skill type based on a stat
export function calculateSkillTypeBonusDamage(stats: PlayerStats, skillType: 'data_corruption' | 'system_exploit' | 'pure_energy'): number {
    let bonus = 0;
    if (skillType === 'data_corruption' && stats.memory) {
        bonus = stats.memory * 0.05; // 5% of memory as bonus damage
    } else if (skillType === 'system_exploit' && stats.ghz) {
        bonus = stats.ghz * 0.1; // 10% of GHZ as bonus damage
    } else if (skillType === 'pure_energy' && stats.power) {
        // Less common, but example: Power could slightly influence raw energy attacks
        bonus = stats.power * 0.02;
    }
    return bonus;
}


// Example: Calculate max HP based on level and some base Power
export function calculateMaxPower(basePower: number, level: number): number {
    return basePower + (level -1) * 10; // Each level adds 10 Power
}

export function calculateMaxMemory(baseMemory: number, level: number): number {
    return baseMemory + (level -1) * 5; // Each level adds 5 Memory
}


console.log("Stat Calculation utilities (src/game-client/utils/statCalculations.ts) loaded.");
