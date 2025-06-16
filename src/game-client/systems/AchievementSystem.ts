// src/game-client/systems/AchievementSystem.ts
// Client-side logic for tracking and displaying achievements.
// import { apiClient } from '../api-client';
// import type { Achievement } from '@packages/common-types/game';

export class AchievementSystem {
  private playerAchievements: Map<string, { unlockedAt: string }> = new Map(); // achievementId -> { unlockedAt }
  private allAvailableAchievements: any[] = []; // Replace 'any' with Achievement[]
  // private uiManager: UIManager;

  constructor(/* uiManager: UIManager */) {
    // this.uiManager = uiManager;
    console.log("AchievementSystem initialized.");
  }

  public async loadAchievements(playerId: string): Promise<void> {
    console.log(`Loading achievements for player ${playerId}...`);
    // const allAchievementsData = await apiClient.getAllAchievements(); // Fetch all definitions
    // const playerUnlockedData = await apiClient.getPlayerAchievements(playerId); // Fetch player's specific unlocked ones

    // this.allAvailableAchievements = allAchievementsData;
    // playerUnlockedData.forEach((ach: any) => this.playerAchievements.set(ach.achievementId, { unlockedAt: ach.unlockedAt }));
    
    // this.uiManager.displayAchievements(this.allAvailableAchievements, this.playerAchievements);
    // Mock
    this.allAvailableAchievements = [{id: "ach_mock_1", name: "First Step", description: "Entered the game."}];
    this.playerAchievements.set("ach_mock_1", { unlockedAt: new Date().toISOString() });
    console.log("Achievements loaded. Unlocked:", this.playerAchievements);
  }

  public isAchievementUnlocked(achievementId: string): boolean {
    return this.playerAchievements.has(achievementId);
  }

  public getAchievementDetails(achievementId: string): any | undefined { // Replace 'any'
    return this.allAvailableAchievements.find(ach => ach.id === achievementId);
  }
  
  // The game server or specific game systems would typically notify this system of an unlock.
  // Or, the client might report an action that could unlock an achievement.
  public async checkAndUnlockAchievement(playerId: string, eventType: string, eventData: any): Promise<void> {
    console.log(`Checking for achievement unlock for player ${playerId} due to event: ${eventType}`, eventData);
    // const result = await apiClient.checkAchievementUnlock(playerId, eventType, eventData); // API to check and potentially unlock
    // if (result.newlyUnlocked && result.newlyUnlocked.length > 0) {
    //   result.newlyUnlocked.forEach((ach: any) => {
    //      this.playerAchievements.set(ach.achievementId, { unlockedAt: ach.unlockedAt });
    //      // this.uiManager.showAchievementUnlockedNotification(ach);
    //   });
    //   this.uiManager.updateAchievementsDisplay();
    // }
  }
}

console.log("AchievementSystem class (src/game-client/systems/AchievementSystem.ts) loaded.");
