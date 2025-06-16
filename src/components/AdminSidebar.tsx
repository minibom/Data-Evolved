// @/components/AdminSidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, Users, CalendarClock, BarChart3, Bot, ListChecks } from "lucide-react"; // Added ListChecks for AI Supervision
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const adminNavItems = [
  { href: "/admin", label: "Admin Dashboard", icon: Home },
  { href: "/admin/ai-supervision", label: "AI Supervision", icon: Bot }, // Changed icon to Bot
  { href: "/admin/ai-settings", label: "AI Settings", icon: Settings },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/events", label: "Event Management", icon: CalendarClock },
  { href: "/admin/zones", label: "Zone Management", icon: BarChart3 },
  // Add more admin links here as per the project structure
  // Example: { href: "/admin/logs", label: "System Logs", icon: FileText }, 
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-background p-4">
      <ScrollArea className="flex-1">
        <nav className="grid items-start gap-2">
          {adminNavItems.map((item) => (
            <Link key={item.label} href={item.href} legacyBehavior passHref>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                )}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4 text-center text-xs text-muted-foreground">
          Data Equilibrium v0.1
      </div>
    </aside>
  );
}
