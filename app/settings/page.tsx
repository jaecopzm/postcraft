'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Bell, Shield, Zap, Crown, Check, Mail,
  Monitor, BarChart2, AlertTriangle, ChevronRight, Settings, Target, Activity, Loader2
} from 'lucide-react';
import { getUserSubscription } from '@/lib/firestore';

const PRO_FEATURES = [
  'Unlimited generations per month',
  'Priority content generation',
  'Advanced analytics & insights',
  'Unlimited brand voices',
  'Early access to new platforms',
];

const FREE_FEATURES = [
  '10 generations per month',
  'All 6 platforms',
  '1 brand voice',
  'Basic analytics',
];

function SectionCard({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={`glass-card rounded-2xl sm:rounded-2xl border-border shadow-premium overflow-hidden relative ${className}`}
    >
      <div className="absolute top-0 left-0 w-full h-1 premium-gradient opacity-10" />
      {children}
    </motion.div>
  );
}

function SectionHeader({ icon: Icon, label, accent = '#0EA5E9' }: { icon: any; label: string; accent?: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-accent/5 border border-accent/10">
        <Icon className="h-6 w-6" style={{ color: accent }} />
      </div>
      <div>
        <h2 className="text-xl font-black text-foreground tracking-widest uppercase">{label}</h2>
        <div className="h-1 w-12 rounded-full mt-1" style={{ background: accent }} />
      </div>
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-14 h-8 rounded-full transition-all duration-300 shrink-0 ${on ? 'premium-gradient shadow-lg shadow-primary/15' : 'bg-accent/5 border border-accent/10'
        }`}
    >
      <motion.div
        animate={{ x: on ? 24 : 4 }}
        className="absolute top-1 h-6 w-6 bg-white/90 shadow-md rounded-full"
      />
    </button>
  );
}

import { useRouter } from 'next/navigation';
import { SettingsSkeleton } from '../../components/Skeleton';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Authentication check
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  const [isPro, setIsPro] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;
    try {
      const sub = await getUserSubscription(user.uid);
      setIsPro(sub.isPro);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Paddle setup
  const [isPaddleLoaded, setIsPaddleLoaded] = useState(false);

  useEffect(() => {
    const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

    if (typeof window !== 'undefined' && window.Paddle) {
      window.Paddle.Environment.set('sandbox');
      try {
        window.Paddle.Initialize({
          token: clientToken || 'test_token',
          eventCallback: (data: any) => {
            if (data.name === 'checkout.completed') {
              setIsPro(true);
            }
          }
        });
        setIsPaddleLoaded(true);
      } catch (err) {
        console.error("Paddle Initialization Error:", err);
      }
    }
  }, []);

  const handleUpgrade = async () => {
    if (!user) return;
    setUpgrading(true);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to authorize checkout');
      }

      if (window.Paddle) {
        window.Paddle.Checkout.open({
          items: [
            {
              priceId: process.env.NEXT_PUBLIC_PADDLE_PRICE_ID || 'pri_01jkyg...placeholder',
              quantity: 1
            }
          ],
          customer: {
            email: user.email || ''
          },
          customData: {
            userId: user.uid
          }
        });
      } else {
        console.error("Paddle SDK is not loaded");
        alert('Billing system is currently unavailable. Please try again later.');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to initiate upgrade. Please try again.');
    } finally {
      setUpgrading(false);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggle = (key: keyof typeof notifications) =>
    setNotifications(n => ({ ...n, [key]: !n[key] }));

  if (loading || dataLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="container mx-auto max-w-4xl animate-in fade-in duration-700">

      {/* Cinematic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4"
          >
            <Settings className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">System Overlord</span>
          </motion.div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-foreground">COMMAND <span className="text-gradient">CENTER</span></h1>
        </div>
      </div>

      <div className="space-y-8">

        {/* Subscription Control */}
        <SectionCard delay={0.1}>
          <div className="p-5 sm:p-8 md:p-10">
            <SectionHeader icon={Crown} label="Access Level" accent="#0EA5E9" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
              <div className="space-y-6">
                <div className="p-6 bg-accent/5 border border-accent/10 rounded-3xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 premium-gradient blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
                  <p className="text-[10px] font-black text-accent/60 uppercase tracking-[0.3em] mb-2">OPERATIONAL STATUS</p>
                  <p className="text-3xl font-black text-foreground tracking-tighter uppercase">{isPro ? 'ELITE PRO' : 'LEGACY FREE'}</p>
                </div>

                <div className="space-y-3">
                  {(isPro ? PRO_FEATURES : FREE_FEATURES).map((f, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm font-medium text-accent/80">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center bg-primary/10 border border-primary/20">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center">
                {!isPro && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-5 sm:p-8 glass-card border-primary/20 bg-accent/5 rounded-2xl relative overflow-hidden shadow-2xl shadow-primary/10"
                  >
                    <div className="absolute inset-0 premium-gradient opacity-5" />
                    <div className="relative z-10 text-center">
                      <Zap className="h-10 w-10 text-primary mx-auto mb-4" />
                      <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase mb-2">TRANSCEND TO PRO</h3>
                      <p className="text-sm text-accent/70 mb-8">Unlock the full neural potential of DraftRapid.</p>
                      <button
                        onClick={handleUpgrade}
                        disabled={upgrading}
                        className="w-full py-4 sm:py-5 premium-gradient rounded-2xl text-white text-[10px] font-black tracking-[0.1em] sm:tracking-[0.3em] uppercase shadow-xl shadow-primary/20 flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50"
                      >
                        {upgrading ? 'CALIBRATING CORE...' : 'Upgrade Now — $9/mo'}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
                {isPro && (
                  <div className="p-8 glass-card border-emerald-500/20 rounded-2xl text-center">
                    <Crown className="h-12 w-12 text-accent mx-auto mb-4" />
                    <h3 className="text-2xl font-black text-accent tracking-tighter uppercase mb-2">ELITE STATUS ACTIVE</h3>
                    <p className="text-sm text-accent/80">Your neural uplink is operating at 100% capacity.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Profile Matrix */}
        <SectionCard delay={0.2}>
          <div className="p-5 sm:p-8 md:p-10">
            <SectionHeader icon={User} label="Identity Matrix" accent="#8B5CF6" />

            <div className="flex flex-col md:flex-row gap-6 sm:gap-12">
              <div className="flex flex-col items-center gap-6 md:w-48">
                <div className="relative group">
                  <div className="absolute inset-0 premium-gradient blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Identity" className="h-32 w-32 rounded-full border-4 border-accent/10 relative z-10 shadow-2xl" />
                  ) : (
                    <div className="h-32 w-32 rounded-full premium-gradient flex items-center justify-center relative z-10 shadow-2xl">
                      <User className="h-12 w-12 text-white" />
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 p-3 bg-accent/5 backdrop-blur-xl border border-border rounded-2xl text-accent/40 hover:text-accent transition-all z-20 shadow-xl">
                    <Target className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-accent/50 uppercase tracking-[0.3em] mb-4">UPLINK ADDRESS</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-6 py-4 bg-accent/5 border border-border rounded-2xl text-accent/50 text-sm font-bold tracking-tight cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-accent/60 uppercase tracking-[0.3em] mb-4">DESIGNATION</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full px-6 py-4 bg-accent/5 border border-border rounded-2xl text-foreground placeholder-accent/40 text-sm font-bold tracking-tight focus:outline-none focus:border-accent/40 transition-all"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className={`px-10 py-5 text-[10px] font-black tracking-[0.3em] uppercase rounded-2xl transition-all
                              ${saved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'premium-gradient text-white shadow-xl shadow-primary/20'}`}
                >
                  {saved ? 'Matrix Synchronized' : 'Sync Changes'}
                </motion.button>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Frequency & Signals */}
        <SectionCard delay={0.3}>
          <div className="p-5 sm:p-8 md:p-10">
            <SectionHeader icon={Bell} label="Signal Frequency" accent="#F59E0B" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {([
                { key: 'email', icon: Mail, label: 'NEURAL UPLINK', sub: 'Email notifications' },
                { key: 'push', icon: Monitor, label: 'DIRECT SIGNAL', sub: 'Browser alerts' },
                { key: 'weekly', icon: BarChart2, label: 'DATA RECAP', sub: 'Weekly summary' },
              ] as const).map(({ key, icon: Icon, label, sub }) => (
                <div key={key} className="p-5 sm:p-8 bg-accent/5 border border-border rounded-xl sm:rounded-2xl flex flex-col items-center text-center group hover:border-accent/20 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 premium-gradient blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity" />
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-border/50 flex items-center justify-center mb-6">
                    <Icon className="h-6 w-6 text-accent/30 group-hover:text-accent transition-colors" />
                  </div>
                  <h4 className="text-[10px] font-black text-foreground tracking-[0.2em] mb-2">{label}</h4>
                  <p className="text-[10px] font-bold text-accent/50 uppercase tracking-widest mb-8">{sub}</p>
                  <Toggle on={notifications[key]} onChange={() => toggle(key)} />
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Danger Matrix */}
        <SectionCard delay={0.4} className="border-red-500/10">
          <div className="p-5 sm:p-8 md:p-10">
            <SectionHeader icon={AlertTriangle} label="Termination Matrix" accent="#EF4444" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
              <div className="max-w-md">
                <p className="text-sm font-medium text-accent/80 leading-relaxed">
                  Initiating a total account termination will permanently erase all neural patterns, brand voices, and operational history from the DraftRapid matrix.
                </p>
              </div>

              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="px-10 py-5 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black tracking-[0.3em] uppercase rounded-2xl hover:bg-red-500 hover:text-gray-900 transition-all"
                >
                  Initiate Terminate
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-10 py-5 bg-accent/5 text-accent/40 text-[10px] font-black tracking-[0.3em] uppercase rounded-2xl"
                  >
                    Abort
                  </button>
                  <button className="px-10 py-5 bg-red-500 text-white text-[10px] font-black tracking-[0.3em] uppercase rounded-2xl shadow-xl shadow-red-500/20">
                    Confirm Deletion
                  </button>
                </div>
              )}
            </div>
          </div>
        </SectionCard>

      </div>
    </div>
  );
}