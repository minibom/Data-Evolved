// @/hooks/useAuth.ts
"use client"; // Ensure this hook can be used in Client Components

import { useContext } from 'react';
// The AuthContext will be defined in @/context/AuthContext.tsx
// For now, we just re-export the useAuth function from there for structure.
// This file might be redundant if AuthContext.tsx exports useAuth directly,
// but it's good for maintaining the proposed structure.

import { AuthContext } from '@/context/AuthContext'; // Assuming AuthContext is the named export of the context object itself.

// Re-define or re-export useAuth from the context file.
// For simplicity, directly using the one from context is fine.
// This file becomes more useful if you add more logic to the hook itself.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
