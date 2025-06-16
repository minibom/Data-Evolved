// @/components/auth/RegisterForm.tsx
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
// import { useAuth } from '@/context/AuthContext'; // Or a specific auth hook
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // const { register } = useAuth(); // Placeholder
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast({ title: "Registration Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setError('');
    setLoading(true);
    console.log("RegisterForm: Attempting registration for", { email, displayName });
    
    // try {
    //   const response = await fetch('/api/auth', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ action: 'register', email, password, displayName }),
    //   });
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.error || 'Registration failed');
    //   }
    //   // const data = await response.json();
    //   // await register(email, password, displayName); // This would handle setting user in context
    //   toast({ title: "Registration Successful", description: "Redirecting to character creation..." });
    //   router.push('/character-creation'); 
    // } catch (err: any) {
    //   setError(err.message || 'Failed to register. Please try again.');
    //   toast({ title: "Registration Failed", description: err.message, variant: "destructive" });
    // } finally {
    //   setLoading(false);
    // }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    const mockError = "Registration functionality is simulated. Use mock auth in AuthContext.";
    setError(mockError);
    toast({ title: "Registration Simulated", description: mockError, variant: "destructive" });
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold font-headline text-primary">Create your Data Entity</CardTitle>
        <CardDescription>Join the Quantum Nexus and begin your evolution.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName-register">Entity Name</Label>
            <Input
              id="displayName-register"
              type="text"
              placeholder="YourUniqueHandle"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="bg-background/70"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-register">Email</Label>
            <Input
              id="email-register"
              type="email"
              placeholder="new-entity@nexus.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/70"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-register">Password</Label>
            <Input
              id="password-register"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background/70"
              minLength={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword-register">Confirm Password</Label>
            <Input
              id="confirmPassword-register"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-background/70"
              minLength={6}
            />
          </div>
          {error && <p className="text-sm text-destructive p-2 bg-destructive/10 rounded-md">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Initializing Entity...' : 'Register'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm">
        <p className="text-muted-foreground">
          Already have an entity?{' '}
          <Link href="/auth/login" className="text-primary hover:underline">
            Login here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
