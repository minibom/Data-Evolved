// src/app/shop/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop - Data Evolved',
  description: 'Purchase items and gear.',
};

export default function ShopLayout({
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
