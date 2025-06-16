// src/app/dashboard/layout.tsx
import type { Metadata } from 'next';
// import { useAuth } from '@/context/AuthContext'; // Or server-side session check
// import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Player Dashboard - Data Evolved',
  description: 'Manage your Data Entity profile and progress.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Placeholder for authentication check
  // const { currentUser, loading } = useAuth();
  // if (loading) return <div>Loading dashboard...</div>; // Or a proper loader
  // if (!currentUser) {
  //   redirect('/auth/login?callbackUrl=/dashboard');
  // }
  // console.log("Dashboard layout: User is authenticated (placeholder).");

  return (
    <section className="bg-muted/20 min-h-full">
      {/* Add dashboard-specific navigation or sidebar here if needed */}
      {children}
    </section>
  );
}
