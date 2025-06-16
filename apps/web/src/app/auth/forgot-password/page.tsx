// src/app/auth/forgot-password/page.tsx
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Mail } from 'lucide-react'; // Added icon

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    // Placeholder for forgot password logic
    console.log("Forgot password attempt for:", email);
    // In a real app, call Firebase Auth:
    // try {
    //   await sendPasswordResetEmail(auth, email);
    //   setMessage("If an account exists for " + email + ", a password reset link has been sent.");
    // } catch (err: any) {
    //   setError(err.message || "Failed to send reset email.");
    // }
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    setMessage("Password reset functionality is simulated. In a real app, an email would be sent if the account exists.");
    // setError("Forgot password functionality is not yet implemented.");
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <Mail className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-3xl font-bold font-headline text-primary">Reset Password</CardTitle>
          <CardDescription>Enter your email to receive a password reset link to reclaim your Data Entity.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email-forgot">Email Address</Label>
              <Input
                id="email-forgot"
                type="email"
                placeholder="entity@nexus.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/70"
              />
            </div>
            {message && <p className="text-sm text-green-600 dark:text-green-400 p-2 bg-green-500/10 rounded-md">{message}</p>}
            {error && <p className="text-sm text-destructive p-2 bg-destructive/10 rounded-md">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center text-sm">
          <p className="text-muted-foreground">
            Remembered your password?{' '}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
