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
      <motion.div variants={rise} className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 pt-2 px-4 sm:px-0">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
              <History className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-[9px] font-black tracking-[0.25em] uppercase text-accent mb-0.5">Temporal Archive</p>
            <h1 className="text-xl sm:text-3xl font-black text-foreground tracking-tighter leading-none uppercase">
              Synthetic <span className="text-gradient">History</span>
            </h1>
          </div>
        </div>

        {/* right pill: total count */}
        <div className="sm:ml-auto shrink-0 flex">
          <div className="px-3 py-1.5 glass-card rounded-xl w-fit">
            <span className="text-[10px] font-black tracking-widest text-accent/40 uppercase">{history.length} entries</span>
          </div>
        </div>
      </motion.div>

      {/* ── Sticky Toolbar ─────────────────────────────────── */}
      <motion.div
        variants={rise}
        className="sticky top-0 z-30 bg-background/80 backdrop-blur-2xl border-b border-border px-4 sm:px-5 py-3 mb-5 sm:mb-6 sm:rounded-xl sm:border sm:border-border sm:bg-white/80 sm:backdrop-blur-none sm:static sm:py-4"
      >
        {/* search row */}
        <div className="flex items-center gap-2 w-full max-w-full">
          <div className={`relative flex-1 min-w-0 transition-all duration-500 ease-[0.22,1,0.36,1] ${searchFocused ? 'flex-[2]' : ''}`}>
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
              <Search className={`h-4 w-4 transition-colors duration-300 ${searchFocused ? 'text-accent' : 'text-accent/20'}`} />
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search topics…"
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-border rounded-xl focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/10 text-foreground text-[13px] font-medium placeholder-accent/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-accent/40 hover:text-accent transition-colors bg-accent/5 rounded-lg border border-border"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setFiltersOpen(p => !p)}
            className={`relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shrink-0 ${filtersOpen || activeFilters > 0 ? 'bg-accent/10 border border-accent/20 text-accent' : 'bg-white border border-border text-accent/20 hover:text-accent'}`}
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
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shrink-0 ${filter === 'favorites' ? 'bg-accent/10 border border-accent/20 text-accent' : 'bg-white border border-border text-accent/20 hover:text-accent'}`}
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
              <div className="pt-3 flex flex-col gap-3">
                {/* Platform Filters */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {PLATFORMS.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      onClick={() => setPlatformFilter(value)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shrink-0 ${platformFilter === value ? 'bg-accent/10 border border-accent/20 text-accent' : 'bg-white border border-border text-accent/20 hover:text-accent'}`}
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
                      className={`flex items-center px-3 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all shrink-0 ${timeFilter === value ? 'bg-accent/10 border border-accent/20 text-accent' : 'bg-white border border-border text-accent/20 hover:text-accent'}`}
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
      <motion.div variants={rise} className="px-4 sm:px-0 mb-3">
        <p className="text-[9px] font-black tracking-[0.2em] text-accent/20 uppercase">
          {filtered.length === 0 ? 'No results' : `${paginated.length} of ${filtered.length} entries`}
        </p>
      </motion.div>

      {/* ── Cards ────────────────────────────────────────────── */}
      <AnimatePresence mode="popLayout">
        {paginated.length > 0 ? (
          <div className="space-y-3 px-4 sm:px-0">
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
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/10 via-transparent to-accent/5 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative glass-card rounded-xl group-hover:border-accent/20 transition-colors duration-300 overflow-hidden">

                    {/* ── Card Header ── */}
                    <div className="p-3.5 sm:p-5">
                      <div className="flex items-start gap-3">
                        {/* icon */}
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-accent/5 border border-border flex items-center justify-center shrink-0 mt-0.5">
                          <History className="h-4 w-4 sm:h-5 sm:w-5 text-accent/20 group-hover:text-accent transition-colors duration-500" />
                        </div>

                        {/* topic + meta */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-lg font-black text-foreground tracking-tight leading-tight uppercase truncate mb-1">
                            {entry.topic}
                          </h3>
                          <div className="flex items-center flex-wrap gap-2">
                            <span className="flex items-center gap-1 text-[9px] font-black tracking-widest text-accent/40 uppercase">
                              <Clock className="h-2.5 w-2.5" />
                              {relativeTime(date)}
                            </span>
                            <span className="text-accent/10">·</span>
                            <span className="text-[9px] font-black tracking-widest text-accent/40 uppercase">
                              {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                            {/* platform pills */}
                            <div className="flex items-center gap-1 ml-auto sm:ml-0">
                              {entry.results?.slice(0, 5).map((r: any, idx: number) => (
                                <span key={`${r.platform}-${idx}`} className="p-1 bg-white rounded-md border border-border text-accent/40">
                                  {getPlatformIcon(r.platform)}
                                </span>
                              ))}
                              {entry.results?.length > 5 && (
                                <span className="text-[9px] font-black text-accent/20">+{entry.results.length - 5}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* favorite star — always visible */}
                        <button
                          onClick={() => toggleFavorite(entry.id, entry.favorite)}
                          className={`p-2 rounded-lg border transition-all shrink-0 active:scale-90 ${entry.favorite ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-white border-border text-accent/10 hover:text-accent'}`}
                        >
                          <Heart className={`h-4 w-4 ${entry.favorite ? 'fill-accent' : ''}`} />
                        </button>
                      </div>

                      {/* ── Action row ── */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3">
                        {/* utility buttons group */}
                        <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
                          <button
                            onClick={() => regenerate(entry.topic)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black tracking-widest text-primary hover:bg-primary/15 active:scale-95 transition-all uppercase min-w-0"
                          >
                            <RefreshCcw className="h-3.5 w-3.5 shrink-0" />
                            <span className="hidden sm:inline truncate">Redo</span>
                          </button>

                          <button
                            onClick={() => copyAll(entry.results)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-border rounded-lg text-[10px] font-black tracking-widest text-accent/40 hover:text-foreground hover:bg-accent/5 active:scale-95 transition-all uppercase min-w-0"
                          >
                            <Copy className="h-3.5 w-3.5 shrink-0" />
                            <span className="hidden sm:inline truncate">Copy</span>
                          </button>

                          {/* delete */}
                          <button
                            onClick={() => setDeletingId(entry.id)}
                            className="p-2 bg-white border border-border rounded-lg text-accent/10 hover:text-red-500 hover:border-red-200 active:scale-95 transition-all shrink-0"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* expand / collapse */}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                          className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white border border-border rounded-lg text-[10px] font-black tracking-widest text-accent/40 hover:text-foreground hover:bg-accent/5 active:scale-95 transition-all uppercase truncate"
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
                          <div className="border-t border-border px-3.5 sm:px-5 py-3.5 sm:py-5">
                            {/* simplified grid for better visibility */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:overflow-visible">
                              {entry.results?.map((res: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="w-full bg-white border border-border rounded-xl p-3 hover:border-accent/20 transition-colors duration-300"
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
                          className="absolute inset-0 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center px-6 text-center z-50 rounded-xl"
                        >
                          <div className="h-12 w-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 border border-red-200">
                            <Trash2 className="h-6 w-6 text-red-500" />
                          </div>
                          <h4 className="text-base font-black text-foreground tracking-widest uppercase mb-2">Delete?</h4>
                          <p className="text-xs text-accent/40 mb-5 max-w-[220px] leading-relaxed">This entry and all its posts will be permanently removed.</p>
                          <div className="flex items-center gap-3">
                            <button onClick={() => deleteEntry(entry.id)} className="px-5 py-2.5 bg-red-500 text-white text-[10px] font-black tracking-[0.2em] uppercase rounded-lg hover:bg-red-400 active:scale-95 transition-all">
                              Delete
                            </button>
                            <button onClick={() => setDeletingId(null)} className="px-5 py-2.5 bg-white border border-border text-accent/40 text-[10px] font-black tracking-[0.2em] uppercase rounded-lg hover:text-foreground hover:bg-accent/5 active:scale-95 transition-all">
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
            className="flex flex-col items-center justify-center py-16 sm:py-24 px-8 text-center mx-4 sm:mx-0 glass-card rounded-2xl border-dashed"
          >
            <div className="relative h-16 w-16 mb-6">
              <div className="h-full w-full bg-white rounded-2xl flex items-center justify-center border border-border">
                <History className="h-8 w-8 text-accent/10" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-3 border border-dashed border-border rounded-full"
              />
            </div>

            {search && filtered.length === 0 ? (
              <>
                <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-widest uppercase mb-2 text-balance">
                  No matches found
                </h3>
                <p className="text-accent/40 font-bold uppercase tracking-[0.15em] text-xs max-w-sm leading-relaxed mb-6">
                  We couldn&apos;t find any history entries matching &quot;{search}&quot;.
                </p>
                <Link
                  href={`/dashboard?topic=${encodeURIComponent(search)}`}
                  className="inline-flex items-center gap-2.5 px-5 py-3 premium-gradient rounded-xl text-white text-xs font-black tracking-widest uppercase shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all group"
                >
                  <Sparkles className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
                  Generate posts about &quot;{search}&quot;
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-widest uppercase mb-2">
                  {filter === 'favorites' ? 'No Favorites' : 'No History Yet'}
                </h3>
                <p className="text-accent/40 font-bold uppercase tracking-[0.15em] text-xs max-w-xs leading-relaxed mb-6">
                  {filter === 'favorites'
                    ? 'Star entries to save them here.'
                    : "Your generated posts will appear here."}
                </p>
                {filter === 'all' && (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2.5 px-5 py-3 premium-gradient rounded-xl text-white text-xs font-black tracking-widest uppercase shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all group"
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
          className="flex items-center justify-center gap-2 mt-8 px-4 sm:px-0"
        >
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-white border border-border rounded-lg text-accent/20 hover:text-foreground hover:bg-accent/5 disabled:opacity-20 disabled:cursor-not-allowed text-[10px] font-black tracking-widest uppercase transition-all active:scale-95"
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
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-[10px] font-black transition-all active:scale-90 ${currentPage === p ? 'premium-gradient text-white shadow-md shadow-primary/20' : 'bg-white border border-border text-accent/20 hover:text-foreground'}`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-white border border-border rounded-lg text-accent/20 hover:text-foreground hover:bg-accent/5 disabled:opacity-20 disabled:cursor-not-allowed text-[10px] font-black tracking-widest uppercase transition-all active:scale-95"
          >
            <span className="hidden min-[400px]:inline">Next</span> →
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}