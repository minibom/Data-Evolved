// @/app/(auth)/login/page.tsx
"use client";

import LoginForm from "@/components/auth/LoginForm"; // Placeholder for actual form component

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/50 p-4">
      {/* 
        This page will host the LoginForm component.
        It's responsible for the overall layout of the login screen.
      */}
      <LoginForm />
    </div>
  );
}
