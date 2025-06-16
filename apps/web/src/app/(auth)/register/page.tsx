// @/app/(auth)/register/page.tsx
"use client";

import RegisterForm from "@/components/auth/RegisterForm"; // Placeholder for actual form component

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/50 p-4">
      {/* 
        This page will host the RegisterForm component.
        It's responsible for the overall layout of the registration screen.
      */}
      <RegisterForm />
    </div>
  );
}
