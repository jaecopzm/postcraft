'use client';

import { motion, Variants } from 'framer-motion';
import { Sparkles, Globe, Zap, ShieldCheck, Target, Activity } from 'lucide-react';
import Link from 'next/link';

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

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary/30 relative overflow-hidden font-sans pt-32 pb-20">
            {/* Cinematic Background Artifacts */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[150px] pointer-events-none rounded-full opacity-50" />
            <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-accent/5 blur-[120px] pointer-events-none rounded-full" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-20"
                >
                    {/* Hero Section */}
                    <section className="text-center">
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">The Genesis of DraftRapid</span>
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                            NARRATING THE <span className="text-gradient">FUTURE</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                            DraftRapid isn't just a tool; it's a Neural Forge designed to bridge the gap between human creativity and machine intelligence.
                        </motion.p>
                    </section>

                    {/* Mission Section */}
                    <section className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div variants={itemVariants} className="glass-card p-10 rounded-2xl border-gray-200 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 premium-gradient opacity-10" />
                            <div className="absolute top-0 right-0 w-32 h-32 premium-gradient blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
                            <h2 className="text-3xl font-black tracking-tighter uppercase mb-6">Our Mission</h2>
                            <p className="text-gray-500 text-lg leading-relaxed mb-8">
                                We empower creators, entrepreneurs, and visionaries to command the digital landscape with precision. Our mission is to automate the mundane and elevate the exceptional, allowing you to focus on the impact of your message, not the friction of its creation.
                            </p>
                            <div className="flex items-center gap-4 text-primary">
                                <Target className="h-6 w-6" />
                                <span className="text-sm font-black tracking-widest uppercase">Targeted Excellence</span>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-8">
                            {[
                                { icon: Globe, label: 'Global Reach', desc: 'Shattering the barriers of localized content generation.' },
                                { icon: Zap, label: 'Hyper-Speed', desc: 'From inspiration to multi-platform publication in seconds.' },
                                { icon: ShieldCheck, label: 'Pure Integrity', desc: 'Maintaining the authentic essence of your brand voice.' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                                        <item.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black tracking-widest uppercase mb-1">{item.label}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </section>

                    {/* The Neural Forge */}
                    <section className="text-center space-y-12">
                        <motion.div variants={itemVariants} className="glass-card p-16 rounded-3xl border-primary/20 relative overflow-hidden">
                            <div className="absolute inset-0 premium-gradient opacity-5" />
                            <div className="relative z-10">
                                <Activity className="h-16 w-16 text-primary mx-auto mb-8 animate-pulse" />
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6">The Neural Forge</h2>
                                <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed mb-10">
                                    Built on top of cutting-edge LLM architectures, DraftRapid is continuously evolving. We're not just creating content; we're refining the way humanity interacts with information.
                                </p>
                                <Link href="/auth/signup" className="inline-flex items-center gap-3 px-10 py-5 premium-gradient rounded-full text-white text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                                    Join the Evolution
                                </Link>
                            </div>
                        </motion.div>
                    </section>

                    {/* Footer Navigation Link */}
                    <motion.div variants={itemVariants} className="text-center pt-10">
                        <Link href="/" className="text-gray-300 hover:text-gray-900 transition-colors text-xs font-black tracking-[0.3em] uppercase">
                            ← Return to Matrix
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
