// apps/game-ai-genkit/src/index.ts
/**
 * This is the main entry point for the game-ai-genkit application if it were to be run
 * independently or as a separate Genkit service.
 * It should import all flows to ensure they are registered with the Genkit instance
 * defined in `apps/game-ai-genkit/genkit.ts`.
 */

import { config } from 'dotenv';
config({ path: '../../.env' }); // Load .env from the root if this app is run from its own directory

// Import all Genkit flows to register them
import './flows/ai-core-directive';
import './flows/anonymous-directive';
import './flows/combatStrategy';
import './flows/dynamicQuest';
import './flows/errorEntitySpawner';
import './flows/mapGenerator';
import './flows/narrativeWeaver';
import './flows/npcDialogue';
import './flows/quantumRealmGenerator';
import './flows/strategicIntel';
import './flows/worldEventGenerator';
import './flows/aiTuner';
import './flows/aiGovernance';
import './flows/gameBalancer';

console.log("game-ai-genkit main entry point: All flows imported and registered.");

// This file might not export anything itself if its sole purpose is to register flows
// when `genkit start --tsx apps/game-ai-genkit/src/index.ts` is run.
