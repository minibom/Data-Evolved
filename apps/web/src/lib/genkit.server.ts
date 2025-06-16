// src/lib/genkit.server.ts
/**
 * This file is intended for server-side setup of Genkit, particularly
 * for defining and exporting Genkit flows that will be made available
 * via the Genkit developer UI or API endpoints (e.g., /api/genkit/...).
 *
 * The actual flow definitions (using `ai.defineFlow`, `ai.definePrompt`)
 * should reside in their respective files under `src/flows/`.
 * This file would then import those flows to ensure they are registered
 * with the Genkit instance when the server starts or when Genkit tools
 * (like `genkit start`) are run.
 */

// Import all your flows here to register them with Genkit.
// This ensures that when `genkit start` is run, or when the Genkit API route
// handler is invoked, these flows are known to the system.

import '@/flows/ai-core-directive';
import '@/flows/anonymous-directive';
import '@/flows/combatStrategy';
import '@/flows/dynamicQuest';
import '@/flows/errorEntitySpawner';
import '@/flows/mapGenerator';
import '@/flows/narrativeWeaver';
import '@/flows/npcDialogue';
import '@/flows/quantumRealmGenerator';
import '@/flows/strategicIntel';
import '@/flows/worldEventGenerator';
import '@/flows/aiTuner';
import '@/flows/aiGovernance';
import '@/flows/gameBalancer'; // Assuming you create this flow

// You might also configure the main `ai` instance here if it's not done in a separate file
// like `src/ai/genkit.ts` or `src/lib/genkit.config.ts`.
// However, usually, one central `ai` instance is created and then flows are defined using it.
// The key is that importing the flow files (like above) executes their `ai.defineFlow` calls.

console.log("Genkit Server Setup (src/lib/genkit.server.ts): All flows imported and should be registered.");

// This file doesn't typically export anything itself. Its purpose is to be executed
// (e.g., by `genkit start --tsx src/lib/genkit.server.ts` or imported by `src/ai/dev.ts`)
// to ensure all flow definitions are run.

// If you are using the `genkitNextJSHandler` in `/api/genkit/[...routes]/route.ts`,
// you need to make sure that the `src/ai/dev.ts` file (or similar entry point
// for Genkit in a Next.js context) imports these flows, or imports this
// `genkit.server.ts` file. The current `src/ai/dev.ts` already imports the flows directly.
