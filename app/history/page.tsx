'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Heart, Clock, History, Search, Sparkles, ArrowRight,
  Trash2, RefreshCcw, ChevronDown, X, SlidersHorizontal, Copy
} from 'lucide-react';
import PlatformPreview from '../../components/PlatformPreview';
import { motion, AnimatePresence, useScroll, useTransform, Variants } from 'framer-motion';
import { HistorySkeleton } from '../../components/Skeleton';
import Link from 'next/link';
import { useToast } from '../../components/Toast';
import { XIcon, LinkedInIcon, InstagramIcon, FacebookIcon, TikTokIcon, YouTubeIcon } from '../../components/SocialIcons';
import { useRouter } from 'next/navigation';

/* ── helpers ─────────────────────────────────────────────────── */
const PLATFORMS = [
  { value: 'all', label: 'All', Icon: null },
  { value: 'twitter', label: 'X', Icon: XIcon },
  { value: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon },
  { value: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { value: 'facebook', label: 'Facebook', Icon: FacebookIcon },
  { value: 'tiktok', label: 'TikTok', Icon: TikTokIcon },
  { value: 'youtube', label: 'YouTube', Icon: YouTubeIcon },
];

function getPlatformIcon(platform: string, cls = 'h-3 w-3') {
  const map: Record<string, any> = {
    twitter: XIcon,
    linkedin: LinkedInIcon,
    instagram: InstagramIcon,
    facebook: FacebookIcon,
    tiktok: TikTokIcon,
    youtube: YouTubeIcon,
  };
  const Icon = map[platform.toLowerCase()];
  return Icon ? <Icon className={cls} /> : <Sparkles className={cls} />;
}

function relativeTime(date: Date) {
  const diff = Date.now() - date.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/* ── main component ───────────────────────────────────────────── */
export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [history, setHistory] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const itemsPerPage = 8;

  /* ── auth guard ── */
  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/signin');
  }, [user, authLoading, router]);

  useEffect(() => { if (user) fetchHistory(); }, [user]);

  /* ── data ── */
  const fetchHistory = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/history', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setHistory(data.history || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      await fetch('/api/history', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, favorite: !current }),
      });
      setHistory(p => p.map(i => i.id === id ? { ...i, favorite: !current } : i));
      toast(current ? 'Removed from favorites' : 'Added to favorites ♥');
    } catch {
      toast('Failed to update', 'error');
    }
  };

  const deleteEntry = async (id: string) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      await fetch('/api/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id }),
      });
      setHistory(p => p.filter(i => i.id !== id));
      setDeletingId(null);
      toast('Entry deleted');
    } catch {
      toast('Failed to delete', 'error');
    }
  };

  const copyAll = (results: any[]) => {
    const text = results.map(r => `--- ${r.platform.toUpperCase()} ---\n${r.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
    toast('All posts copied!');
  };

  const regenerate = (topic: string) => router.push(`/dashboard?topic=${encodeURIComponent(topic)}`);

  /* ── filtering ── */
  const filtered = history
    .filter(i => filter === 'favorites' ? i.favorite : true)
    .filter(i => !search || i.topic?.toLowerCase().includes(search.toLowerCase()))
    .filter(i => platformFilter === 'all' || i.results?.some((r: any) => r.platform === platformFilter))
    .filter(i => {
      if (timeFilter === 'all') return true;
      const date = new Date(i.timestamp).getTime();
      const now = Date.now();
      const days = parseInt(timeFilter);
      return (now - date) <= (days * 24 * 60 * 60 * 1000);
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const favCount = history.filter(i => i.favorite).length;
  const activeFilters = (filter !== 'all' ? 1 : 0) + (platformFilter !== 'all' ? 1 : 0) + (timeFilter !== 'all' ? 1 : 0) + (search ? 1 : 0);

  useEffect(() => setCurrentPage(1), [filter, search, platformFilter, timeFilter]);

  if (loading || authLoading) return <HistorySkeleton />;

  /* ── animations ── */
  const stagger: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } };
  const rise: Variants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto pb-24"
    >
      {/* ── Page Header ─────────────────────────────────────── */}
      <motion.div variants={rise} className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 pt-2 px-4 sm:px-0">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="h-11 w-11 sm:h-14 sm:w-14 premium-gradient rounded-2xl flex items-center justify-center shadow-xl shadow-primary/25 overflow-hidden ring-1 ring-white/20">
              <History className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
            </div>
            {/* pulse ring */}
            <span className="absolute inset-0 rounded-2xl animate-ping bg-primary/20 pointer-events-none" style={{ animationDuration: '3s' }} />
          </div>
          <div>
            <p className="text-[9px] font-black tracking-[0.25em] uppercase text-primary mb-0.5">Temporal Archive</p>
            <h1 className="text-xl sm:text-4xl font-black text-white tracking-tighter leading-none uppercase">
              Synthetic <span className="text-gradient">History</span>
            </h1>
          </div>
        </div>

        {/* right pill: total count */}
        <div className="sm:ml-auto shrink-0 flex">
          <div className="px-3 py-1.5 glass-card rounded-xl border-white/10 w-fit">
            <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">{history.length} entries</span>
          </div>
        </div>
      </motion.div>

      {/* ── Sticky Toolbar ─────────────────────────────────── */}
      <motion.div
        variants={rise}
        className="sticky top-0 z-30 bg-[#0A0A0B]/80 backdrop-blur-2xl border-b border-white/5 px-4 sm:px-6 py-4 mb-6 sm:mb-8 sm:rounded-2xl sm:border sm:border-white/5 sm:bg-white/[0.02] sm:backdrop-blur-none sm:static sm:py-5"
      >
        {/* search row */}
        <div className="flex items-center gap-2 w-full max-w-full">
          <div className={`relative flex-1 min-w-0 transition-all duration-500 ease-[0.22,1,0.36,1] ${searchFocused ? 'flex-[2]' : ''}`}>
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <Search className={`h-4 w-4 transition-colors duration-300 ${searchFocused ? 'text-primary' : 'text-white/20'}`} />
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search topics…"
              className="w-full pl-10 pr-10 py-3 bg-white/[0.04] border border-white/10 rounded-xl focus:outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 text-white text-[13px] font-medium placeholder-white/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/20 hover:text-white/60 transition-colors bg-white/5 rounded-lg border border-white/10"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setFiltersOpen(p => !p)}
            className={`relative flex items-center gap-1.5 px-3.5 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shrink-0 ${filtersOpen || activeFilters > 0 ? 'bg-primary/15 border border-primary/30 text-primary' : 'bg-white/5 border border-white/10 text-white/40 hover:text-white'}`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilters > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-primary rounded-full text-[8px] font-black text-white flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>

          {/* fav toggle */}
          <button
            onClick={() => setFilter(p => p === 'favorites' ? 'all' : 'favorites')}
            className={`flex items-center gap-1.5 px-3.5 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shrink-0 ${filter === 'favorites' ? 'bg-accent/10 border border-accent/30 text-accent' : 'bg-white/5 border border-white/10 text-white/40 hover:text-white'}`}
          >
            <Heart className={`h-3.5 w-3.5 ${filter === 'favorites' ? 'fill-accent' : ''}`} />
            <span className="hidden sm:inline">{favCount}</span>
          </button>
        </div>

        {/* expandable platform filters */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-4 flex flex-col gap-4">
                {/* Platform Filters */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {PLATFORMS.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      onClick={() => setPlatformFilter(value)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shrink-0 ${platformFilter === value ? 'bg-primary/15 border border-primary/30 text-primary' : 'bg-white/5 border border-white/10 text-white/30 hover:text-white'}`}
                    >
                      {Icon && <Icon className="h-3 w-3" />}
                      {label}
                    </button>
                  ))}
                </div>

                {/* Time Filter */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {[
                    { value: 'all', label: 'All Time' },
                    { value: '1', label: 'Last 24 Hours' },
                    { value: '7', label: 'Last 7 Days' },
                    { value: '30', label: 'Last 30 Days' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setTimeFilter(value)}
                      className={`flex items-center px-3.5 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shrink-0 ${timeFilter === value ? 'bg-primary/15 border border-primary/30 text-primary' : 'bg-white/5 border border-white/10 text-white/30 hover:text-white'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Result count ─────────────────────────────────────── */}
      <motion.div variants={rise} className="px-4 sm:px-0 mb-4">
        <p className="text-[9px] font-black tracking-[0.2em] text-white/20 uppercase">
          {filtered.length === 0 ? 'No results' : `${paginated.length} of ${filtered.length} entries`}
        </p>
      </motion.div>

      {/* ── Cards ────────────────────────────────────────────── */}
      <AnimatePresence mode="popLayout">
        {paginated.length > 0 ? (
          <div className="space-y-4 px-4 sm:px-0">
            {paginated.map((entry) => {
              const date = new Date(entry.timestamp);
              const isExpanded = expandedId === entry.id;

              return (
                <motion.article
                  key={entry.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative"
                >
                  {/* hover glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/15 via-transparent to-primary/10 rounded-[1.75rem] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative glass-card rounded-[1.5rem] border-white/[0.06] group-hover:border-white/15 transition-colors duration-300 bg-[#0A0A0B]/90 overflow-hidden">

                    {/* ── Card Header ── */}
                    <div className="p-5 sm:p-7">
                      <div className="flex items-start gap-3">
                        {/* icon */}
                        <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                          <History className="h-4 w-4 sm:h-5 sm:w-5 text-white/20 group-hover:text-primary transition-colors duration-500" />
                        </div>

                        {/* topic + meta */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-xl font-black text-white tracking-tight leading-tight uppercase truncate mb-1">
                            {entry.topic}
                          </h3>
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="flex items-center gap-1 text-[9px] font-black tracking-widest text-white/25 uppercase">
                              <Clock className="h-2.5 w-2.5" />
                              {relativeTime(date)}
                            </span>
                            <span className="text-white/10">·</span>
                            <span className="text-[9px] font-black tracking-widest text-white/25 uppercase">
                              {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                            {/* platform pills */}
                            <div className="flex items-center gap-1 ml-auto sm:ml-0">
                              {entry.results?.slice(0, 5).map((r: any, idx: number) => (
                                <span key={`${r.platform}-${idx}`} className="p-1 bg-white/[0.04] rounded-md border border-white/[0.06] text-white/30">
                                  {getPlatformIcon(r.platform)}
                                </span>
                              ))}
                              {entry.results?.length > 5 && (
                                <span className="text-[9px] font-black text-white/20">+{entry.results.length - 5}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* favorite star — always visible */}
                        <button
                          onClick={() => toggleFavorite(entry.id, entry.favorite)}
                          className={`p-2 rounded-xl border transition-all shrink-0 active:scale-90 ${entry.favorite ? 'bg-accent/10 border-accent/25 text-accent' : 'bg-white/[0.04] border-white/[0.08] text-white/20 hover:text-white/60'}`}
                        >
                          <Heart className={`h-4 w-4 ${entry.favorite ? 'fill-accent' : ''}`} />
                        </button>
                      </div>

                      {/* ── Action row ── */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4">
                        {/* utility buttons group */}
                        <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
                          <button
                            onClick={() => regenerate(entry.topic)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 bg-primary/10 border border-primary/20 rounded-xl text-[10px] font-black tracking-widest text-primary hover:bg-primary/20 active:scale-95 transition-all uppercase min-w-0"
                          >
                            <RefreshCcw className="h-3.5 w-3.5 shrink-0" />
                            <span className="hidden sm:inline truncate">Redo</span>
                          </button>

                          <button
                            onClick={() => copyAll(entry.results)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[10px] font-black tracking-widest text-white/35 hover:text-white hover:bg-white/10 active:scale-95 transition-all uppercase min-w-0"
                          >
                            <Copy className="h-3.5 w-3.5 shrink-0" />
                            <span className="hidden sm:inline truncate">Copy</span>
                          </button>

                          {/* delete */}
                          <button
                            onClick={() => setDeletingId(entry.id)}
                            className="p-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/20 hover:text-red-400 hover:border-red-500/20 active:scale-95 transition-all shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* expand / collapse */}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                          className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[10px] font-black tracking-widest text-white/35 hover:text-white active:scale-95 transition-all uppercase truncate"
                        >
                          <span>{isExpanded ? 'Collapse' : `View ${entry.results?.length ?? 0}`}</span>
                          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.25 }}>
                            <ChevronDown className="h-3.5 w-3.5" />
                          </motion.div>
                        </button>
                      </div>
                    </div>

                    {/* ── Expanded previews ── */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-white/[0.06] px-4 sm:px-6 py-4 sm:py-6">
                            {/* simplified grid for better visibility */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:overflow-visible">
                              {entry.results?.map((res: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="w-full bg-[#0F0F12] border border-white/[0.06] rounded-2xl p-4 hover:border-white/15 transition-colors duration-300"
                                >
                                  <PlatformPreview
                                    platform={res.platform}
                                    content={res.content}
                                    characterCount={res.characterCount}
                                    initialExpanded={false}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ── Delete confirmation overlay ── */}
                    <AnimatePresence>
                      {deletingId === entry.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-[#050505]/92 backdrop-blur-xl flex flex-col items-center justify-center px-6 text-center z-50 rounded-[1.5rem]"
                        >
                          <div className="h-14 w-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-5 border border-red-500/20">
                            <Trash2 className="h-7 w-7 text-red-400" />
                          </div>
                          <h4 className="text-lg font-black text-white tracking-widest uppercase mb-2">Delete?</h4>
                          <p className="text-xs text-white/35 mb-6 max-w-[220px] leading-relaxed">This entry and all its posts will be permanently removed.</p>
                          <div className="flex items-center gap-3">
                            <button onClick={() => deleteEntry(entry.id)} className="px-6 py-3 bg-red-500 text-white text-[10px] font-black tracking-[0.2em] uppercase rounded-xl hover:bg-red-400 active:scale-95 transition-all">
                              Delete
                            </button>
                            <button onClick={() => setDeletingId(null)} className="px-6 py-3 bg-white/[0.05] text-white/40 text-[10px] font-black tracking-[0.2em] uppercase rounded-xl hover:bg-white/10 active:scale-95 transition-all">
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : (
          /* ── Empty state ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 sm:py-32 px-8 text-center mx-4 sm:mx-0 glass-card rounded-[2rem] border-dashed border-white/10"
          >
            <div className="relative h-20 w-20 mb-8">
              <div className="h-full w-full bg-white/[0.04] rounded-3xl flex items-center justify-center border border-white/[0.08]">
                <History className="h-9 w-9 text-white/10" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-3 border border-dashed border-white/[0.07] rounded-full"
              />
            </div>

            {search && filtered.length === 0 ? (
              <>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-widest uppercase mb-3 text-balance">
                  No matches found
                </h3>
                <p className="text-white/25 font-bold uppercase tracking-[0.15em] text-xs max-w-sm leading-relaxed mb-8">
                  We couldn't find any history entries matching "{search}".
                </p>
                <Link
                  href={`/dashboard?topic=${encodeURIComponent(search)}`}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 premium-gradient rounded-2xl text-white text-xs font-black tracking-widest uppercase shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all group"
                >
                  <Sparkles className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
                  Generate posts about "{search}"
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-widest uppercase mb-3">
                  {filter === 'favorites' ? 'No Favorites' : 'No History Yet'}
                </h3>
                <p className="text-white/25 font-bold uppercase tracking-[0.15em] text-xs max-w-xs leading-relaxed mb-8">
                  {filter === 'favorites'
                    ? 'Star entries to save them here.'
                    : "Your generated posts will appear here."}
                </p>
                {filter === 'all' && (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 premium-gradient rounded-2xl text-white text-xs font-black tracking-widest uppercase shadow-xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all group"
                  >
                    <Sparkles className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
                    Generate Your First Post
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Pagination ─────────────────────────────────────── */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 mt-10 px-4 sm:px-0"
        >
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/35 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed text-[10px] font-black tracking-widest uppercase transition-all active:scale-95"
          >
            ← <span className="hidden min-[400px]:inline">Prev</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let p = i + 1;
              if (totalPages > 5) {
                if (currentPage <= 3) p = i + 1;
                else if (currentPage >= totalPages - 2) p = totalPages - 4 + i;
                else p = currentPage - 2 + i;
              }
              return (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-[10px] font-black transition-all active:scale-90 ${currentPage === p ? 'premium-gradient text-white shadow-lg shadow-primary/20' : 'bg-white/[0.04] border border-white/[0.08] text-white/35 hover:text-white hover:bg-white/10'}`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/35 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed text-[10px] font-black tracking-widest uppercase transition-all active:scale-95"
          >
            <span className="hidden min-[400px]:inline">Next</span> →
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}