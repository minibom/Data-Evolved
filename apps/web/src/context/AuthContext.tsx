// @/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { User, onAuthStateChanged } from 'firebase/auth'; // Uncomment when Firebase is integrated
// import { auth } from '@/lib/firebaseClient'; // Uncomment when Firebase is integrated

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin?: boolean; // Add admin role
}

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  isAdmin: boolean; // Convenience getter for admin status
  // login: (/* credentials */) => Promise<void>; // Placeholder
  // logout: () => Promise<void>; // Placeholder
  // register: (/* credentials */) => Promise<void>; // Placeholder
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

// Simple Loader2 icon (can be replaced with a more elaborate loading screen)
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

  useEffect(() => {
    // Placeholder: Simulate auth state loading and set a mock user
    const timer = setTimeout(() => {
      // To test admin views, you can set a mock admin user:
      // setCurrentUser({ uid: 'mock-admin-uid', email: 'admin@example.com', displayName: 'Admin User', isAdmin: true });
      // To test regular user views:
      setCurrentUser({ uid: 'mock-user-uid', email: 'user@example.com', displayName: 'Mock User', isAdmin: false });
      // To test unauthenticated views:
      // setCurrentUser(null); 
      setLoading(false);
    }, 1000);

    // Real Firebase integration:
    // const unsubscribe = onAuthStateChanged(auth, async (user) => {
    //   if (user) {
    //     // Here you might fetch additional user profile data, including roles
    //     // For example, check a 'roles' collection in Firestore or a custom claim
    //     const tokenResult = await user.getIdTokenResult();
    //     const isAdmin = !!tokenResult.claims.admin; // Example: admin custom claim
    //     setCurrentUser({ 
    //       uid: user.uid, 
    //       email: user.email, 
    //       displayName: user.displayName,
    //       isAdmin 
    //     });
    //   } else {
    //     setCurrentUser(null);
    //   }
    //   setLoading(false);
    // });
    // return () => unsubscribe();
     return () => clearTimeout(timer);
  }, []);

  const value = {
    currentUser,
    loading,
    isAdmin: !!currentUser?.isAdmin, // Check if user is admin
    // Implement login, logout, register functions here
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {/* You can show a global loader here while auth state is resolving */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-background z-[9999]">
          {/* Replace with your actual global loader component if you have one */}
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}
    </AuthContext.Provider>
  );
}

    