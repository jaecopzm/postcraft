'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import StagingQueue from '../../components/StagingQueue';
import PresenceHeatmap from '../../components/PresenceHeatmap';

import { useRouter } from 'next/navigation';

export default function CommandCenterPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [publishedDates, setPublishedDates] = useState<Date[]>([]);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/signin');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            fetchActivity();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const fetchActivity = async () => {
        const currentUser = user;
        if (!currentUser) return;
        try {
            const idToken = await currentUser.getIdToken();
            const response = await fetch('/api/staging', {
                headers: {
                    'Authorization': `Bearer ${idToken}`
                }
            });
            const data = await response.json();
            const posts = data.posts || [];

            const liveDates = posts
                .filter((p: any) => p.status === 'live' && p.publishedAt)
                .map((p: any) => new Date(p.publishedAt));

            setPublishedDates(liveDates);
            calculateStreak(liveDates);
        } catch (error) {
            console.error('Failed to fetch activity:', error);
        }
    };

    const calculateStreak = (dates: Date[]) => {
        if (dates.length === 0) return;

        // Sort unique dates (by day)
        const uniqueDays = Array.from(new Set(dates.map(d => d.toDateString())))
            .map(s => new Date(s))
            .sort((a, b) => b.getTime() - a.getTime());

        let currentStreak = 0;
        let checkDate = new Date(new Date().toDateString());

        // If no post today, check if yesterday had one to maintain streak
        const hasPostToday = uniqueDays[0]?.toDateString() === checkDate.toDateString();
        if (!hasPostToday) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        for (const day of uniqueDays) {
            if (day.toDateString() === checkDate.toDateString()) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        setStreak(currentStreak);
    };

    return (
        <div className="container mx-auto max-w-6xl animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4"
                    >
                        <Rocket className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">Mission Control</span>
                    </motion.div>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase">Command <span className="text-gradient">Center</span></h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-card px-5 sm:px-6 py-4 rounded-2xl border-white/5 flex items-center gap-4">
                        <div className="h-10 w-10 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                            <TrendingUp className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Growth Streak</p>
                            <p className="text-xl font-black text-white">{streak} DAYS</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                {/* Left Column: Metrics & Heatmap */}
                <div className="lg:col-span-1 space-y-8">
                    <PresenceHeatmap publishedDates={publishedDates} />

                    <div className="glass-card rounded-3xl p-8 border-white/5 bg-primary/[0.02] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ShieldCheck className="h-20 w-20 text-primary" />
                        </div>
                        <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">Neural Integrity</h4>
                        <p className="text-xl font-black text-white tracking-tight uppercase mb-4">Habit Score: {Math.min(streak * 10, 100)}%</p>
                        <p className="text-xs text-white/40 leading-relaxed">
                            Consistent publication increases your aura's resonance across social nodes.
                        </p>
                    </div>
                </div>

                {/* Right Column: Staging Queue */}
                <div className="lg:col-span-2">
                    <StagingQueue />
                </div>
            </div>
        </div>
    );
}
