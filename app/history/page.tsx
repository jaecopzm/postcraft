'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Clock, History, Search, Sparkles, ArrowRight, Trash2, RefreshCcw } from 'lucide-react';
import PlatformPreview from '../../components/PlatformPreview';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useToast } from '../../components/Toast';
import { Twitter, Linkedin, Instagram, Facebook, Music, Youtube, Copy } from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [history, setHistory] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/history', {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      const data = await response.json();
      setHistory(data.history || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      await fetch('/api/history', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
        body: JSON.stringify({ id, favorite: !current }),
      });
      setHistory(prev => prev.map(item => item.id === id ? { ...item, favorite: !current } : item));
      toast(current ? 'Removed from favorites' : 'Added to favorites ♥');
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast('Failed to update favorite', 'error');
    }
  };

  const deleteEntry = async (id: string) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      await fetch('/api/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
        body: JSON.stringify({ id }),
      });
      setHistory(prev => prev.filter(item => item.id !== id));
      setDeletingId(null);
      toast('Entry deleted from history');
    } catch (error) {
      console.error('Failed to delete entry:', error);
      toast('Failed to delete entry', 'error');
    }
  };

  const copyAllResults = (results: any[]) => {
    const allContent = results.map(r => `--- ${r.platform.toUpperCase()} ---\n${r.content}`).join('\n\n');
    navigator.clipboard.writeText(allContent);
    toast('All posts copied to clipboard!');
  };

  const regenerateTopic = (topic: string) => {
    router.push(`/dashboard?topic=${encodeURIComponent(topic)}`);
  };

  const filtered = history
    .filter(item => filter === 'favorites' ? item.favorite : true)
    .filter(item => !search || item.topic?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const groupHistory = (items: any[]) => {
    const groups: { [key: string]: any[] } = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 86400000;

    items.forEach(item => {
      const date = new Date(item.timestamp);
      const time = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

      let key = 'DISTANT ARCHIVE';
      if (time === today) key = 'TODAY';
      else if (time === yesterday) key = 'YESTERDAY';
      else if (now.getTime() - time < 7 * 86400000) key = 'THIS WEEK';

      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  };

  const grouped = groupHistory(filtered);
  const favCount = history.filter(i => i.favorite).length;

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="h-3 w-3" />;
      case 'linkedin': return <Linkedin className="h-3 w-3" />;
      case 'instagram': return <Instagram className="h-3 w-3" />;
      case 'facebook': return <Facebook className="h-3 w-3" />;
      case 'tiktok': return <Music className="h-3 w-3" />;
      case 'youtube': return <Youtube className="h-3 w-3" />;
      default: return null;
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-4 border-primary/10 border-t-primary"
        />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-6 sm:space-y-12"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 sm:gap-8">
        <div className="h-12 w-12 sm:h-20 sm:w-20 premium-gradient rounded-2xl sm:rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/20 shrink-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <History className="h-6 w-6 sm:h-10 sm:w-10 text-white relative z-10" />
        </div>
        <div>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-2 sm:mb-3"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-primary">Temporal Database</span>
          </motion.div>
          <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tighter uppercase">Synthetic <span className="text-gradient">Archive</span></h1>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-stretch md:items-center gap-4 sm:gap-6 bg-white/[0.02] border border-white/5 p-2 rounded-2xl sm:rounded-[2.5rem]">
        {/* Filter Tabs */}
        <div className="p-1 glass-card rounded-xl sm:rounded-2xl flex items-center gap-1 flex-1">
          {[
            { value: 'all', label: 'ALL ECHOES', mobileLabel: 'ALL', count: history.length },
            { value: 'favorites', label: 'NEURAL FAVS', mobileLabel: 'FAV', count: favCount },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              className={`relative flex-1 px-4 sm:px-8 py-3 rounded-lg sm:rounded-xl text-[10px] font-black tracking-widest transition-all ${filter === tab.value ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
            >
              {filter === tab.value && (
                <motion.div
                  layoutId="active-history-tab"
                  className="absolute inset-0 premium-gradient rounded-lg sm:rounded-xl shadow-lg shadow-primary/20"
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-4">
                {tab.value === 'favorites' && <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${filter === 'favorites' ? 'fill-white' : ''}`} />}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.mobileLabel}</span>
                <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] ${filter === tab.value ? 'bg-white/20 text-white' : 'bg-white/5 text-white/10'}`}>
                  {tab.count}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative group flex-[1.5]">
          <Search className="absolute left-6 sm:left-8 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history..."
            className="w-full pl-14 sm:pl-16 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-xl sm:rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 text-white text-xs font-black tracking-widest placeholder-white/10 transition-all"
          />
        </div>
      </motion.div>

      {/* History Sections */}
      <AnimatePresence mode="popLayout">
        {Object.keys(grouped).length > 0 ? (
          <div className="space-y-12 sm:space-y-20">
            {Object.entries(grouped).map(([groupName, items]) => (
              <div key={groupName} className="space-y-6 sm:space-y-8">
                <div className="flex items-center gap-4 px-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <h2 className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase whitespace-nowrap">{groupName}</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:gap-10">
                  {items.map((entry) => {
                    const date = new Date(entry.timestamp);
                    return (
                      <motion.div
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group relative"
                      >
                        {/* Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="glass-card rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-10 border-white/5 group-hover:border-white/20 transition-all relative overflow-hidden bg-[#0A0A0B]/80 backdrop-blur-3xl">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                          {/* Entry Header */}
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8 sm:mb-12">
                            <div className="space-y-3 sm:space-y-5 min-w-0 flex-1">
                              <div className="flex items-center gap-4 sm:gap-6">
                                <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                                  <History className="h-5 w-5 sm:h-7 sm:w-7 text-white/20 group-hover:text-primary transition-colors duration-500" />
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-xl sm:text-4xl font-black text-white tracking-tighter uppercase truncate leading-none mb-2">{entry.topic}</h3>
                                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[10px] font-black tracking-widest text-white/20 uppercase">
                                    <span className="flex items-center gap-2">
                                      <Clock className="h-3 w-3" />
                                      {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <div className="h-5 w-px bg-white/5 hidden sm:block" />
                                    <div className="flex items-center gap-1.5">
                                      {entry.results?.map((r: any) => (
                                        <div key={r.platform} className="p-1 sm:p-1.5 bg-white/5 rounded-md border border-white/5 text-white/40 ring-1 ring-white/0 hover:ring-white/20 transition-all">
                                          {getPlatformIcon(r.platform)}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                              {/* Regenerate */}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => regenerateTopic(entry.topic)}
                                title="Re-generate posts for this topic"
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 border border-primary/20 rounded-2xl text-[10px] font-black tracking-widest text-primary hover:bg-primary/20 transition-all uppercase"
                              >
                                <RefreshCcw className="h-4 w-4" />
                                <span className="hidden sm:inline">REGENERATE</span>
                              </motion.button>

                              {/* Copy All */}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => copyAllResults(entry.results)}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black tracking-widest text-white/40 hover:text-white hover:bg-white/10 transition-all uppercase"
                              >
                                <Copy className="h-4 w-4" />
                                <span className="hidden sm:inline">COPY ALL</span>
                              </motion.button>

                              {/* Favorite */}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleFavorite(entry.id, entry.favorite)}
                                className={`p-3 rounded-2xl border transition-all shrink-0 ${entry.favorite
                                  ? 'bg-accent/10 border-accent/30 text-accent shadow-[0_0_20px_rgba(255,171,0,0.1)]'
                                  : 'bg-white/5 border-white/10 text-white/20 hover:text-white hover:border-white/30'
                                  }`}
                              >
                                <Heart className={`h-5 w-5 sm:h-6 sm:w-6 ${entry.favorite ? 'fill-accent' : ''}`} />
                              </motion.button>

                              {/* Delete */}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setDeletingId(entry.id)}
                                title="Delete entry"
                                className="p-3 rounded-2xl border bg-white/5 border-white/10 text-white/20 hover:text-red-400 hover:border-red-500/20 transition-all shrink-0"
                              >
                                <Trash2 className="h-5 w-5" />
                              </motion.button>
                            </div>
                          </div>

                          {/* Platform previews */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                            {entry.results?.map((res: any, idx: number) => (
                              <div key={idx} className="relative group/platform">
                                <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[1.5rem] sm:rounded-[2.5rem] opacity-0 group-hover/platform:opacity-100 transition-opacity duration-500" />
                                <div className="relative bg-[#0F0F12] border border-white/5 rounded-xl sm:rounded-[2rem] p-4 sm:p-8 hover:bg-[#15151A] transition-colors duration-500">
                                  <PlatformPreview
                                    platform={res.platform}
                                    content={res.content}
                                    characterCount={res.characterCount}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Delete Confirmation Overlay */}
                          <AnimatePresence>
                            {deletingId === entry.id && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-[#050505]/90 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center z-50 rounded-2xl sm:rounded-[2.5rem]"
                              >
                                <div className="h-16 w-16 bg-red-500/10 rounded-[1.5rem] flex items-center justify-center mb-6 border border-red-500/20">
                                  <Trash2 className="h-8 w-8 text-red-400" />
                                </div>
                                <h4 className="text-xl font-black text-white tracking-widest uppercase mb-3">Delete this entry?</h4>
                                <p className="text-sm text-white/40 mb-8 max-w-xs">This is permanent. The generated posts won't be recoverable.</p>
                                <div className="flex items-center gap-4">
                                  <button onClick={() => deleteEntry(entry.id)} className="px-8 py-4 bg-red-500 text-white text-[10px] font-black tracking-[0.2em] uppercase rounded-2xl hover:bg-red-400 transition-colors">Delete</button>
                                  <button onClick={() => setDeletingId(null)} className="px-8 py-4 bg-white/5 text-white/50 text-[10px] font-black tracking-[0.2em] uppercase rounded-2xl hover:bg-white/10 transition-colors">Cancel</button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ── Empty State with CTA ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 sm:py-40 glass-card rounded-[2.5rem] sm:rounded-[4rem] border-dashed border-white/10 max-w-2xl mx-auto text-center px-8"
          >
            <div className="h-20 w-20 sm:h-32 sm:w-32 bg-white/5 rounded-[2rem] sm:rounded-[3rem] flex items-center justify-center mb-10 relative">
              <History className="h-10 w-10 sm:h-16 sm:w-16 text-white/10" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-10px] border border-dashed border-white/5 rounded-full"
              />
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-widest uppercase mb-4">
              {filter === 'favorites' ? 'No Favorites Yet' : 'No History Yet'}
            </h3>
            <p className="text-white/30 font-bold uppercase tracking-[0.2em] text-xs sm:text-sm max-w-xs leading-relaxed mb-10">
              {filter === 'favorites'
                ? 'Star a post to save it here for quick access.'
                : 'Generate your first posts and they\'ll appear here.'}
            </p>
            {filter === 'all' && (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-4 premium-gradient rounded-2xl text-white text-xs font-black tracking-widest uppercase shadow-xl shadow-primary/20 hover:scale-105 transition-all group"
              >
                <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                Generate Your First Post
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}