// src/app/admin/users/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold font-headline">User Management</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View, edit, and manage user accounts and roles.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">User list and management tools will be displayed here.</p>
          {/* Placeholder for a table or list of users */}
        </CardContent>
      </Card>
    </div>
  );
}
