// @/components/AppHeader.tsx
"use client";

import Link from "next/link";
import { Zap, LayoutDashboard, Settings, Home, BotMessageSquare, LogIn, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth, type UserProfile } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const navItems = [
  { href: "/", label: "Home", icon: Home, public: true },
  { href: "/game", label: "Game Client", icon: Zap, public: false }, 
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, public: false }, 
  { href: "/admin", label: "Admin Panel", icon: Settings, public: false, adminOnly: true },
];

export default function AppHeader() {
  const pathname = usePathname();
  const { currentUser, logout, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      // router.push('/auth/login'); // AuthContext logout already handles this
    } catch (error) {
      console.error("Logout failed", error);
      // Handle logout error (e.g., show toast)
    }
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return "DE"; // Data Entity
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BotMessageSquare className="h-8 w-8 text-primary" />
          <span className="font-bold font-headline sm:inline-block text-lg">
            Data Equilibrium
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-1 sm:space-x-2 lg:space-x-4">
          {navItems.map((item) => {
            if (!item.public && !currentUser) return null;
            if (item.adminOnly && !isAdmin) return null;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  (pathname.startsWith(item.href) && item.href !== "/" || pathname === item.href)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Button variant="ghost" className="px-2 sm:px-3">
                  <item.icon className="h-5 w-5 mr-0 sm:mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
        
        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  {currentUser.photoURL && <AvatarImage src={currentUser.photoURL} alt={currentUser.displayName || "User"} />}
                  <AvatarFallback>{getInitials(currentUser.displayName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{currentUser.displayName || "Data Entity"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={() => router.push('/admin')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin Panel</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" size="sm" className="ml-auto" asChild>
            <Link href="/auth/login">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
