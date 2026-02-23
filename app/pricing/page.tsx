'use client';

import { motion, Variants } from 'framer-motion';
import { Sparkles, Check, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { loadPaddle } from '@/lib/loadPaddle';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Declare Paddle globally
declare global {
    interface Window {
        Paddle?: any;
    }
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

const FREE_FEATURES = [
    '10 AI generations per month',
    '1 Brand Voice profile',
    '3 platforms per generation',
    '3 variations per post',
    'Basic virality scoring',
    'Content history (30 days)',
    'Export to CSV',
    'Community support',
];

const PRO_FEATURES = [
    'Unlimited AI generations',
    'Unlimited Brand Voice profiles',
    'All 6 platforms per generation',
    'Up to 10 variations per post',
    'Advanced virality scoring with AI tips',
    'Habit tracking & posting heatmap',
    'Content Library with folders & tags',
    'Full content history & archive',
    'Export to CSV & PDF',
    'Priority email support',
    'Early access to new features',
];

const FEATURE_COMPARISON = [
    { category: 'Content Generation', features: [
        { feature: 'AI Generations / month', free: '10', pro: 'Unlimited' },
        { feature: 'Platforms per generation', free: '3', pro: '6 (all)' },
        { feature: 'Variations per post', free: '3', pro: 'Up to 10' },
        { feature: 'Generation speed', free: 'Standard', pro: 'Priority queue' },
    ]},
    { category: 'Brand Voice', features: [
        { feature: 'Brand Voice profiles', free: '1', pro: 'Unlimited' },
        { feature: 'Voice training samples', free: 'Basic', pro: 'Advanced' },
        { feature: 'Tone customization', free: '✓', pro: '✓' },
    ]},
    { category: 'Content Management', features: [
        { feature: 'Content Library', free: '—', pro: '✓' },
        { feature: 'Folders & organization', free: '—', pro: '✓' },
        { feature: 'Tags & search', free: '—', pro: '✓' },
        { feature: 'Content history', free: '30 days', pro: 'Unlimited' },
    ]},
    { category: 'Analytics & Insights', features: [
        { feature: 'Virality scoring', free: 'Basic', pro: 'Advanced + AI tips' },
        { feature: 'Habit tracking', free: '—', pro: '✓' },
        { feature: 'Posting heatmap', free: '—', pro: '✓' },
        { feature: 'Performance insights', free: '—', pro: '✓' },
    ]},
    { category: 'Export & Integration', features: [
        { feature: 'Export to CSV', free: '✓', pro: '✓' },
        { feature: 'Export to PDF', free: '—', pro: '✓' },
        { feature: 'Bulk export', free: '—', pro: '✓' },
    ]},
    { category: 'Support', features: [
        { feature: 'Community support', free: '✓', pro: '✓' },
        { feature: 'Email support', free: '—', pro: 'Priority' },
        { feature: 'Feature requests', free: '—', pro: 'Priority' },
    ]},
];

export default function PricingPage() {
    const { user } = useAuth();
    const router = useRouter();
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
                            console.log("Paddle Event:", data.name, data);
                            if (data.name === 'checkout.completed') {
                                router.push('/dashboard?success=true');
                            }
                        }
                    });
                    if (mounted) setIsPaddleLoaded(true);
                } catch (err) {
                    console.error("Paddle Initialization Error:", err);
                }
            })
            .catch((err) => console.warn('Paddle not loaded yet:', err));
        return () => { mounted = false; };
    }, [router]);

    const handleCheckout = async () => {
        console.log("Checkout button clicked");
        if (!user) {
            console.log("No user, redirecting to signup");
            router.push('/auth/signup?callbackUrl=/pricing');
            return;
        }

        try {
            console.log("Fetching auth token...");
            const token = await user.getIdToken();
            console.log("Calling /api/checkout...");
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) {
                console.error("Failed to authorize checkout", await res.text());
                return;
            }
            console.log("Backend authorized checkout");

            const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID;
            console.log("Using Price ID:", priceId || "MISSING PRICE ID");

            try {
                const Paddle = await loadPaddle();
                if (Paddle) {
                    console.log("Opening Paddle checkout...");
                    Paddle.Checkout.open({
                        items: [
                            {
                                priceId: priceId || 'pri_01jkyg...placeholder',
                                quantity: 1
                            }
                        ],
                        customer: {
                            email: user.email || '' // Providing email helps prefill the checkout
                        },
                        customData: {
                            userId: user.uid
                        },
                        settings: {
                            successUrl: `${window.location.origin}/dashboard?success=true`
                        }
                    });
                } else {
                    console.error("Paddle SDK is not available");
                }
            } catch (err) {
                console.error('Error loading Paddle SDK:', err);
            }
        } catch (error) {
            console.error("Checkout error catch block:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-primary/5 to-accent/10 text-gray-900 selection:bg-primary/20 relative overflow-hidden font-sans pt-32 pb-24">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/[0.03] blur-[160px] pointer-events-none rounded-full opacity-60" />
            <div className="absolute bottom-0 right-[-10%] w-[500px] h-[500px] bg-accent/[0.02] blur-[120px] pointer-events-none rounded-full" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-16 sm:space-y-20">

                    {/* Header */}
                    <header className="text-center">
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-bold uppercase text-primary">Simple, transparent pricing</span>
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
                            Start Free.<br /><span className="text-gradient">Scale When Ready.</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-gray-600 text-lg font-medium max-w-xl mx-auto">
                            No credit card required to start. Upgrade to Pro when you need more power.
                        </motion.p>
                    </header>

                    {/* Pricing Cards */}
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">

                        {/* Free */}
                        <div className="bg-white rounded-2xl p-8 sm:p-10 border-2 border-gray-200 flex flex-col shadow-sm">
                            <div className="mb-8">
                                <p className="text-[10px] font-bold uppercase text-gray-500 mb-4">Starter</p>
                                <div className="flex items-end gap-3 mb-3">
                                    <span className="text-5xl sm:text-6xl font-black text-gray-900">Free</span>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">No credit card needed — ever.</p>
                            </div>
                            <div className="space-y-3.5 flex-1 mb-8">
                                {FREE_FEATURES.map((feat, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="h-3 w-3 text-gray-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{feat}</span>
                                    </div>
                                ))}
                            </div>
                            <Link href="/auth/signup" className="flex items-center justify-center gap-2 w-full py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-bold uppercase text-xs hover:bg-gray-100 hover:border-gray-300 transition-all">
                                Get Started Free
                            </Link>
                        </div>

                        {/* Pro */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/10 blur-[80px] pointer-events-none rounded-full" />
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="relative bg-white rounded-2xl p-8 sm:p-10 border-2 border-primary/30 shadow-xl shadow-primary/5 overflow-hidden flex flex-col"
                            >
                                {/* Top accent bar */}
                                <div className="absolute top-0 left-0 right-0 h-1 premium-gradient" />

                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-[10px] font-bold uppercase text-primary">Pro</p>
                                        <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-bold rounded-full uppercase border border-primary/20">
                                            Best Value
                                        </span>
                                    </div>
                                    <div className="flex items-end gap-3 mb-2">
                                        <span className="text-5xl sm:text-6xl font-black text-gray-900">$9.99</span>
                                        <span className="text-gray-600 font-bold mb-2">/ month</span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-through font-medium">Normally $19.99 / month</p>
                                    <p className="text-xs text-primary font-semibold mt-1">Beta price — lock it in forever</p>
                                </div>

                                <div className="space-y-3.5 flex-1 mb-8">
                                    {PRO_FEATURES.map((feat, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check className="h-3 w-3 text-primary" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{feat}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="flex items-center justify-center gap-3 w-full py-5 premium-gradient rounded-xl text-white font-bold uppercase text-xs shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                >
                                    Upgrade to Pro
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Feature Comparison Table */}
                    <motion.div variants={itemVariants} className="space-y-8">
                        <h2 className="text-center text-sm font-bold uppercase text-gray-600 mb-8">Full Feature Comparison</h2>
                        <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm">
                            {FEATURE_COMPARISON.map((section, sectionIdx) => (
                                <div key={sectionIdx}>
                                    {/* Category Header */}
                                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                                        <h3 className="text-xs font-bold uppercase text-gray-700">{section.category}</h3>
                                    </div>
                                    {/* Features in this category */}
                                    {section.features.map((row, i) => (
                                        <div
                                            key={i}
                                            className="grid grid-cols-3 gap-4 px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors"
                                        >
                                            <span className="text-sm font-medium text-gray-700">{row.feature}</span>
                                            <span className="text-sm font-semibold text-gray-600 text-center">{row.free}</span>
                                            <span className={`text-sm font-semibold text-center ${row.pro === '—' ? 'text-gray-400' : 'text-primary'}`}>{row.pro}</span>
                                        </div>
                                    ))}
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
                            <div key={i} className="bg-white rounded-xl p-6 border-2 border-gray-200 text-center shadow-sm">
                                <div className="h-12 w-12 mx-auto premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
                                    <item.icon className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-xs font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* FAQ brief */}
                    <motion.div variants={itemVariants} className="text-center space-y-4">
                        <p className="text-gray-600 text-sm font-medium">
                            Questions about billing? Check our{' '}
                            <Link href="/refund" className="text-primary hover:underline font-semibold">Refund Policy</Link>
                            {' '}or{' '}
                            <Link href="/contact" className="text-primary hover:underline font-semibold">contact support</Link>.
                        </p>
                        <p className="text-gray-500 text-xs font-medium">
                            Order processing and payment is managed by <strong className="text-gray-700">Paddle.com</strong> — our Merchant of Record.
                        </p>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
}
