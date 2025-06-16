// @/components/auth/LoginForm.tsx
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
// import { useAuth } from '@/context/AuthContext'; // Or a specific auth hook
import { useRouter, useSearchParams } from 'next/navigation'; // For redirect
import { useToast } from '@/hooks/use-toast'; // For showing errors

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // const { login } = useAuth(); // Placeholder
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log("LoginForm: Attempting login with", { email, password });
    // Placeholder for actual login API call
    // try {
    //   const response = await fetch('/api/auth', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ action: 'login', email, password }),
    //   });
    //   if (!response.ok) {
    //       const errorData = await response.json();
    //       throw new Error(errorData.error || 'Login failed');
    //   }
    //   // Call context login if needed to set user state
    //   // await login(email, password); // This would typically handle setting user in context
    //   toast({ title: "Login Successful", description: "Redirecting..." });
    //   router.push(callbackUrl);
    // } catch (err: any) {
    //   setError(err.message || 'Failed to login. Please check your credentials.');
    //   toast({ title: "Login Failed", description: err.message, variant: "destructive" });
    // } finally {
    //   setLoading(false);
    // }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    const mockError = "Login functionality is simulated. Use mock auth in AuthContext.";
    setError(mockError);
    toast({ title: "Login Simulated", description: mockError, variant: "destructive" });
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold font-headline text-primary">Login to Data Equilibrium</CardTitle>
        <CardDescription>Access your Data Entity and shape the Quantum Nexus.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email-login">Email</Label>
            <Input
              id="email-login"
              type="email"
              placeholder="entity@nexus.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/70"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-login">Password</Label>
            <Input
              id="password-login"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background/70"
            />
          </div>
          {error && <p className="text-sm text-destructive p-2 bg-destructive/10 rounded-md">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Authenticating...' : 'Login'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2 text-sm">
        <Link href="/auth/forgot-password" className="text-primary hover:underline">
          Forgot password?
        </Link>
        <p className="text-muted-foreground">
          No account?{' '}
          <Link href="/auth/register" className="text-primary hover:underline">
            Register here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
