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
            desc: "We collect only the essential information required to personalize your brand voice and generate content."
        },
        {
            icon: Eye,
            title: "Data Visibility",
            desc: "Your data is never visible to unauthorized parties. We use secure, isolated environments for all processing."
        },
        {
            icon: ShieldCheck,
            title: "Encryption Standards",
            desc: "All data transfers are encrypted via enterprise-grade TLS 1.3 protocols, ensuring secure communication."
        },
        {
            icon: Lock,
            title: "User Ownership",
            desc: "You retain full ownership and control over your data. We act solely as a processor, never claiming rights to your intellectual property."
        },
        {
            icon: ChevronRight,
            title: "No Data Reselling",
            desc: "We do not resell or share your data with third parties for marketing or any other purposes. Your trust is our most valuable asset."
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-primary/5 to-accent/10 text-gray-900 selection:bg-primary/20 relative overflow-hidden font-sans pt-32 pb-20">
            {/* Background glow */}
            <div className="absolute top-0 left-0 w-[800px] h-[600px] bg-primary/[0.03] blur-[150px] pointer-events-none rounded-full" />

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
                            <span className="text-[10px] font-bold uppercase text-primary">Privacy Policy</span>
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                            Privacy <span className="text-gradient">Policy</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-gray-500 mt-6 font-medium text-sm">
                            Your data is secure with us
                        </motion.p>
                    </header>

                    {/* Protocol Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {protocols.map((protocol, i) => (
                            <motion.div key={i} variants={itemVariants} className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 relative group overflow-hidden shadow-sm">
                                <div className="absolute top-0 right-0 w-24 h-24 premium-gradient blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity" />
                                <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-6">
                                    <protocol.icon className="h-5 w-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-primary transition-colors">
                                    {protocol.title}
                                </h2>
                                <p className="text-gray-600 leading-relaxed font-medium text-sm">
                                    {protocol.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Integration */}
                    <motion.div variants={itemVariants} className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 text-left">
                                <div className="shrink-0">
                                    <ShieldCheck className="h-8 w-8 text-primary" />
                                </div>
                                <span className="text-sm font-medium text-gray-600 leading-tight">
                                    Questions about your data? Our Data Protection Officer is here to help.
                                </span>
                            </div>
                            <Link href="/contact" className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-gray-900 transition-colors whitespace-nowrap">
                                Contact DPO <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Footer Navigation Link */}
                    <motion.div variants={itemVariants} className="text-center pt-10">
                        <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-semibold">
                            ← Return to Home
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
