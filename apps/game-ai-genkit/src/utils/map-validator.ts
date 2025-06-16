// apps/game-ai-genkit/src/utils/map-validator.ts
/**
 * This file can contain utility functions specifically for validating map data
 * within the context of the AI flows in the `game-ai-genkit` application.
 * It might have different or more specialized validation logic than the
 * `map-validator.ts` in `apps/web/src/lib/` which is used by the API route.
 *
 * For example, this validator might focus on aspects relevant to the AI's
 * generation process itself, or check for adherence to AI-specific constraints.
 */

import type { GeneratedMapData } from '@packages/common-types/map';

interface AIValidationResult {
  isValid: boolean;
  feedbackForAI?: string[]; // Feedback specifically for the AI to improve next generation
  errors?: string[]; // Hard errors
}

export async function validateAIMapData(mapData: GeneratedMapData): Promise<AIValidationResult> {
  const feedback: string[] = [];
  const errors: string[] = [];

  // Example: Check if the AI followed specific instructions regarding themes or features
  if (mapData.generationParams?.theme && mapData.theme !== mapData.generationParams.theme) {
    feedback.push(`AI did not adhere to the requested theme. Requested: ${mapData.generationParams.theme}, Got: ${mapData.theme}.`);
  }

  if (mapData.generationParams?.requiredFeatures && mapData.generationParams.requiredFeatures.length > 0) {
    const missingFeatures = mapData.generationParams.requiredFeatures.filter(
      (feature) => !mapData.mapNotes?.toLowerCase().includes(feature.toLowerCase()) &&
                   !(mapData.entities || []).some(e => e.type.toLowerCase().includes(feature.toLowerCase()))
    );
    if (missingFeatures.length > 0) {
      feedback.push(`AI missed required features: ${missingFeatures.join(', ')}. Ensure mapNotes or entity types reflect these.`);
    }
  }
  
  // Example: Check for logical consistency only relevant to AI generation process
  if ((mapData.entities?.length || 0) < 1 && mapData.generationParams?.enemyDensity !== 'low') {
      feedback.push("Map has too few entities for the requested enemy density. Consider adding more appropriate enemy spawns.");
  }
  if (mapData.size.width * mapData.size.height > 2500 && (mapData.entryPoints?.length || 0) < 2) {
      feedback.push("For a large map, consider adding more than one entry point for better player distribution.");
  }


  // Add more AI-specific validation logic here...

  if (errors.length > 0) {
    return { isValid: false, errors, feedback };
  }

  return { isValid: true, feedback: feedback.length > 0 ? feedback : undefined };
}

console.log("AI-specific Map Validator (apps/game-ai-genkit/src/utils/map-validator.ts) loaded.");
