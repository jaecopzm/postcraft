'use client';

import { Sparkles, Zap, Target, TrendingUp, ArrowRight, Check, Activity, Globe, Send, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const PLATFORMS = [
  { name: 'TWITTER / X', color: '#ffffff' },
  { name: 'LINKEDIN', color: '#0A66C2' },
  { name: 'INSTAGRAM', color: '#E1306C' },
  { name: 'TIKTOK', color: '#00F2EA' }
];

export default function LandingPage() {
  const { user, loading: authLoading } = useAuth();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 relative overflow-hidden font-sans">
      {/* Cinematic Background Artifacts */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[150px] pointer-events-none rounded-full opacity-50" />
      <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-accent/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-primary/5 blur-[150px] pointer-events-none rounded-full" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <span className="text-base sm:text-xl font-black tracking-widest uppercase">PostCraft</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <Link href="/dashboard" className="px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-black text-xs font-black tracking-widest uppercase rounded-full hover:scale-105 transition-all shadow-xl shadow-white/5">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/signin" className="hidden sm:block px-6 py-2.5 text-xs font-black tracking-widest uppercase text-white/50 hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/auth/signup" className="px-5 sm:px-8 py-2 sm:py-2.5 premium-gradient text-white text-xs font-black tracking-widest uppercase rounded-full hover:scale-105 transition-all shadow-xl shadow-primary/20">
                  Join Beta
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 md:pt-44 md:pb-32 px-4 sm:px-6 max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6 sm:mb-10">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.3em] uppercase text-primary">Neural Content Engine v4.0</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 sm:mb-8 leading-[0.9]">
            WRITE ONCE.<br />
            <span className="text-gradient">UNIVERSAL</span> REACH.
          </motion.h1>

          <motion.p variants={itemVariants} className="text-base sm:text-xl md:text-2xl text-white/40 font-medium mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
            Generate cinematic content for every digital frontier in seconds.
            One interface. Infinite momentum.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 px-4 sm:px-0">
            <Link href="/auth/signup" className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 premium-gradient rounded-2xl text-white font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase text-sm shadow-2xl shadow-primary/30 group relative overflow-hidden transition-all hover:scale-105 text-center">
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center justify-center gap-3">
                Initialize Access
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link href="/auth/signin" className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 glass-card border-white/10 rounded-2xl text-white/50 font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase text-sm hover:text-white hover:border-white/20 transition-all text-center">
              Sign In
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Real-time stats */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-y border-white/5 bg-white/[0.02] py-12 sm:py-20 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 text-center">
          {[
            { label: 'SUPPORTED NODES', value: '06', icon: Activity },
            { label: 'GEN TIME', value: '< 8s', icon: Zap },
            { label: 'AVAILABILITY', value: '99.9%', icon: Globe },
            { label: 'TOTAL FLOWS', value: '4M+', icon: Send }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-primary/40 mb-2 sm:mb-3">
                <stat.icon className="h-4 w-4" />
              </div>
              <div className="text-2xl sm:text-4xl font-black text-white tracking-tighter">{stat.value}</div>
              <div className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.3em] text-white/20 uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Grid Features */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 sm:mb-20">
          <div className="max-w-2xl">
            <h2 className="text-white/20 text-xs font-black tracking-[0.4em] uppercase mb-4">Core Capacities</h2>
            <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">BUILT FOR THE<br />MODERN ARCHITECT.</h3>
          </div>
          <p className="max-w-xs text-white/30 font-medium leading-relaxed text-sm sm:text-base">
            Eliminate the friction between thought and publication across every major communication grid.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
          {[
            {
              title: "NEURAL SPEED",
              desc: "Complete multi-platform clusters generated in under 8 seconds. Efficiency without compromise.",
              icon: Zap,
              color: "#EC5800"
            },
            {
              title: "NODE NATIVE",
              desc: "Content automatically calibrated for character limits, tone conventions, and visual standards.",
              icon: Target,
              color: "#06B6D4"
            },
            {
              title: "FLOW DENSITY",
              desc: "Every generation provides 3 distinct strategic angles. Pivot your voice instantly.",
              icon: TrendingUp,
              color: "#8B5CF6"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="glass-card rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: feature.color }} />
              <div className="w-12 h-12 sm:w-16 sm:h-16 premium-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-6 sm:mb-10">
                <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-3 sm:mb-4">{feature.title}</h4>
              <p className="text-white/40 font-medium leading-relaxed text-sm sm:text-base">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] p-8 sm:p-14 md:p-20 text-center border-white/5 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/5 blur-[120px] pointer-events-none" />
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter mb-6 sm:mb-8 max-w-3xl mx-auto leading-[0.9]">
              JOIN THE <span className="text-gradient">NEW STANDARD</span> OF CREATION.
            </h2>
            <p className="text-white/30 text-base sm:text-lg font-medium mb-8 sm:mb-12 max-w-xl mx-auto">
              The noise is deafening. Let's make sure your voice cutting through it is effortless.
            </p>
            <Link href="/auth/signup" className="inline-flex px-8 sm:px-12 py-4 sm:py-6 premium-gradient rounded-2xl text-white font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase text-sm shadow-2xl transition-all hover:scale-105 active:scale-95">
              Initialize first post — free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-20 px-4 sm:px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-3 mb-8 sm:mb-10">
          <div className="w-8 h-8 premium-gradient rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-black tracking-widest uppercase">PostCraft</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4 sm:gap-y-6 mb-8 sm:mb-12">
          {[
            { label: 'About', path: '/about' },
            { label: 'Terms', path: '/terms' },
            { label: 'Privacy', path: '/privacy' },
            { label: 'Contact', path: '/contact' }
          ].map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="text-[10px] font-black tracking-[0.3em] uppercase text-white/20 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-[10px] font-black tracking-[0.3em] text-white/5 uppercase mb-8">
          © {new Date().getFullYear()} PostCraft Neural Sys // All Rights Reserved
        </p>
        <div className="flex items-center justify-center gap-8 opacity-10">
          <ShieldCheck className="h-4 w-4" />
          <Globe className="h-4 w-4" />
          <Activity className="h-4 w-4" />
        </div>
      </footer>
    </div>
  );
}