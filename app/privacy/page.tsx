'use client';

import { motion, Variants } from 'framer-motion';
import { Eye, ShieldCheck, Database, Lock, ChevronRight } from 'lucide-react';
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

export default function PrivacyPage() {
    const protocols = [
        {
            icon: Database,
            title: "Data Collection",
            desc: "We collect only the essential neural blueprints required to personalize your brand voice and generate high-fidelity content."
        },
        {
            icon: Eye,
            title: "Operational Visibility",
            desc: "Your data is never visible to unauthorized entities. We use strictly isolated environments for generation processes."
        },
        {
            icon: ShieldCheck,
            title: "Encryption Standards",
            desc: "All data transfers are encrypted via enterprise-grade TLS 1.3 protocols, ensuring a secure uplink to the matrix."
        },
        {
            icon: Lock,
            title: "User Sovereignty",
            desc: "You retain full control over your data. You may initiate a total purge of your operational history at any time through the Command Center."
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 relative overflow-hidden font-sans pt-32 pb-20">
            {/* Cinematic Background Artifacts */}
            <div className="absolute top-0 left-0 w-[800px] h-[600px] bg-primary/5 blur-[150px] pointer-events-none rounded-full" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-12"
                >
                    {/* Header */}
                    <header className="text-center mb-16">
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                            <Lock className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">Privacy Protocol v4.2</span>
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                            PRIVACY <span className="text-gradient">POLICY</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-white/30 mt-6 font-bold tracking-widest uppercase text-xs">
                            Secure Transmissions Enabled
                        </motion.p>
                    </header>

                    {/* Protocol Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {protocols.map((protocol, i) => (
                            <motion.div key={i} variants={itemVariants} className="glass-card p-10 rounded-[2.5rem] border-white/5 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 premium-gradient blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity" />
                                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8">
                                    <protocol.icon className="h-5 w-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-black tracking-widest uppercase mb-4 text-white group-hover:text-primary transition-colors">
                                    {protocol.title}
                                </h2>
                                <p className="text-white/40 leading-relaxed font-medium text-sm">
                                    {protocol.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Integration */}
                    <motion.div variants={itemVariants} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 text-left">
                                <div className="shrink-0">
                                    <ShieldCheck className="h-8 w-8 text-primary" />
                                </div>
                                <span className="text-sm font-bold text-white/50 leading-tight">
                                    Questions regarding your data sovereignty? Our Data Protection Officer is standing by to assist your inquiry.
                                </span>
                            </div>
                            <Link href="/contact" className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-primary hover:text-white transition-colors">
                                Contact DPO <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Footer Navigation Link */}
                    <motion.div variants={itemVariants} className="text-center pt-10">
                        <Link href="/" className="text-white/20 hover:text-white transition-colors text-xs font-black tracking-[0.3em] uppercase">
                            ← Return to Matrix
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
