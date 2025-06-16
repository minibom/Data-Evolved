// src/app/game/layout.tsx
import type { Metadata } from 'next';
// import { headers } from 'next/headers'; // For session cookie check

export const metadata: Metadata = {
  title: 'Data Evolved - Game',
  description: 'Enter the Quantum Nexus.',
};

export default async function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Placeholder for session/auth check
  // const session = headers().get('cookie')?.includes('session-token'); // Example
  // if (!session) {
  //   redirect('/auth/login?callbackUrl=/game');
  // }
  // console.log("Game layout: User is authenticated (placeholder).");

  return (
    <div className="h-full w-full">
      {children}
    </div>
  );
}
