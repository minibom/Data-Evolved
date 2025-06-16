import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Settings, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold font-headline text-primary">Admin Dashboard</h1>
      <p className="text-lg text-muted-foreground">
        Welcome to the control center for Data Equilibrium. Monitor game state, manage users, and supervise AI behavior.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Link href="/admin/ai-supervision" className="block hover:no-underline">
          <Card className="hover:border-primary transition-colors duration-200 shadow-md hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-headline">AI Supervision</CardTitle>
              <Bot className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitor and manage directives from AI Core and Anonymous.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/ai-settings" className="block hover:no-underline">
          <Card className="hover:border-primary transition-colors duration-200 shadow-md hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-headline">AI Settings</CardTitle>
              <Settings className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Adjust parameters for AI behavior and game dynamics.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users" className="block hover:no-underline">
          <Card className="hover:border-primary transition-colors duration-200 shadow-md hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-headline">User Management</CardTitle>
              <Users className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage player accounts and roles.
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/zones" className="block hover:no-underline">
          <Card className="hover:border-primary transition-colors duration-200 shadow-md hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-headline">Zone Management</CardTitle>
              <BarChart3 className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Oversee game zones, their status, and ongoing events.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Placeholder for future charts or real-time data */}
      <Card className="mt-8 shadow-md">
        <CardHeader>
          <CardTitle className="font-headline">System Overview</CardTitle>
          <CardDescription>High-level metrics and game health status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
            <p>System monitoring data will be displayed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
