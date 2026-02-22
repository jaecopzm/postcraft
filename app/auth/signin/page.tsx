'use client';

import { useAuth } from '../../contexts/AuthContext';
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignIn() {
  const { user, loading, signInWithGoogle, signInWithEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-10 w-10 border-2 border-primary/20 border-t-primary"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8 relative overflow-hidden font-sans">
      {/* Background glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] pointer-events-none rounded-full translate-x-1/2 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] pointer-events-none rounded-full -translate-x-1/2 translate-y-1/3" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="glass-card rounded-2xl p-6 border-gray-200 shadow-2xl relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 premium-gradient rounded-xl shadow-lg shadow-primary/20 shrink-0">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 tracking-widest uppercase leading-none">DraftRapid</h1>
              <p className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5">Intelligence for creators</p>
            </div>
          </div>

          <h2 className="text-xl font-black text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-400 text-sm mb-5">Sign in to your account</p>

          {/* Error */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google button — first, more prominent */}
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-black font-bold py-3 px-5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2.5 mb-4 text-sm hover:bg-white/90 active:scale-95"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-black/20 border-t-black" />
            ) : (
              <>
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/8" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-[#17171B] text-gray-300 text-[11px] font-semibold tracking-widest uppercase">or</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSignIn} className="space-y-3">
            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 tracking-[0.15em] uppercase mb-1.5 ml-0.5">
                <Mail className="h-2.5 w-2.5" /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary/40 text-gray-900 text-sm font-medium transition-all outline-none placeholder-gray-300"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 tracking-[0.15em] uppercase mb-1.5 ml-0.5">
                <Lock className="h-2.5 w-2.5" /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary/40 text-gray-900 text-sm font-medium transition-all outline-none placeholder-gray-300"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className="w-full premium-gradient text-white font-bold py-3 px-5 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm group relative overflow-hidden mt-1"
            >
              <div className="absolute inset-0 bg-gray-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-[11px] text-gray-400 font-medium text-center mt-5">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-bold transition-colors">
              Sign up free
            </Link>
          </p>
        </div>

        <p className="text-center text-[9px] text-gray-200 font-bold tracking-[0.3em] uppercase mt-5">
          Secure · Encrypted · Private
        </p>
      </motion.div>
    </div>
  );
}
