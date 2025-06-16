// src/app/api/genkit/[...routes]/route.ts
import { genkitNextJSHandler } from '@genkit-ai/next';
import '@/ai/dev'; // This should import and register your flows

export const POST = genkitNextJSHandler();
export const GET = genkitNextJSHandler(); // Also handle GET if your flows support it or for discovery
export const PUT = genkitNextJSHandler();
export const DELETE = genkitNextJSHandler();

// Note: Ensure your flows are correctly imported and registered in src/ai/dev.ts
// or any other file that configures genkit.
// The genkitNextJSHandler will automatically expose flows that are defined.
