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
      whileHover={{ y: -2, scale: 1.01 }}
      className="glass-card rounded-xl p-4 sm:p-5 relative overflow-hidden group border-border"
    >
      <div
        className="absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"
        style={{ background: accent }}
      />

      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="p-2 sm:p-2.5 premium-gradient rounded-lg shadow-lg shadow-primary/20">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-primary transition-colors" />
      </div>

      <div className="space-y-0.5">
        <p className="text-[10px] font-bold text-accent/40 uppercase tracking-wider">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold text-foreground">{value}</p>
        {sub && <p className="text-[10px] text-accent/30 uppercase tracking-wide pt-1">{sub}</p>}
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
      className="space-y-6 sm:space-y-8 px-4 sm:px-0"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-2 sm:mb-3">
            <BarChart3 className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-primary">Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">Performance <span className="text-gradient">Insights</span></h1>
          <p className="text-accent/60 text-xs sm:text-sm mt-1">Track your content generation activity.</p>
        </div>
      </motion.div>

      {/* Stat grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Zap} label="Total" value={total} sub="Generations" accent="#EC5800" />
        <StatCard icon={TrendingUp} label="This Week" value={weekCount} sub="Recent" accent="#06B6D4" />
        <StatCard icon={Activity} label="Platforms" value={platforms} sub="Active" accent="#8B5CF6" />
        <StatCard icon={Hash} label="Topics" value={topics} sub="Unique" accent="#F59E0B" />
      </motion.div>

      {/* Data Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Platform Breakdown */}
        <motion.div variants={itemVariants} className="glass-card rounded-xl p-4 sm:p-6 border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] pointer-events-none" />

          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">Platform Breakdown</h3>
              <p className="text-accent/40 text-[10px] sm:text-xs mt-0.5">Distribution by platform</p>
            </div>
            <div className="px-2.5 sm:px-3 py-1 bg-accent/5 rounded-full border border-accent/10">
              <span className="text-[9px] sm:text-[10px] font-bold text-primary tracking-wide uppercase">{total} Total</span>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5">
            {platformEntries.length > 0 ? platformEntries.map(([platform, count]) => {
              const meta = PLATFORM_META[platform];
              const pct = total > 0 ? (count / total) * 100 : 0;
              const barW = (count / maxPlatformCount) * 100;
              return (
                <div key={platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: meta?.color ?? '#EC5800' }} />
                      <span className="text-[11px] sm:text-xs font-bold text-accent/40">{meta?.label ?? platform}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-[10px] font-bold text-accent/30">{pct.toFixed(0)}%</span>
                      <span className="text-sm font-bold text-foreground">{count}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-accent/5 rounded-full overflow-hidden border border-accent/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barW}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(to right, ${meta?.color ?? '#EC5800'}, ${meta?.color ?? '#EC5800'}80)`,
                        boxShadow: `0 0 10px ${meta?.color ?? '#EC5800'}30`
                      }}
                    />
                  </div>
                </div>
              );
            }) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-300 gap-3">
                <Activity className="h-8 w-8 opacity-20" />
                <p className="text-[10px] font-bold tracking-wide uppercase">No data yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Topics */}
        <motion.div variants={itemVariants} className="glass-card rounded-xl p-4 sm:p-6 border-border relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 blur-[80px] pointer-events-none" />

          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">Top Topics</h3>
              <p className="text-accent/40 text-[10px] sm:text-xs mt-0.5">Most generated topics</p>
            </div>
            <div className="p-2 bg-accent/5 rounded-lg border border-accent/10">
              <Hash className="h-4 w-4 text-accent/20" />
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {analytics?.topTopics?.length > 0 ? analytics.topTopics.slice(0, 6).map((topic: any, i: number) => {
              const maxCount = analytics.topTopics[0]?.count ?? 1;
              const barPct = (topic.count / maxCount) * 100;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative flex items-center gap-3 p-3 bg-accent/5 border border-border hover:border-accent/20 rounded-lg transition-all overflow-hidden"
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-primary opacity-[0.03] transition-all group-hover:opacity-[0.05]"
                    style={{ width: `${barPct}%` }}
                  />
                  <div className="shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white border border-border flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-accent/20">
                    {i + 1}
                  </div>
                  <span className="flex-1 text-xs sm:text-sm font-bold text-foreground truncate relative z-10">{topic.topic}</span>
                  <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 bg-white rounded-lg border border-border relative z-10">
                    <span className="text-[10px] font-bold text-primary">{topic.count}</span>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-300 gap-3">
                <Hash className="h-8 w-8 opacity-20" />
                <p className="text-[10px] font-bold tracking-wide uppercase">No topics yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}