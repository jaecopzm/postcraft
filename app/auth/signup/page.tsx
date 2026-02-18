'use client';

import { useAuth } from '../../contexts/AuthContext';
import { Sparkles, Mail, Lock, UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignUp() {
  const { user, loading, signInWithGoogle, signUpWithEmail, resendVerificationEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await signUpWithEmail(email, password);
      setVerificationSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setVerificationError('');
    try {
      await resendVerificationEmail();
    } catch (err: any) {
      setVerificationError(err.message || 'Failed to resend verification');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-2 border-primary/20 border-t-primary"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Cinematic Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 blur-[150px] pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-accent/5 blur-[150px] pointer-events-none rounded-full -translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-md w-full relative z-10"
      >
        <div className="glass-card rounded-[3rem] p-12 border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="text-center mb-10">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="inline-flex p-4 premium-gradient rounded-3xl shadow-2xl shadow-primary/30 mb-8"
            >
              <Sparkles className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl font-black text-white tracking-widest uppercase mb-3">PostCraft</h1>
            <p className="text-white/30 text-xs font-bold tracking-[0.3em] uppercase">Initiating creative hub</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-bold tracking-wide text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {!verificationSent ? (
            <>
              <form onSubmit={handleEmailSignUp} className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-white/40 tracking-[0.2em] uppercase ml-1">
                    <Mail className="h-3 w-3" /> Communication Node
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary/50 text-white font-medium transition-all outline-none placeholder-white/10"
                    placeholder="visionary@future.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-white/40 tracking-[0.2em] uppercase ml-1">
                    <Lock className="h-3 w-3" /> Encryption Kernel
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary/50 text-white font-medium transition-all outline-none placeholder-white/10"
                    placeholder="Choose your cipher"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-white/40 tracking-[0.2em] uppercase ml-1">
                    <Lock className="h-3 w-3" /> Kernel Verification
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary/50 text-white font-medium transition-all outline-none placeholder-white/10"
                    placeholder="Repeat cipher"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full premium-gradient text-white font-black py-5 px-8 rounded-2xl transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <span className="tracking-[0.2em] uppercase text-xs text-secondary-foreground font-black">Initialize Identity</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-secondary-foreground" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="relative my-10">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="px-4 bg-[#0A0A0B] text-white/20 font-black tracking-[0.3em]">SYNCHRONIZE</span>
                </div>
              </div>

              <motion.button
                onClick={signInWithGoogle}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-black font-black py-5 px-8 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 hover:shadow-white/10 group mb-10"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="tracking-[0.2em] uppercase text-xs">Identity Core</span>
              </motion.button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="inline-flex p-6 bg-green-500/10 rounded-full border border-green-500/20 mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-400" />
              </div>
              <h3 className="text-xl font-black text-white tracking-widest uppercase mb-4">Activation Sequence Sent</h3>
              <p className="text-white/40 text-sm font-medium leading-relaxed mb-8">
                We've beamed a verification link to <span className="text-white">{email}</span>. Click it to activate your creative neural hub.
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleResend}
                  className="text-xs font-black tracking-widest text-primary border-b border-primary/20 pb-1 hover:border-primary transition-all"
                >
                  RE-BEAM SECURITY LINK
                </button>
                {verificationError && (
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">{verificationError}</p>
                )}
              </div>
            </motion.div>
          )}

          <div className="text-center">
            <p className="text-[10px] text-white/30 font-bold tracking-widest">
              ALREADY IN THE NETWORK?{' '}
              <Link href="/auth/signin" className="text-primary hover:text-primary/70 transition-colors border-b border-primary/20 pb-0.5">
                ACCESS CORE
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[8px] text-white/10 font-black tracking-[0.5em] uppercase mt-12">
          Secure Identity Protocol v9.2.0 // Quantum Encryption Active
        </p>
      </motion.div>
    </div>
  );
}
