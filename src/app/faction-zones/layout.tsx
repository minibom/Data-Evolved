// src/app/faction-zones/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Faction Zones - Data Evolved',
  description: 'Manage and view faction-controlled zones.',
};

export default function FactionZonesLayout({
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
