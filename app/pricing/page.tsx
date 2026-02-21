'use client';

import { motion, Variants } from 'framer-motion';
import { Sparkles, Check, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

const FREE_FEATURES = [
    '10 AI-generated posts per month',
    '1 Brand Voice profile',
    '3 platforms per generation',
    'Virality scoring',
    'Content history (30 days)',
    'Export generated content',
];

const PRO_FEATURES = [
    'Unlimited AI generations',
    'Multiple Brand Voice profiles',
    'All 6 platforms per generation',
    'Up to 10 variations per post',
    'Advanced virality scoring + tips',
    'Habit tracking & posting heatmap',
    'Content Library & folders',
    'Priority feature access',
    'Full content history',
];

const FEATURE_COMPARISON = [
    { feature: 'AI Generations / month', free: '10', pro: 'Unlimited' },
    { feature: 'Brand Voice profiles', free: '1', pro: 'Unlimited' },
    { feature: 'Platforms per batch', free: '3', pro: '6 (all)' },
    { feature: 'Variations per post', free: '3', pro: 'Up to 10' },
    { feature: 'Virality scoring', free: '✓', pro: '✓ + AI tips' },
    { feature: 'Content Library', free: '—', pro: '✓' },
    { feature: 'Habit tracking', free: '—', pro: '✓' },
    { feature: 'Content history', free: '30 days', pro: 'Full archive' },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 relative overflow-hidden font-sans pt-32 pb-24">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 blur-[160px] pointer-events-none rounded-full opacity-60" />
            <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-accent/5 blur-[120px] pointer-events-none rounded-full" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-16 sm:space-y-20">

                    {/* Header */}
                    <header className="text-center">
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">Simple, transparent pricing</span>
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none mb-6">
                            START FREE.<br /><span className="text-gradient">SCALE WHEN READY.</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-white/40 text-lg font-medium max-w-xl mx-auto">
                            No credit card required to start. Upgrade to Pro when you need more power.
                        </motion.p>
                    </header>

                    {/* Pricing Cards */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

                        {/* Free */}
                        <div className="glass-card rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 border-white/5 flex flex-col">
                            <div className="mb-8">
                                <p className="text-[10px] font-black tracking-widest uppercase text-white/30 mb-4">Starter</p>
                                <div className="flex items-end gap-3 mb-3">
                                    <span className="text-5xl sm:text-6xl font-black text-white">Free</span>
                                </div>
                                <p className="text-sm text-white/30 font-medium">No credit card needed — ever.</p>
                            </div>
                            <div className="space-y-3.5 flex-1 mb-8">
                                {FREE_FEATURES.map((feat, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                            <Check className="h-3 w-3 text-white/50" />
                                        </div>
                                        <span className="text-sm font-medium text-white/60">{feat}</span>
                                    </div>
                                ))}
                            </div>
                            <Link href="/auth/signup" className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black tracking-widest uppercase text-xs hover:bg-white/10 hover:border-white/20 transition-all">
                                Get Started Free
                            </Link>
                        </div>

                        {/* Pro */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-[80px] pointer-events-none rounded-full" />
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="relative glass-card rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 border-primary/30 shadow-2xl shadow-primary/10 overflow-hidden flex flex-col"
                            >
                                {/* Top accent bar */}
                                <div className="absolute top-0 left-0 right-0 h-1 premium-gradient" />

                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-[10px] font-black tracking-widest uppercase text-primary">Founder V1</p>
                                        <span className="px-3 py-1 bg-primary/20 text-primary text-[9px] font-black tracking-widest rounded-full uppercase border border-primary/30">
                                            Best Value
                                        </span>
                                    </div>
                                    <div className="flex items-end gap-3 mb-2">
                                        <span className="text-5xl sm:text-6xl font-black text-white">$9.99</span>
                                        <span className="text-white/40 font-bold mb-2">/ month</span>
                                    </div>
                                    <p className="text-sm text-white/25 line-through font-medium">Normally $19.99 / month</p>
                                    <p className="text-xs text-primary/80 font-bold mt-1">Beta price locked in forever when you join now</p>
                                </div>

                                <div className="space-y-3.5 flex-1 mb-8">
                                    {PRO_FEATURES.map((feat, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                                <Check className="h-3 w-3 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium text-white/80">{feat}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link href="/auth/signup" className="flex items-center justify-center gap-3 w-full py-5 premium-gradient rounded-2xl text-white font-black tracking-[0.2em] uppercase text-xs shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                    Claim Beta Price
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Feature Comparison Table */}
                    <motion.div variants={itemVariants}>
                        <h2 className="text-center text-xs font-black tracking-[0.4em] uppercase text-white/20 mb-8">Full Comparison</h2>
                        <div className="glass-card rounded-[2rem] border-white/5 overflow-hidden">
                            {/* Table header */}
                            <div className="grid grid-cols-3 p-5 border-b border-white/5 bg-white/[0.02]">
                                <span className="text-[10px] font-black tracking-widest uppercase text-white/20">Feature</span>
                                <span className="text-[10px] font-black tracking-widest uppercase text-white/30 text-center">Starter</span>
                                <span className="text-[10px] font-black tracking-widest uppercase text-primary text-center">Pro</span>
                            </div>
                            {FEATURE_COMPARISON.map((row, i) => (
                                <div
                                    key={i}
                                    className={`grid grid-cols-3 p-4 sm:p-5 border-b border-white/5 last:border-0 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}
                                >
                                    <span className="text-sm font-medium text-white/50">{row.feature}</span>
                                    <span className="text-sm font-bold text-white/30 text-center">{row.free}</span>
                                    <span className={`text-sm font-bold text-center ${row.pro === '—' ? 'text-white/20' : 'text-primary'}`}>{row.pro}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* What's included section */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[
                            { icon: Zap, title: 'Instant Access', desc: 'Start generating posts the moment you sign up. No setup, no waiting.' },
                            { icon: Target, title: 'No Lock-In', desc: 'Cancel anytime from your account settings. No penalty, no hassle.' },
                            { icon: TrendingUp, title: '30-Day Guarantee', desc: "Not happy? We'll refund your first month, no questions asked." },
                        ].map((item, i) => (
                            <div key={i} className="glass-card rounded-[1.5rem] p-6 border-white/5 text-center">
                                <div className="h-12 w-12 mx-auto premium-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
                                    <item.icon className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="font-black text-white text-sm tracking-wide mb-2">{item.title}</h3>
                                <p className="text-white/40 text-xs font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* FAQ brief */}
                    <motion.div variants={itemVariants} className="text-center space-y-4">
                        <p className="text-white/30 text-sm font-medium">
                            Questions about billing? Check our{' '}
                            <Link href="/refund" className="text-primary hover:underline">Refund Policy</Link>
                            {' '}or{' '}
                            <Link href="/contact" className="text-primary hover:underline">contact support</Link>.
                        </p>
                        <p className="text-white/20 text-xs font-bold">
                            Order processing and payment is managed by <strong className="text-white/30">Paddle.com</strong> — our Merchant of Record.
                        </p>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
}
