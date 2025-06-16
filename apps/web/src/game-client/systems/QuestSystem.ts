// src/game-client/systems/QuestSystem.ts
import { BaseSystem } from './BaseSystem';
import type { GameClient } from '../index';
// Define Quest type, ideally from @packages/common-types
type Quest = any; // Placeholder
type QuestProgress = any; // Placeholder

interface PlayerQuestState {
  quest: Quest;
  status: 'active' | 'completed' | 'failed';
  progress: QuestProgress;
}

export class QuestSystem extends BaseSystem {
  private playerQuests: Map<string, PlayerQuestState[]> = new Map(); // playerId -> QuestState[]

  constructor(game: GameClient) {
    super(game);
  }

  public init(): void {
    super.init();
    // Load active quests for logged-in player
  }

  public update(delta: number): void {
    // Check for quest objective completion based on game events
  }

  public startQuest(playerId: string, quest: Quest): void {
    const quests = this.playerQuests.get(playerId) || [];
    if (quests.find(q => q.quest.id === quest.id)) {
      console.warn(`Player ${playerId} already has quest ${quest.id}.`);
      return;
    }
    quests.push({ quest, status: 'active', progress: {} /* initial progress */ });
    this.playerQuests.set(playerId, quests);
    console.log(`Quest "${quest.title || quest.id}" started for player ${playerId}.`);
    // Notify UI
  }

  public completeQuest(playerId: string, quest: Quest): void {
    const playerQuest = this.getPlayerQuestState(playerId, quest.id);
    if (playerQuest && playerQuest.status === 'active') {
      playerQuest.status = 'completed';
      console.log(`Quest "${quest.title || quest.id}" completed by player ${playerId}.`);
      // Grant rewards, trigger follow-up events
      // Notify UI
    }
  }

  public updateQuestProgress(playerId: string, quest: Quest, progress: QuestProgress): void {
     const playerQuest = this.getPlayerQuestState(playerId, quest.id);
     if (playerQuest && playerQuest.status === 'active') {
       playerQuest.progress = { ...playerQuest.progress, ...progress };
       console.log(`Progress updated for quest "${quest.title || quest.id}" for player ${playerId}.`);
       // Check if quest is now complete
       // if (this.areObjectivesComplete(playerQuest)) {
       //   this.completeQuest(playerId, quest);
       // }
       // Notify UI
     }
  }
  
  private getPlayerQuestState(playerId: string, questId: string): PlayerQuestState | undefined {
    return (this.playerQuests.get(playerId) || []).find(q => q.quest.id === questId);
  }
}

console.log("QuestSystem class (src/game-client/systems/QuestSystem.ts) updated.");
