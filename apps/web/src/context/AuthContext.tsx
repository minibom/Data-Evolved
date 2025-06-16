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
  setPersistence,
  browserLocalPersistence, // Or browserSessionPersistence
  type Auth asFirebaseAuthType // Renamed to avoid conflict
} from 'firebase/auth';
import { auth as firebaseAuthInstance } from '@/lib/firebaseClient'; // Import your Firebase auth instance
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile extends User { // Extend Firebase User type
  isAdmin?: boolean; 
  factionId?: string;
  ghz?: number;
  // Add other custom fields from your PlayerData type that you want readily available
}

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, pass: string, displayName: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  getFirebaseToken: () => Promise<string | null>;
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
    // Set persistence to local (keeps user signed in across browser sessions)
    // You can change this to browserSessionPersistence for session-only sign-in
    setPersistence(firebaseAuthInstance as FirebaseAuthType, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuthInstance as FirebaseAuthType, async (user) => {
          if (user) {
            const tokenResult = await user.getIdTokenResult();
            const isAdminClaim = !!tokenResult.claims.admin; // Check for 'admin' custom claim
            
            // You might fetch additional profile data from Firestore here
            // For example: const userProfileData = await fetch(`/api/user?userId=${user.uid}`).then(res => res.json());

            setCurrentUser({ 
              ...user, 
              isAdmin: isAdminClaim,
              // factionId: userProfileData?.factionId, // Example
              // ghz: userProfileData?.currentGHZ,     // Example
            });
          } else {
            setCurrentUser(null);
          }
          setLoading(false);
        });
        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Error setting auth persistence:", error);
        setLoading(false); // Still need to stop loading if persistence fails
      });
  }, []);

  const getFirebaseToken = async (): Promise<string | null> => {
    if (firebaseAuthInstance.currentUser) {
      return firebaseAuthInstance.currentUser.getIdToken(true); // true to force refresh
    }
    return null;
  };


  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(firebaseAuthInstance as FirebaseAuthType, email, pass);
  };

  const register = async (email: string, pass: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuthInstance as FirebaseAuthType, email, pass);
    if (userCredential.user) {
      await firebaseUpdateProfile(userCredential.user, { displayName });
      
      // After Firebase user is created, call API to create backend profile
      // This separates Auth user from your application's user profile data structure.
      try {
        const token = await userCredential.user.getIdToken();
        const profileResponse = await fetch('/api/auth/route', { // This is a bit of a misnomer if it's in route.ts, ensure it's the correct endpoint
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Send token for server-side validation
          },
          body: JSON.stringify({ 
            action: 'create_profile', 
            uid: userCredential.user.uid, 
            email: userCredential.user.email,
            displayName 
          }),
        });
        if (!profileResponse.ok) {
          const errorData = await profileResponse.json();
          console.error("Failed to create backend user profile:", errorData.error);
          toast({ title: "Profile Creation Issue", description: errorData.error || "Could not sync profile to backend.", variant: "destructive" });
          // Note: User is still created in Firebase Auth. Decide on handling this.
        }
      } catch (profileError) {
        console.error("Error creating backend user profile:", profileError);
        toast({ title: "Profile Sync Error", description: "Could not sync profile. Please contact support if issues persist.", variant: "destructive" });
      }
    }
  };

  const logout = async () => {
    await firebaseSignOut(firebaseAuthInstance as FirebaseAuthType);
    router.push('/auth/login'); 
  };

  const sendPasswordReset = async (email: string) => {
    await firebaseSendPasswordResetEmail(firebaseAuthInstance as FirebaseAuthType, email);
  };

  const value = {
    currentUser,
    loading,
    isAdmin: !!currentUser?.isAdmin,
    login,
    logout,
    register,
    sendPasswordReset,
    getFirebaseToken,
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
