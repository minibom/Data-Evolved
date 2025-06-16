// @/components/AppHeader.tsx
"use client";

import Link from "next/link";
import { Zap, ShieldHalf, Settings, Home, BotMessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/game", label: "Game", icon: Zap }, // Placeholder, assuming /game route later
  { href: "/dashboard", label: "Dashboard", icon: ShieldHalf }, // Placeholder
  { href: "/admin", label: "Admin Panel", icon: Settings },
];

export default function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BotMessageSquare className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline sm:inline-block text-lg">
            Data Equilibrium
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4 lg:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Button variant="ghost" className="px-2 sm:px-4">
                <item.icon className="h-4 w-4 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>
        {/* Add User/Auth button here later */}
      </div>
    </header>
  );
}
