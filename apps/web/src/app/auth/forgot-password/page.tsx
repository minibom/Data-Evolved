// src/app/auth/forgot-password/page.tsx
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendPasswordReset } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setMessage("If an account exists for " + email + ", a password reset link has been sent. Please check your inbox (and spam folder).");
      toast({ title: "Password Reset Email Sent", description: "Check your email for instructions." });
    } catch (err: any) {
      console.error("Password reset error:", err);
      let friendlyMessage = "Failed to send password reset email. Please try again.";
      if (err.code === 'auth/invalid-email') {
        friendlyMessage = "The email address is not valid.";
      } else if (err.code === 'auth/user-not-found') {
        // We typically don't want to reveal if an email exists or not for security reasons
        // So, we show a generic message for user-not-found as well.
         setMessage("If an account exists for " + email + ", a password reset link has been sent.");
      }
      setError(friendlyMessage);
      if (err.code !== 'auth/user-not-found') { // Don't toast error for user-not-found, use message instead
        toast({ title: "Password Reset Error", description: friendlyMessage, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
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
                autoComplete="email"
                className="bg-background/70"
              />
            </div>
            {message && <p className="text-sm text-green-600 dark:text-green-400 p-3 bg-green-500/10 rounded-md border border-green-500/30">{message}</p>}
            {error && !message && <p className="text-sm text-destructive p-3 bg-destructive/10 rounded-md border border-destructive/30">{error}</p>} {/* Show error only if no success message */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
