// @/components/auth/RegisterForm.tsx
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Loader2 } from 'lucide-react';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast({ title: "Registration Error", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      toast({ title: "Registration Error", description: "Password must be at least 6 characters long.", variant: "destructive" });
      return;
    }
    if (!displayName.trim()) {
        setError("Entity Name is required.");
        toast({ title: "Registration Error", description: "Entity Name is required.", variant: "destructive" });
        return;
    }

    setError('');
    setLoading(true);
    
    try {
      await register(email, password, displayName);
      toast({ title: "Registration Successful", description: "Your Data Entity is manifesting... Redirecting to Character Creation." });
      router.push('/character-creation'); 
    } catch (err: any) {
      console.error("Registration error:", err);
      let friendlyMessage = 'Failed to register. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email is already associated with a Data Entity.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'The email address is not valid.';
      }
      setError(friendlyMessage);
      toast({ title: "Registration Failed", description: friendlyMessage, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center space-y-2">
        <UserPlus className="mx-auto h-12 w-12 text-primary" />
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
              autoComplete="email"
              className="bg-background/70"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-register">Password (min. 6 characters)</Label>
            <Input
              id="password-register"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background/70"
              minLength={6}
              autoComplete="new-password"
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
              autoComplete="new-password"
            />
          </div>
          {error && <p className="text-sm text-destructive p-2 bg-destructive/10 rounded-md">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
