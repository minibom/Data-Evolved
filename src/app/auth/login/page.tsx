"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
// import { useAuth } from '@/context/AuthContext'; // Or a specific auth hook
// import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // const { login } = useAuth(); // Placeholder for login function
  // const router = useRouter();
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    // try {
    //   await login(email, password); // Placeholder
    //   router.push(callbackUrl);
    // } catch (err: any) {
    //   setError(err.message || 'Failed to login. Please check your credentials.');
    // } finally {
    //   setLoading(false);
    // }
    console.log("Login attempt with:", { email, password });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setError("Login functionality is not yet implemented."); // Mock error
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-headline text-primary">Login to Data Evolved</CardTitle>
          <CardDescription>Access your Data Entity and shape the Quantum Nexus.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="entity@nexus.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/70"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background/70"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Authenticating...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 text-sm">
          <Link href="/auth/forgot-password" legacyBehavior>
            <a className="text-primary hover:underline">Forgot password?</a>
          </Link>
          <p className="text-muted-foreground">
            No account?{' '}
            <Link href="/auth/register" legacyBehavior>
              <a className="text-primary hover:underline">Register here</a>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
