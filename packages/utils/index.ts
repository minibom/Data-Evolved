// packages/utils/index.ts
// Shared utility functions that can be used across different packages (e.g., web app, game client, services).

export function formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return dateObj.toLocaleDateString(undefined, options);
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateSimpleId(length: number = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

// Add more general-purpose utilities here as needed.
// For example: data validation helpers, string manipulation, math utilities not specific to game logic.

console.log("Shared utilities (packages/utils/index.ts) loaded.");
