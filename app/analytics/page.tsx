'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, TrendingUp, Target, Zap, ArrowUpRight, Hash, Activity, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalyticsSkeleton } from '../../components/Skeleton';

const PLATFORM_META: Record<string, { label: string; color: string }> = {
  twitter: { label: 'TWITTER / X', color: '#ffffff' },
  linkedin: { label: 'LINKEDIN', color: '#0A66C2' },
  instagram: { label: 'INSTAGRAM', color: '#E1306C' },
  facebook: { label: 'FACEBOOK', color: '#1877F2' },
  tiktok: { label: 'TIKTOK', color: '#00F2EA' },
  youtube: { label: 'YOUTUBE', color: '#FF0000' },
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = '#EC5800',
}: {
  icon: any; label: string; value: string | number; sub?: string; accent?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card rounded-3xl p-5 sm:p-8 relative overflow-hidden group border-white/5"
    >
      <div
        className="absolute -right-4 -top-4 w-32 h-32 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"
        style={{ background: accent }}
      />

      <div className="flex items-start justify-between mb-4 sm:mb-8">
        <div className="p-3 sm:p-4 premium-gradient rounded-2xl shadow-lg shadow-primary/20">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <ArrowUpRight className="h-5 w-5 text-white/20 group-hover:text-primary transition-colors" />
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-2xl sm:text-4xl font-black text-white tracking-tight">{value}</p>
        {sub && <p className="text-xs font-bold text-white/20 uppercase tracking-widest pt-2">{sub}</p>}
      </div>
    </motion.div>
  );
}

import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      const data = await res.json();
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const total = analytics?.totalGenerations ?? 0;
  const weekCount = analytics?.dailyUsage?.slice(-7).reduce((s: number, d: any) => s + d.count, 0) ?? 0;
  const platforms = Object.values(analytics?.platformBreakdown ?? {}).filter((c: any) => (c as number) > 0).length;
  const topics = analytics?.topTopics?.length ?? 0;

  const platformEntries: [string, number][] = Object.entries(analytics?.platformBreakdown ?? {})
    .filter(([, c]) => (c as number) > 0)
    .sort((a, b) => (b[1] as number) - (a[1] as number)) as [string, number][];

  const maxPlatformCount = platformEntries[0]?.[1] ?? 1;

  if (loading || authLoading) {
    return <AnalyticsSkeleton />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="h-12 w-12 sm:h-16 sm:w-16 premium-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gradient mb-1 sm:mb-2 tracking-tight">Intelligence</h1>
            <p className="text-white/40 font-medium text-sm sm:text-base">Deep insights into your creative momentum.</p>
          </div>
        </div>
      </motion.div>

      {/* Stat grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Zap} label="GENS" value={total} sub="LIFETIME FLOW" accent="#EC5800" />
        <StatCard icon={TrendingUp} label="WEEK" value={weekCount} sub="RECENT BURST" accent="#06B6D4" />
        <StatCard icon={Activity} label="NODES" value={platforms} sub="PLATFORMS" accent="#8B5CF6" />
        <StatCard icon={Hash} label="AREAS" value={topics} sub="UNIQ TOPICS" accent="#F59E0B" />
      </motion.div>

      {/* Data Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Platform DNA */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-10 border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />

          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-widest uppercase">Platform DNA</h3>
              <p className="text-white/20 text-xs font-bold tracking-[0.2em] mt-1">DISTRIBUTION BREAKDOWN</p>
            </div>
            <div className="px-3 sm:px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
              <span className="text-[10px] font-black text-primary tracking-widest uppercase">{total} TOTAL</span>
            </div>
          </div>

          <div className="space-y-8">
            {platformEntries.length > 0 ? platformEntries.map(([platform, count]) => {
              const meta = PLATFORM_META[platform];
              const pct = total > 0 ? (count / total) * 100 : 0;
              const barW = (count / maxPlatformCount) * 100;
              return (
                <div key={platform} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: meta?.color ?? '#EC5800' }} />
                      <span className="text-xs font-black tracking-widest text-white/50">{meta?.label ?? platform}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-white/20">{pct.toFixed(0)}%</span>
                      <span className="text-sm font-black text-white">{count}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barW}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(to right, ${meta?.color ?? '#EC5800'}, ${meta?.color ?? '#EC5800'}80)`,
                        boxShadow: `0 0 15px ${meta?.color ?? '#EC5800'}40`
                      }}
                    />
                  </div>
                </div>
              );
            }) : (
              <div className="flex flex-col items-center justify-center py-10 text-white/20 gap-4">
                <Activity className="h-10 w-10 opacity-20" />
                <p className="text-[10px] font-black tracking-widest uppercase">Waiting for data frequency...</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Neural Map / Top Topics */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-10 border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] pointer-events-none" />

          <div className="flex items-center justify-between mb-6 sm:mb-10">
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-white tracking-widest uppercase">Neural Map</h3>
              <p className="text-white/20 text-xs font-bold tracking-[0.2em] mt-1">TOP RECURRING TOPICS</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <Hash className="h-4 w-4 text-white/40" />
            </div>
          </div>

          <div className="space-y-4">
            {analytics?.topTopics?.length > 0 ? analytics.topTopics.slice(0, 6).map((topic: any, i: number) => {
              const maxCount = analytics.topTopics[0]?.count ?? 1;
              const barPct = (topic.count / maxCount) * 100;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative flex items-center gap-5 p-4 bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-2xl transition-all overflow-hidden"
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-primary opacity-[0.03] transition-all group-hover:opacity-[0.05]"
                    style={{ width: `${barPct}%` }}
                  />
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/40">
                    0{i + 1}
                  </div>
                  <span className="flex-1 text-[13px] font-black text-white/70 tracking-wide uppercase truncate relative z-10">{topic.topic}</span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 relative z-10">
                    <span className="text-[10px] font-black text-primary">{topic.count}</span>
                    <span className="text-[8px] font-black text-white/20 tracking-tighter uppercase">X</span>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="flex flex-col items-center justify-center py-10 text-white/20 gap-4">
                <Hash className="h-10 w-10 opacity-20" />
                <p className="text-[10px] font-black tracking-widest uppercase">Neural network is empty...</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}