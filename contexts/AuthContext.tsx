'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => { },
  signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // If user is signed in and analytics consent was granted, load analytics lazily
  useEffect(() => {
    if (!user) return;
    if (typeof window === 'undefined') return;

    try {
      const consent = window.localStorage.getItem('analytics_consent');
      if (consent === 'granted') {
        (async () => {
          try {
            const mod = await import('../lib/firebase');
            if (mod && typeof mod.loadAnalytics === 'function') {
              await mod.loadAnalytics();
            }
          } catch (err) {
            console.warn('Failed to load analytics after sign-in', err);
          }
        })();
      }
    } catch (e) {
      // ignore access errors to localStorage
    }
  }, [user]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
