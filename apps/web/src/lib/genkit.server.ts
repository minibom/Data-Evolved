// src/lib/genkit.server.ts
/**
 * This file is intended for server-side setup of Genkit, particularly
 * for defining and exporting Genkit flows that will be made available
 * via the Genkit developer UI or API endpoints (e.g., /api/genkit/...).
 *
 * The actual flow definitions (using `ai.defineFlow`, `ai.definePrompt`)
 * should reside in their respective files under `apps/game-ai-genkit/src/flows/`.
 * This file would then import those flows to ensure they are registered
 * with the Genkit instance when the server starts or when Genkit tools
 * (like `genkit start`) are run.
 */

// Import all your flows here to register them with Genkit.
// This ensures that when `genkit start` is run, or when the Genkit API route
// handler is invoked, these flows are known to the system.

import '@game-ai-flows/ai-core-directive';
import '@game-ai-flows/anonymous-directive';
import '@game-ai-flows/combatStrategy';
import '@game-ai-flows/dynamicQuest';
import '@game-ai-flows/errorEntitySpawner';
import '@game-ai-flows/mapGenerator';
import '@game-ai-flows/narrativeWeaver';
import '@game-ai-flows/npcDialogue';
import '@game-ai-flows/quantumRealmGenerator';
import '@game-ai-flows/strategicIntel';
import '@game-ai-flows/worldEventGenerator';
import '@game-ai-flows/aiTuner';
import '@game-ai-flows/aiGovernance';
import '@game-ai-flows/gameBalancer'; // Assuming you create this flow

// You might also configure the main `ai` instance here if it's not done in a separate file
// like `src/ai/genkit.ts` or `src/lib/genkit.config.ts`.
// However, usually, one central `ai` instance is created and then flows are defined using it.
// The key is that importing the flow files (like above) executes their `ai.defineFlow` calls.

console.log("Genkit Server Setup (apps/web/src/lib/genkit.server.ts): All flows imported from @game-ai-flows and should be registered.");

// This file doesn't typically export anything itself. Its purpose is to be executed
// (e.g., by `genkit start --tsx apps/web/src/lib/genkit.server.ts` or imported by `apps/web/src/ai/dev.ts`)
// to ensure all flow definitions are run.

// If you are using the `genkitNextJSHandler` in `/api/genkit/[...routes]/route.ts`,
// you need to make sure that `apps/web/src/ai/dev.ts` (or similar entry point
// for Genkit in a Next.js context) imports these flows, or imports this
// `genkit.server.ts` file. The current `apps/web/src/ai/dev.ts` already imports the flows directly using the new alias.
