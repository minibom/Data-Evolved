// apps/game-ai-genkit/genkit.ts
/**
 * This file configures the Genkit instance specifically for the game-ai-genkit application.
 * It could define plugins, models, and other settings relevant to the AI flows.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
// import { firebase } from '@genkit-ai/firebase'; // If using Firebase for flow state within this app

console.log("Configuring Genkit instance for game-ai-genkit app...");

// This is the primary AI instance for flows within this 'game-ai-genkit' app.
// It can be configured independently of the Genkit setup in `apps/web/src/ai/genkit.ts`
// if they serve different purposes or use different models/plugins.
// However, to keep things consistent, it's often good to share a similar core configuration.

// For now, let's mirror the main AI config if this app is meant to be the primary host for flows.
export const ai = genkit({
  plugins: [
    googleAI(), // Ensure API keys are managed (e.g., via .env)
    // firebase(), // Example if using Firebase for flow state, traces specific to these flows
  ],
  // flowStateStore: 'firebase', // Example
  // traceStore: 'firebase',     // Example
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

console.log("Genkit instance for game-ai-genkit configured.");
