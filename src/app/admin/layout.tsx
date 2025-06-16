// @/app/admin/layout.tsx
import { AdminSidebar } from "@/components/AdminSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Add role-based access control here in a real app
  // For example, check if user is admin, otherwise redirect or show an error.

  return (
    <div className="flex h-[calc(100vh-4rem)]"> {/* Adjust height if header height changes */}
      <AdminSidebar />
      <ScrollArea className="flex-1 p-6 bg-muted/30">
         {children}
      </ScrollArea>
    </div>
  );
}
