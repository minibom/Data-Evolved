// @/components/AppHeader.tsx
"use client";

import Link from "next/link";
import { Zap, ShieldHalf, Settings, Home, BotMessageSquare, LayoutDashboard } from "lucide-react"; // Added BotMessageSquare, LayoutDashboard
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/game", label: "Game Client", icon: Zap }, 
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }, 
  { href: "/admin", label: "Admin Panel", icon: Settings },
];

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BotMessageSquare className="h-8 w-8 text-primary" /> {/* Updated Icon */}
          <span className="font-bold font-headline sm:inline-block text-lg">
            Data Equilibrium
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-1 sm:space-x-2 lg:space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname.startsWith(item.href) && item.href !== "/" || pathname === item.href 
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Button variant="ghost" className="px-2 sm:px-3">
                <item.icon className="h-5 w-5 mr-0 sm:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>
        {/* Add User/Auth button here later */}
        <Button variant="outline" size="sm" className="ml-auto">Login (Placeholder)</Button>
      </div>
    </header>
  );
}
