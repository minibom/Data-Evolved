// packages/common-types/aiTypes.ts
// This file is a general placeholder for AI-related types that might not fit
// specifically into aiFlowTypes.ts, aiFaction.ts, or aiConfig.ts.
// For example, it could contain types for:
// - AI behavior trees or state machines if you model AI agents that way.
// - Metrics collected for AI performance analysis.
// - Complex input/output structures for highly specialized AI flows.

export interface AIBaseInput {
  timestamp: string; // ISO date string for when the input was generated
  correlationId?: string; // For tracking a request through multiple AI systems
}

export interface AIBaseOutput {
  modelUsed?: string; // Which LLM or AI model generated this output
  confidence?: number; // 0-1 confidence score if applicable
  latencyMs?: number; // Time taken to generate the output
}

// Example: Type for an AI-generated enemy description
export interface AIGeneratedEnemyProfile extends AIBaseOutput {
  name: string;
  lore: string;
  suggestedAbilities: string[];
  visualConcept?: string; // Text description for an image generation AI
}

console.log("Common AI general types (packages/common-types/aiTypes.ts) loaded.");
// As of now, most specific AI types are in aiFlowTypes.ts, aiFaction.ts, and aiConfig.ts.
// This file can be expanded as more general AI types are needed.
