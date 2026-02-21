'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Send, Mail, MessageSquare, Globe, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // In a real app, you'd send this to an API
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 relative overflow-hidden font-sans pt-32 pb-20">
            {/* Cinematic Background Artifacts */}
            <div className="absolute top-0 right-0 w-[1000px] h-[600px] bg-primary/10 blur-[150px] pointer-events-none rounded-full opacity-30" />
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] pointer-events-none rounded-full" />

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid lg:grid-cols-2 gap-16 items-start"
                >
                    {/* Information Section */}
                    <div className="space-y-12">
                        <div>
                            <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                                <Globe className="h-4 w-4 text-primary" />
                                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">Global Communications</span>
                            </motion.div>
                            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-8">
                                ESTABLISH <span className="text-gradient">UPLINK</span>
                            </motion.h1>
                            <motion.p variants={itemVariants} className="text-xl text-white/40 font-medium max-w-md leading-relaxed">
                                Connect with our neural architects to explore customized solutions for your brand's digital evolution.
                            </motion.p>
                        </div>

                        <motion.div variants={itemVariants} className="space-y-6">
                            {[
                                { icon: Mail, label: 'Neural Recipient', value: 'hello@draftrapid.ai' },
                                { icon: MessageSquare, label: 'Direct Signal', value: 'Schedule a Consultation' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 items-center group cursor-pointer">
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-primary transition-colors">
                                        <item.icon className="h-6 w-6 text-white/30 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-[10px] font-black tracking-[0.2em] uppercase text-white/20 mb-1">{item.label}</h3>
                                        <p className="text-lg font-bold text-white group-hover:text-primary transition-colors">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Form Section */}
                    <motion.div variants={itemVariants} className="relative">
                        <AnimatePresence mode="wait">
                            {!submitted ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="glass-card p-12 rounded-[3.5rem] border-white/5 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 premium-gradient opacity-10" />
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black tracking-[0.3em] uppercase text-white/20 ml-2">Designation</label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Your Name"
                                                    className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/10 font-bold focus:outline-none focus:border-primary/50 transition-all"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black tracking-[0.3em] uppercase text-white/20 ml-2">Digital Address</label>
                                                <input
                                                    required
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/10 font-bold focus:outline-none focus:border-primary/50 transition-all"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black tracking-[0.3em] uppercase text-white/20 ml-2">Transmission</label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    placeholder="What would you like to discuss?"
                                                    className="w-full px-8 py-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/10 font-bold focus:outline-none focus:border-primary/50 transition-all resize-none"
                                                    value={formData.message}
                                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-6 premium-gradient rounded-2xl text-white text-xs font-black tracking-[0.4em] uppercase shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                                        >
                                            Initialize Uplink
                                            <Send className="h-4 w-4" />
                                        </button>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-card p-20 rounded-[4rem] border-primary/20 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]"
                                >
                                    <div className="absolute inset-0 premium-gradient opacity-5" />
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                                    >
                                        <CheckCircle2 className="h-20 w-20 text-primary mb-8" />
                                    </motion.div>
                                    <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">Uplink Success</h2>
                                    <p className="text-lg text-white/40 font-medium max-w-xs mx-auto leading-relaxed mb-10">
                                        Your signal has been received by our neural architects. Expect a response within one operational cycle.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        Send New Signal <ChevronRight className="h-4 w-4" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>

                {/* Footer Navigation Link */}
                <motion.div variants={itemVariants} initial="hidden" animate="visible" className="text-center pt-24">
                    <Link href="/" className="text-white/20 hover:text-white transition-colors text-xs font-black tracking-[0.3em] uppercase">
                        ← Return to Matrix
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
