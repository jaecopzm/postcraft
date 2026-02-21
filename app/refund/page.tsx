'use client';

import { motion, Variants } from 'framer-motion';
import { RefreshCcw, Clock, CreditCard, HelpCircle, ChevronRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const sections = [
    {
        icon: RefreshCcw,
        title: '30-Day Money-Back Guarantee',
        content: `If you are not satisfied with DraftRapid for any reason, you may request a full refund within 30 days of your initial purchase. No questions asked. To request a refund, contact our support team at support@draftrapid.app with your order details. Refunds are processed within 5–10 business days and returned to your original payment method.`
    },
    {
        icon: Clock,
        title: 'Subscription Cancellations',
        content: `You may cancel your DraftRapid subscription at any time from your account settings. Upon cancellation, you will retain access to Pro features until the end of your current billing period. We do not offer prorated refunds for mid-period cancellations unless your request falls within the 30-day guarantee window above.`
    },
    {
        icon: CreditCard,
        title: 'How Refunds Are Processed',
        content: `DraftRapid's order process and billing are managed by Paddle.com, our Merchant of Record. Paddle handles all payment processing, customer service inquiries, and returns on our behalf. When you request a refund, it will be processed by Paddle and returned to the original payment method within 5–10 business days, depending on your bank or card provider.`
    },
    {
        icon: HelpCircle,
        title: 'Exceptions',
        content: `Refunds will not be issued for accounts found to be in violation of our Terms of Service, including abuse of the generation system, fraudulent activity, or circumvention of usage limits. Refund requests submitted after the 30-day window will be reviewed on a case-by-case basis at our sole discretion.`
    }
];

export default function RefundPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 relative overflow-hidden font-sans pt-32 pb-20">
            <div className="absolute top-0 right-0 w-[700px] h-[500px] bg-primary/5 blur-[150px] pointer-events-none rounded-full" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">

                    {/* Header */}
                    <header className="text-center mb-12">
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
                            <RefreshCcw className="h-4 w-4 text-primary" />
                            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">Customer Guarantee</span>
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                            REFUND <span className="text-gradient">POLICY</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-white/30 mt-6 font-bold tracking-widest uppercase text-xs">
                            Last Updated: February 21, 2026
                        </motion.p>
                    </header>

                    {/* Callout: Paddle MoR notice */}
                    <motion.div variants={itemVariants} className="flex items-start gap-4 p-6 bg-primary/5 border border-primary/15 rounded-2xl">
                        <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-white/60 font-medium leading-relaxed">
                            Our order process is conducted by our online reseller <strong className="text-white">Paddle.com</strong>. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.
                        </p>
                    </motion.div>

                    {/* Sections */}
                    <div className="space-y-5">
                        {sections.map((section, i) => (
                            <motion.div key={i} variants={itemVariants} className="glass-card p-8 sm:p-10 rounded-[2rem] border-white/5 relative group">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                                        <section.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black tracking-wide uppercase mb-3 text-white group-hover:text-primary transition-colors">
                                            {section.title}
                                        </h2>
                                        <p className="text-white/40 leading-relaxed font-medium text-sm sm:text-base">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact CTA */}
                    <motion.div variants={itemVariants} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <span className="text-sm font-bold text-white/50 leading-tight">
                                Need help with a refund or cancellation? Our support team responds within 24 hours.
                            </span>
                            <Link href="/contact" className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-primary hover:text-white transition-colors whitespace-nowrap">
                                Contact Support <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-center pt-8">
                        <Link href="/" className="text-white/20 hover:text-white transition-colors text-xs font-black tracking-[0.3em] uppercase">
                            ← Back to Home
                        </Link>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
}
