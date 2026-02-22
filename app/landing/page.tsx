'use client';

import {
  Sparkles, Zap, Target, TrendingUp, ArrowRight, Check,
  Globe, ShieldCheck, Twitter, Linkedin, Instagram, Star,
  Activity, Music, Youtube
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { motion, Variants } from 'framer-motion';

const PLATFORMS = [
  { name: 'Twitter / X', icon: Twitter, color: '#1A1A1A' },
  { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { name: 'Instagram', icon: Instagram, color: '#E1306C' },
  { name: 'TikTok', icon: Music, color: '#00F2EA' },
  { name: 'YouTube', icon: Youtube, color: '#FF0000' },
  { name: 'Facebook', icon: Globe, color: '#1877F2' },
];

const TESTIMONIALS = [
  {
    name: 'Jordan K.',
    role: 'Startup Founder',
    avatar: 'JK',
    color: '#E8590C',
    quote: "I used to spend 2 hours a week writing LinkedIn posts. Now it's 10 minutes. The Brand Voice feature is scary accurate.",
    stars: 5,
  },
  {
    name: 'Amara O.',
    role: 'Content Creator',
    avatar: 'AO',
    color: '#16A34A',
    quote: "The virality scoring stopped me from posting a dull hook three times in a row. My engagement is actually up 40%.",
    stars: 5,
  },
  {
    name: 'Marcus T.',
    role: 'Marketing Manager',
    avatar: 'MT',
    color: '#0A66C2',
    quote: "Finally, one tool that handles our full platform mix without sounding robotic. The team uses it daily.",
    stars: 5,
  },
];

export default function LandingPage() {
  const { user } = useAuth();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-900 selection:bg-primary/20 relative overflow-hidden font-sans">

      {/* ── Background glows ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-primary/[0.04] blur-[160px] pointer-events-none rounded-full opacity-60" />
      <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-accent/[0.03] blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-[-10%] w-[600px] h-[600px] bg-primary/[0.03] blur-[150px] pointer-events-none rounded-full" />

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-gray-200/60 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <span className="text-base sm:text-xl font-black tracking-widest uppercase">DraftRapid</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <Link href="/dashboard" className="px-4 sm:px-6 py-2 sm:py-2.5 premium-gradient text-white text-xs font-black tracking-widest uppercase rounded-full hover:scale-105 transition-all shadow-lg shadow-primary/20">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/pricing" className="hidden sm:block px-6 py-2.5 text-xs font-black tracking-widest uppercase text-gray-400 hover:text-gray-900 transition-colors">
                  Pricing
                </Link>
                <Link href="/auth/signin" className="hidden sm:block px-6 py-2.5 text-xs font-black tracking-widest uppercase text-gray-400 hover:text-gray-900 transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="px-5 sm:px-8 py-2 sm:py-2.5 premium-gradient text-white text-xs font-black tracking-widest uppercase rounded-full hover:scale-105 transition-all shadow-lg shadow-primary/20">
                  Start Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-28 pb-16 sm:pt-36 sm:pb-24 md:pt-44 md:pb-32 px-4 sm:px-6 max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Hook badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6 sm:mb-10">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            <span className="text-[9px] sm:text-[11px] font-black tracking-widest uppercase text-primary">
              Turn any topic into 6 platform-ready posts — in 8 seconds
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 sm:mb-8 leading-[0.9]">
            YOUR AI SOCIAL<br />
            <span className="text-gradient">ARCHITECT</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-base sm:text-xl md:text-2xl text-gray-400 font-medium mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
            Stop staring at a blank screen. DraftRapid generates perfectly on-brand posts for every major platform — trained on your exact voice.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 px-4 sm:px-0 mb-10 sm:mb-16">
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 premium-gradient rounded-2xl text-white font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase text-sm shadow-xl shadow-primary/20 group relative overflow-hidden transition-all hover:scale-105 text-center"
            >
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10 flex items-center justify-center gap-3">
                Start Creating for Free
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link
              href="/auth/signin"
              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-white border border-gray-200 rounded-2xl text-gray-500 font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase text-sm hover:text-gray-900 hover:border-gray-300 transition-all text-center shadow-sm"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Floating platform badges */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3">
            {PLATFORMS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.name}
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-bold text-gray-500 tracking-wide hover:border-gray-300 hover:text-gray-700 transition-all shadow-sm"
                >
                  <Icon className="h-3.5 w-3.5" style={{ color: p.color }} />
                  {p.name}
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Honest stats bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-y border-gray-200/60 bg-white/50 py-12 sm:py-20 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 text-center">
          {[
            { label: 'Platforms Supported', value: '6', sub: 'Twitter, LinkedIn, IG + more' },
            { label: 'Avg. Generation Time', value: '< 8s', sub: 'Per full multi-platform batch' },
            { label: 'Variations per Post', value: 'Up to 10', sub: 'Pro plan' },
            { label: 'Brand Voices', value: 'Unlimited', sub: 'On Pro — 1 free on Starter' },
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <div className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</div>
              <div className="text-[10px] font-black tracking-[0.2em] sm:tracking-[0.3em] text-gray-400 uppercase">{stat.label}</div>
              <div className="text-[10px] text-gray-300 font-medium">{stat.sub}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Feature cards ── */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12 sm:mb-20">
          <div className="max-w-2xl">
            <h2 className="text-gray-400 text-xs font-black tracking-[0.4em] uppercase mb-4">What You Get</h2>
            <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">BUILT FOR THE<br />MODERN ARCHITECT.</h3>
          </div>
          <p className="max-w-xs text-gray-400 font-medium leading-relaxed text-sm sm:text-base">
            Everything you need to go from zero to published — across every major platform — in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              title: 'Write Exactly Like You',
              subtitle: 'Genetic Aura — Brand Voice AI',
              desc: "Upload your manifesto, brand guidelines, or past posts. The AI ingests your voice DNA and generates content that sounds like you wrote it.",
              icon: Zap,
              color: '#E8590C',
            },
            {
              title: 'Know Before You Post',
              subtitle: 'Predictive Virality Scoring',
              desc: "Get real-time hook quality grades and actionable improvement tips powered by Gemini — before you ever hit publish.",
              icon: Target,
              color: '#16A34A',
            },
            {
              title: 'Build Your Posting Habit',
              subtitle: 'Gamified Streak Tracking',
              desc: "Consistency is the only cheat code. Track daily posting streaks, build your Habit Score, and watch your heatmap glow green.",
              icon: TrendingUp,
              color: '#8B5CF6',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-8 relative overflow-hidden group shadow-sm hover:shadow-md transition-all"
            >
              <div className="absolute top-0 right-0 w-40 h-40 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ background: feature.color }} />
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm mb-5 sm:mb-6" style={{ background: `${feature.color}10`, border: `1px solid ${feature.color}20` }}>
                <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
              </div>
              <h4 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight mb-1">{feature.title}</h4>
              <p className="text-[10px] font-black tracking-widest uppercase mb-3 sm:mb-4" style={{ color: feature.color }}>{feature.subtitle}</p>
              <p className="text-gray-500 font-medium leading-relaxed text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-gray-400 text-xs font-black tracking-[0.4em] uppercase mb-4">Early Adopters</h2>
          <h3 className="text-3xl sm:text-5xl font-black tracking-tight">WHAT THEY&apos;RE <span className="text-gradient">SAYING</span></h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 relative overflow-hidden group shadow-sm hover:shadow-md transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{ background: t.color }} />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-gray-600 font-medium leading-relaxed text-sm mb-5">&quot;{t.quote}&quot;</p>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0" style={{ background: `${t.color}`, border: `2px solid ${t.color}30` }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900">{t.name}</p>
                  <p className="text-[11px] text-gray-400 font-bold">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pricing: Free vs Pro ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">SIMPLE PRICING</h2>
          <p className="text-gray-400 text-base sm:text-lg">Start free. Upgrade when you&apos;re ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col shadow-sm">
            <div className="mb-5">
              <p className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-3">Starter</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl sm:text-5xl font-black text-gray-900">Free</span>
              </div>
              <p className="text-sm text-gray-400 font-medium mt-2">No credit card needed</p>
            </div>
            <div className="space-y-3 flex-1 mb-6">
              {[
                '10 AI generations / month',
                '1 Brand Voice profile',
                '3 platforms per generation',
                'Virality scoring',
                'Content history (30 days)',
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-gray-400" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">{feat}</span>
                </div>
              ))}
            </div>
            <Link href="/auth/signup" className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-black tracking-widest uppercase text-xs hover:bg-gray-100 hover:border-gray-300 transition-all">
              Get Started Free
            </Link>
          </div>

          {/* Pro */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-[80px] pointer-events-none rounded-full" />
            <motion.div
              whileHover={{ y: -4 }}
              className="relative bg-white border-2 border-primary/30 rounded-2xl p-6 sm:p-8 shadow-lg shadow-primary/5 overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 left-0 right-0 h-1 premium-gradient" />
              <div className="mb-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-black tracking-widest uppercase text-primary">Founder V1</p>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black tracking-widest rounded-full uppercase border border-primary/20">Best Value</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-gray-900">$9.99</span>
                  <span className="text-gray-400 font-bold mb-1">/ mo</span>
                </div>
                <p className="text-sm text-gray-400 font-medium mt-2 line-through">Normally $19.99 — locked in forever</p>
              </div>
              <div className="space-y-3 flex-1 mb-6">
                {[
                  'Unlimited AI generations',
                  'Multiple Brand Voice profiles',
                  'All 6 platforms per generation',
                  'Up to 10 variations per post',
                  'Advanced virality scoring',
                  'Habit tracking & heatmap',
                  'Priority feature access',
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{feat}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth/signup" className="flex items-center justify-center gap-3 w-full py-4 premium-gradient rounded-xl text-white font-black tracking-[0.2em] uppercase text-xs shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                Claim Beta Price
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-8 sm:p-14 md:p-16 text-center relative overflow-hidden shadow-sm"
          >
            <div className="absolute inset-0 bg-primary/[0.02] blur-[120px] pointer-events-none" />
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-6 sm:mb-8 max-w-3xl mx-auto leading-[0.9]">
              JOIN THE <span className="text-gradient">NEW STANDARD</span> OF CREATION.
            </h2>
            <p className="text-gray-400 text-base sm:text-lg font-medium mb-8 sm:mb-10 max-w-xl mx-auto">
              The noise is deafening. Let&apos;s make sure your voice cuts through it — effortlessly.
            </p>
            <Link href="/auth/signup" className="inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 premium-gradient rounded-2xl text-white font-black tracking-[0.15em] sm:tracking-[0.2em] uppercase text-sm shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 group">
              Generate My First Post — Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 sm:py-20 px-4 sm:px-6 border-t border-gray-200/60 text-center">
        <div className="flex items-center justify-center gap-3 mb-8 sm:mb-10">
          <div className="w-8 h-8 premium-gradient rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-black tracking-widest uppercase">DraftRapid</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 gap-y-4 sm:gap-y-6 mb-8 sm:mb-12">
          {[
            { label: 'Pricing', path: '/pricing' },
            { label: 'About', path: '/about' },
            { label: 'Terms', path: '/terms' },
            { label: 'Privacy', path: '/privacy' },
            { label: 'Refund', path: '/refund' },
            { label: 'Contact', path: '/contact' },
          ].map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-[11px] font-bold text-gray-300 mb-8">
          © {new Date().getFullYear()} DraftRapid. All Rights Reserved.
        </p>

        <div className="flex items-center justify-center gap-8 text-gray-300">
          <ShieldCheck className="h-4 w-4" />
          <Globe className="h-4 w-4" />
          <Activity className="h-4 w-4" />
        </div>
      </footer>
    </div>
  );
}