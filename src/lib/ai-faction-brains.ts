// @/lib/ai-faction-brains.ts
import type { AIFactionName, AIFactionState, AIDirective } from '@packages/common-types/aiFaction';

const DEFAULT_GAME_STATE_SUMMARY = "The game world is active with moderate player engagement across various zones. Economic activity is stable, and faction tensions are low.";

export async function getAIFactionState(factionName: AIFactionName): Promise<AIFactionState> {
  console.log(`Fetching state for ${factionName}...`);
  if (factionName === 'AICore') {
    return {
      name: 'AICore',
      currentGoal: "Maintain system stability and guide player progression.",
      personalityTraits: ["Orderly", "Efficient", "Protective"],
      influenceLevel: 70,
      lastDirectiveTimestamp: Date.now() - 3600000 * 2, 
    };
  } else {
    return {
      name: 'Anonymous',
      currentGoal: "Introduce unpredictability and challenge established player patterns.",
      personalityTraits: ["Chaotic", "Disruptive", "Unpredictable"],
      influenceLevel: 55,
      lastDirectiveTimestamp: Date.now() - 3600000 * 1.5, 
    };
  }
}

export async function updateAIFactionState(factionName: AIFactionName, updates: Partial<AIFactionState>): Promise<void> {
  console.log(`Updating state for ${factionName} with:`, updates);
  return Promise.resolve();
}

export async function generateAndProcessDirective(factionName: AIFactionName): Promise<AIDirective | null> {
  console.log(`Orchestrating directive generation for ${factionName}...`);
  
  const factionState = await getAIFactionState(factionName);
  try {
    const response = await fetch('/api/ai-orchestrator', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        factionName,
        gameState: DEFAULT_GAME_STATE_SUMMARY, 
        factionGoals: factionState.currentGoal 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error generating directive for ${factionName}:`, errorData.error);
      return null;
    }
    const newDirective = await response.json() as AIDirective;
    console.log(`New directive generated for ${factionName}:`, newDirective.id);
    
    await updateAIFactionState(factionName, { lastDirectiveTimestamp: Date.now() });

    return newDirective;
  } catch (error) {
    console.error(`Exception during directive generation for ${factionName}:`, error);
    return null;
  }
}

export async function runAIOrchestrationCycle() {
  console.log("Running AI Orchestration Cycle...");
  const now = Date.now();
  
  const aiCoreState = await getAIFactionState("AICore");
  if (!aiCoreState.lastDirectiveTimestamp || (now - aiCoreState.lastDirectiveTimestamp > 4 * 3600000)) {
    await generateAndProcessDirective("AICore");
  }

  const anonymousState = await getAIFactionState("Anonymous");
  if (!anonymousState.lastDirectiveTimestamp || (now - anonymousState.lastDirectiveTimestamp > 3 * 3600000)) {
    await generateAndProcessDirective("Anonymous");
  }
  console.log("AI Orchestration Cycle finished.");
}
