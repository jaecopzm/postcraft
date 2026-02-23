'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Bell, Shield, Zap, Crown, Check, Mail,
  Monitor, BarChart2, AlertTriangle, ChevronRight, Settings, Target, Activity, Loader2
} from 'lucide-react';
import { getUserSubscription } from '@/lib/firestore';
import { loadPaddle } from '@/lib/loadPaddle';
import { useToast } from '../../components/Toast';

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
      className={`glass-card rounded-xl border-border shadow-premium overflow-hidden relative ${className}`}
    >
      <div className="absolute top-0 left-0 w-full h-1 premium-gradient opacity-10" />
      {children}
    </motion.div>
  );
}

function SectionHeader({ icon: Icon, label, accent = '#0EA5E9' }: { icon: any; label: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-accent/5 border border-accent/10">
        <Icon className="h-5 w-5" style={{ color: accent }} />
      </div>
      <h2 className="text-base sm:text-lg font-bold text-foreground">{label}</h2>
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
  const { toast } = useToast();

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
  const [saving, setSaving] = useState(false);
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
    let mounted = true;
    loadPaddle()
      .then((Paddle) => {
        try {
          Paddle.Environment.set('sandbox');
          Paddle.Initialize({
            token: clientToken || 'test_token',
            eventCallback: (data: any) => {
              if (data.name === 'checkout.completed') {
                setIsPro(true);
              }
            }
          });
          if (mounted) setIsPaddleLoaded(true);
        } catch (err) {
          console.error("Paddle Initialization Error:", err);
        }
      })
      .catch((err) => console.warn('Paddle not loaded:', err));
    return () => { mounted = false; };
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
          },
          settings: {
            successUrl: `${window.location.origin}/dashboard?success=true`
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

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setSaved(true);
    setSaving(false);
    toast('Settings saved successfully!');
    setTimeout(() => setSaved(false), 2000);
  };

  // Auto-save after 2 seconds of inactivity
  useEffect(() => {
    if (!user?.displayName || displayName === user.displayName) return;
    
    const timer = setTimeout(() => {
      handleSave();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [displayName, user?.displayName]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          handleSave();
        }
      }
      if (e.key === 'Escape' && confirmDelete) {
        setConfirmDelete(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmDelete]);

  const toggle = (key: keyof typeof notifications) =>
    setNotifications(n => ({ ...n, [key]: !n[key] }));

  if (loading || dataLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="container mx-auto max-w-4xl animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-3"
          >
            <Settings className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-primary">Settings</span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Account <span className="text-gradient">Settings</span></h1>
        </div>
      </div>

      <div className="space-y-6">

        {/* Subscription */}
        <SectionCard delay={0.1}>
          <div className="p-5">
            <SectionHeader icon={Crown} label="Subscription Plan" accent="#0EA5E9" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 premium-gradient blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
                  <p className="text-[10px] font-bold text-accent/60 uppercase tracking-wider mb-1">Current Plan</p>
                  <p className="text-xl font-bold text-foreground">{isPro ? 'Pro' : 'Free'}</p>
                </div>

                <div className="space-y-2">
                  {(isPro ? PRO_FEATURES : FREE_FEATURES).map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-accent/80">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center bg-primary/10 border border-primary/20">
                        <Check className="h-2.5 w-2.5 text-primary" />
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
                    className="p-5 glass-card border-primary/20 bg-accent/5 rounded-xl relative overflow-hidden shadow-xl shadow-primary/10"
                  >
                    <div className="absolute inset-0 premium-gradient opacity-5" />
                    <div className="relative z-10 text-center">
                      <Zap className="h-8 w-8 text-primary mx-auto mb-3" />
                      <h3 className="text-lg font-bold text-foreground mb-1">Upgrade to Pro</h3>
                      <p className="text-xs text-accent/70 mb-5">Unlock unlimited generations and advanced features.</p>
                      <button
                        onClick={handleUpgrade}
                        disabled={upgrading}
                        className="w-full py-3 premium-gradient rounded-xl text-white text-xs font-bold tracking-wide uppercase shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {upgrading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                        {upgrading ? 'Processing...' : 'Upgrade Now — $9/mo'}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
                {isPro && (
                  <div className="p-5 glass-card border-emerald-500/20 rounded-xl text-center">
                    <Crown className="h-10 w-10 text-accent mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-accent mb-1">Pro Active</h3>
                    <p className="text-xs text-accent/80">You have access to all premium features.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Profile */}
        <SectionCard delay={0.2}>
          <div className="p-5">
            <SectionHeader icon={User} label="Profile Information" accent="#8B5CF6" />

            <div className="flex flex-col md:flex-row gap-5">
              <div className="flex flex-col items-center gap-4 md:w-40">
                <div className="relative group">
                  <div className="absolute inset-0 premium-gradient blur-2xl opacity-20 group-hover:opacity-40 transition-opacity rounded-full" />
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="h-24 w-24 rounded-full border-4 border-accent/10 relative z-10 shadow-xl" />
                  ) : (
                    <div className="h-24 w-24 rounded-full premium-gradient flex items-center justify-center relative z-10 shadow-xl">
                      <User className="h-10 w-10 text-white" />
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 p-2 bg-accent/5 backdrop-blur-xl border border-border rounded-lg text-accent/40 hover:text-accent transition-all z-20 shadow-lg">
                    <Target className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold text-accent/50 uppercase tracking-wider mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 bg-accent/5 border border-border rounded-lg text-accent/50 text-sm font-medium cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-accent/60 uppercase tracking-wider mb-2">Display Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full px-4 py-3 bg-accent/5 border border-border rounded-lg text-foreground placeholder-accent/40 text-sm font-medium focus:outline-none focus:border-accent/40 transition-all"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-6 py-3 text-xs font-bold tracking-wide uppercase rounded-lg transition-all flex items-center gap-2
                              ${saved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                                saving ? 'bg-accent/10 text-accent/50 cursor-not-allowed' :
                                'premium-gradient text-white shadow-lg shadow-primary/20'}`}
                >
                  {saving && <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />}
                  {saved ? 'Auto-Saved ✓' : saving ? 'Saving...' : 'Save Changes'}
                  {!saving && !saved && <span className="text-[8px] opacity-60 ml-1">(Ctrl+S)</span>}
                </motion.button>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Notifications */}
        <SectionCard delay={0.3}>
          <div className="p-5">
            <SectionHeader icon={Bell} label="Notifications" accent="#F59E0B" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                { key: 'email', icon: Mail, label: 'Email', sub: 'Email notifications' },
                { key: 'push', icon: Monitor, label: 'Browser', sub: 'Browser alerts' },
                { key: 'weekly', icon: BarChart2, label: 'Weekly Report', sub: 'Weekly summary' },
              ] as const).map(({ key, icon: Icon, label, sub }) => (
                <div key={key} className="p-4 bg-accent/5 border border-border rounded-lg flex flex-col items-center text-center group hover:border-accent/20 transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 premium-gradient blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity" />
                  <div className="w-11 h-11 rounded-lg bg-accent/10 border border-border/50 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-accent/30 group-hover:text-accent transition-colors" />
                  </div>
                  <h4 className="text-xs font-bold text-foreground mb-1">{label}</h4>
                  <p className="text-[10px] text-accent/50 mb-4">{sub}</p>
                  <Toggle on={notifications[key]} onChange={() => toggle(key)} />
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Danger Zone */}
        <SectionCard delay={0.4} className="border-red-500/10">
          <div className="p-5">
            <SectionHeader icon={AlertTriangle} label="Danger Zone" accent="#EF4444" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="max-w-md">
                <p className="text-sm text-accent/80 leading-relaxed">
                  Deleting your account will permanently remove all your content, brand voices, and data. This action cannot be undone.
                </p>
              </div>

              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold tracking-wide uppercase rounded-lg hover:bg-red-500 hover:text-white transition-all"
                >
                  Delete Account
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-6 py-3 bg-accent/5 text-accent/40 text-xs font-bold tracking-wide uppercase rounded-lg"
                  >
                    Cancel
                  </button>
                  <button className="px-6 py-3 bg-red-500 text-white text-xs font-bold tracking-wide uppercase rounded-lg shadow-lg shadow-red-500/20">
                    Confirm Delete
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