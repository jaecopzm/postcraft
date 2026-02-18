'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => { },
  signInWithEmail: async () => { },
  signUpWithEmail: async () => { },
  resendVerificationEmail: async () => { },
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

  const signInWithGoogle = async () => {
    try {
      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Sign-in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    try {
      if (cred.user) {
        const { sendEmailVerification } = await import('firebase/auth');
        await sendEmailVerification(cred.user);
      }
    } catch (err) {
      console.error('Failed to send verification email', err);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No authenticated user');
      const { sendEmailVerification } = await import('firebase/auth');
      await sendEmailVerification(currentUser);
    } catch (err) {
      console.error('Resend verification failed', err);
      throw err;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, resendVerificationEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
