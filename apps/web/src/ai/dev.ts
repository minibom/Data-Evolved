import { config } from 'dotenv';
config();

// This file is the entry point for the Genkit development server
// when running with `genkit start --tsx src/ai/dev.ts`.
// It needs to import all flows that should be discoverable by Genkit.

import '@game-ai-flows/anonymous-directive';
import '@game-ai-flows/ai-core-directive';
import '@game-ai-flows/npcDialogue';
import '@game-ai-flows/dynamicQuest';
import '@game-ai-flows/combatStrategy';
import '@game-ai-flows/worldEventGenerator';
import '@game-ai-flows/aiTuner';
import '@game-ai-flows/narrativeWeaver';
import '@game-ai-flows/aiGovernance';
import '@game-ai-flows/quantumRealmGenerator';
import '@game-ai-flows/errorEntitySpawner';
import '@game-ai-flows/strategicIntel';
import '@game-ai-flows/mapGenerator';
import '@game-ai-flows/gameBalancer'; // Assuming this flow was added
// Add other flow imports here

console.log("Genkit development server entry point (apps/web/src/ai/dev.ts): All flows imported from @game-ai-flows.");
