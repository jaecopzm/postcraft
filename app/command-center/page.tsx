'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import StagingQueue from '../../components/StagingQueue';
import PresenceHeatmap from '../../components/PresenceHeatmap';

import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CommandCenterSkeleton } from '../../components/Skeleton';

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
        return <CommandCenterSkeleton />;
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

        // Gamification: Trigger confetti for milestones (e.g., 5, 10, 15... day streaks)
        if (currentStreak > 0 && currentStreak % 5 === 0) {
            // Delay slightly so the UI renders the streak number first
            setTimeout(() => {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#F97316', '#0D9488', '#ffffff'] // Brand colors
                });
            }, 500);
        }
    };

    return (
        <div className="container mx-auto max-w-6xl animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-3 px-4 py-2 bg-orange-100 border border-orange-200 rounded-full mb-4"
                    >
                        <Rocket className="h-4 w-4 text-orange-600" />
                        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-orange-600">Mission Control</span>
                    </motion.div>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-teal-900 uppercase">Command <span className="text-gradient">Center</span></h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-white/80 to-teal-50 backdrop-blur-3xl border border-teal-200 rounded-2xl px-5 sm:px-6 py-4 flex items-center gap-4">
                        <div className="h-10 w-10 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                            <TrendingUp className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Growth Streak</p>
                            <p className="text-xl font-black text-teal-900">{streak} DAYS</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                {/* Left Column: Metrics & Heatmap */}
                <div className="lg:col-span-1 space-y-8">
                    <PresenceHeatmap publishedDates={publishedDates} />

                    <div className="bg-gradient-to-br from-white/80 to-teal-50 backdrop-blur-3xl border border-teal-200 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <ShieldCheck className="h-20 w-20 text-orange-500" />
                        </div>
                        <h4 className="text-xs font-black text-orange-600 uppercase tracking-[0.2em] mb-2">Neural Integrity</h4>
                        
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xl font-black text-teal-900 tracking-tight uppercase">Habit Score: {Math.min(streak * 10, 100)}%</p>
                                {streak > 0 && streak % 5 === 0 && (
                                    <div className="text-xs text-orange-600 font-bold animate-pulse">🔥 {streak} DAY STREAK!</div>
                                )}
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-1000 ${
                                        streak * 10 < 30 ? 'bg-red-400' : 
                                        streak * 10 < 70 ? 'bg-yellow-400' : 
                                        'bg-green-500'
                                    }`}
                                    style={{width: `${Math.min(streak * 10, 100)}%`}}
                                ></div>
                            </div>
                            
                            {/* Next Milestone */}
                            {streak < 10 && (
                                <div className="text-xs text-teal-600 font-medium mb-3">
                                    {10 - streak} days to 10-day streak milestone! 🎯
                                </div>
                            )}
                        </div>
                        
                        <p className="text-xs text-teal-600 leading-relaxed font-medium mb-4">
                            Consistent publication increases your aura's resonance across social nodes.
                        </p>
                        
                        {/* Quick Actions */}
                        <div className="flex gap-2">
                            <button 
                                onClick={() => window.location.href = '/dashboard'}
                                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors"
                            >
                                Schedule Post
                            </button>
                            <button 
                                onClick={() => window.location.href = '/analytics'}
                                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-xs font-bold transition-colors"
                            >
                                View Analytics
                            </button>
                        </div>
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
