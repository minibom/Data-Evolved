// src/app/guild/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guilds - Data Evolved',
  description: 'Join or manage your Faction Hub / Guild.',
};

export default function GuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="bg-muted/20 min-h-full">
      {children}
    </section>
  );
}
