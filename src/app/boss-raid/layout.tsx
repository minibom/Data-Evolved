// src/app/boss-raid/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boss Raids - Data Evolved',
  description: 'Team up to defeat powerful world bosses.',
};

export default function BossRaidLayout({
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
