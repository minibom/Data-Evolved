// @/app/admin/ai-supervision/page.tsx
"use client"; // This page requires client-side interactivity for fetching and managing directives

import AIDirectivesList from '@/components/AIDirectivesList';

export default function AISupervisionPage() {
  return (
    <div className="container mx-auto py-2 px-0 sm:px-4"> {/* Adjusted padding for better fit in admin layout */}
      <AIDirectivesList />
    </div>
  );
}
