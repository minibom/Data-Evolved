// @/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  type Auth
} from 'firebase/auth';
import { auth } from '@/lib/firebaseClient'; // Import your Firebase auth instance
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile extends User { // Extend Firebase User type
  isAdmin?: boolean; 
  // Add other custom fields you might store with the user, e.g., factionId, ghz
  factionId?: string;
  ghz?: number;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, pass: string, displayName: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

const Loader2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth as Auth, async (user) => {
      if (user) {
        // User is signed in
        // You can fetch custom claims or user profile data from Firestore here
        // For isAdmin, this usually comes from custom claims set on the backend
        // Or you fetch a user profile document from Firestore
        const tokenResult = await user.getIdTokenResult();
        const isAdminClaim = !!tokenResult.claims.admin; // Example custom claim
        
        setCurrentUser({ 
          ...user, // Spread all properties from Firebase User object
          isAdmin: isAdminClaim 
          // Add other custom fields from your UserProfile type if fetched
        });
      } else {
        // User is signed out
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth as Auth, email, pass);
    // onAuthStateChanged will handle setting currentUser
  };

  const register = async (email: string, pass: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, pass);
    if (userCredential.user) {
      await firebaseUpdateProfile(userCredential.user, { displayName });
      // Update local state or let onAuthStateChanged handle it
      // This is also a good place to create a user profile document in Firestore
      // e.g., call an API route: await fetch('/api/user/profile', { method: 'POST', body: JSON.stringify({ uid: userCredential.user.uid, email, displayName }) });
    }
    // onAuthStateChanged will handle setting currentUser
  };

  const logout = async () => {
    await firebaseSignOut(auth as Auth);
    // onAuthStateChanged will handle setting currentUser to null
    router.push('/auth/login'); // Redirect to login after logout
  };

  const sendPasswordReset = async (email: string) => {
    await firebaseSendPasswordResetEmail(auth as Auth, email);
  };

  const value = {
    currentUser,
    loading,
    isAdmin: !!currentUser?.isAdmin,
    login,
    logout,
    register,
    sendPasswordReset,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-background z-[9999]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}
    </AuthContext.Provider>
  );
}
