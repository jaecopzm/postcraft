'use client';

import { useAuth } from '../app/contexts/AuthContext';
import { useSidebar } from '../app/contexts/SidebarContext';
import { getUserSubscription } from '@/lib/firestore';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import {
  Sparkles, Home, History, BarChart3, Settings, LogOut, User,
  Crown, Menu, X, Zap, TrendingUp, Rocket, ChevronLeft, Calendar as CalendarIcon,
  Palette, Wand2, Library, Download
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [generationsUsed, setGenerationsUsed] = useState(0);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (user) {
      fetchUserStatus();
    }
  }, [user]);

  const fetchUserStatus = async () => {
    if (!user) return;
    try {
      const [{ isPro: proStatus }, userData] = await Promise.all([
        getUserSubscription(user.uid),
        getDoc(doc(db, 'users', user.uid)).then(d => d.data())
      ]);

      setIsPro(proStatus);

      if (userData?.generationCounts) {
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        setGenerationsUsed(userData.generationCounts[monthKey] || 0);
      }
    } catch (error) {
      console.error('Failed to fetch user status:', error);
    }
  };

  const generationsLimit = isPro ? Infinity : 10;
  const usagePct = isPro ? 0 : Math.min((generationsUsed / generationsLimit) * 100, 100);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Command Center', href: '/command-center', icon: Rocket },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
    { name: 'Library', href: '/library', icon: Library },
    { name: 'AI Tools', href: '/ai-tools', icon: Wand2 },
    { name: 'Brand Voice', href: '/brand-voice', icon: Palette },
    { name: 'Export', href: '/export', icon: Download },
    { name: 'History', href: '/history', icon: History },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* ── Mobile hamburger toggle ── */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 glass-card rounded-xl shadow-xl active:scale-95"
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          {isMobileOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-5 w-5 text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Menu className="h-5 w-5 text-cool-blue" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Sidebar ── */}
      <motion.aside
        initial={false}
        animate={{
          // Desktop: always visible, width changes on collapse
          // Mobile: slides in/out from left
          x: 0,
          width: isCollapsed ? 72 : 320,
        }}
        transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
        className={`
          fixed top-0 left-0 z-40 h-screen
          bg-[#0A0A0B]/90 backdrop-blur-2xl
          border-r border-white/5
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-250 lg:transition-none
        `}
        style={{ width: isCollapsed ? 72 : 320 }}
      >
        {/* Subtle glow background */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] pointer-events-none" />

        <div className={`flex flex-col h-full ${isCollapsed ? 'px-3' : 'px-6'} py-8 relative z-10`}>

          {/* ── Logo + collapse toggle ── */}
          <div className="flex items-center justify-between mb-10 h-10">
            <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative shrink-0 p-2.5 premium-gradient rounded-xl shadow-lg shadow-primary/20"
              >
                <Sparkles className="h-5 w-5 text-white" />
              </motion.div>
              {!isCollapsed && (
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-2xl font-bold text-gradient tracking-tight"
                >
                  DraftRapid
                </motion.h1>
              )}
            </div>

            {!isCollapsed && (
              <motion.button
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                onClick={() => setIsCollapsed(true)}
                className="hidden lg:flex items-center justify-center h-8 w-8 rounded-lg text-white/40 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
            )}
          </div>

          <AnimatePresence>
            {isCollapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setIsCollapsed(false)}
                className="hidden lg:flex mb-6 items-center justify-center h-10 w-full rounded-xl text-white/40 hover:bg-white/5 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5 rotate-180" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* ── Navigation ── */}
          <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
            {navigation.map((item, idx) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      group relative flex items-center gap-4 rounded-xl font-medium
                      transition-all duration-200
                      ${isCollapsed ? 'justify-center px-0 py-3' : 'px-4 py-3'}
                      ${active
                        ? 'bg-primary/10 text-primary shadow-inner shadow-primary/5'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    {active && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    <Icon className={`h-5 w-5 shrink-0 transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`} />

                    {!isCollapsed && (
                      <span className="text-sm font-semibold tracking-wide">{item.name}</span>
                    )}

                    {isCollapsed && (
                      <div className="absolute left-full ml-4 px-3 py-2 text-xs font-bold text-white bg-charcoal border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-2xl">
                        {item.name}
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* ── User Profile ── */}
          <div className="mt-auto space-y-4">
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
                <motion.div
                  key="expanded-user"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="glass-card rounded-2xl p-5 relative overflow-hidden group"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="h-12 w-12 rounded-full border-2 border-primary/20" />
                      ) : (
                        <div className="h-12 w-12 rounded-full premium-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-[#1A1A1F] rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate uppercase tracking-wider">
                        {user?.displayName || user?.email?.split('@')[0] || 'Member'}
                      </p>
                      <p className="text-[10px] text-white/40 truncate font-mono">
                        {isPro ? 'PRO ACCOUNT' : 'FREE ACCOUNT'}
                      </p>
                    </div>
                  </div>

                  {!isPro && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-white/40">USAGE</span>
                          <span className="text-white">{generationsUsed}/{generationsLimit}</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${usagePct}%` }}
                            className="h-full premium-gradient shadow-[0_0_10px_rgba(236,88,0,0.3)]"
                          />
                        </div>
                      </div>

                      <Link
                        href="/settings"
                        className="flex items-center justify-center gap-2 w-full py-3 premium-button premium-gradient rounded-xl text-xs font-bold text-white group"
                      >
                        <Zap className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
                        UPGRADE TO PRO
                      </Link>
                    </div>
                  )}

                  {isPro && (
                    <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-xl">
                      <Crown className="h-4 w-4 text-primary" />
                      <span className="text-xs font-bold text-primary tracking-wide">PREMIUM ACTIVE</span>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed-user"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="relative">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="h-10 w-10 rounded-full border-2 border-primary/20" />
                    ) : (
                      <div className="h-10 w-10 rounded-full premium-gradient flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isCollapsed && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 mb-4 opacity-20 hover:opacity-40 transition-opacity">
                {[
                  { label: 'About', href: '/about' },
                  { label: 'Terms', href: '/terms' },
                  { label: 'Privacy', href: '/privacy' }
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="text-[8px] font-black tracking-widest uppercase hover:text-white transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            <motion.button
              whileHover={{ x: -2 }}
              onClick={() => signOut()}
              className={`
                group flex items-center gap-4 rounded-xl font-bold text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all
                ${isCollapsed ? 'justify-center py-3' : 'px-4 py-3'}
              `}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span className="text-sm tracking-widest uppercase">Logout</span>}
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}