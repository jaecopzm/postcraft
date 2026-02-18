'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Clock, History, Search, SlidersHorizontal, Star, Sparkles, Filter } from 'lucide-react';
import PlatformPreview from '../../components/PlatformPreview';
import { motion, AnimatePresence } from 'framer-motion';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/history', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ id, favorite: !current }),
      });
      setHistory(prev => prev.map(item => item.id === id ? { ...item, favorite: !current } : item));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const filtered = history
    .filter(item => filter === 'favorites' ? item.favorite : true)
    .filter(item => !search || item.topic?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const favCount = history.filter(i => i.favorite).length;

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"
        />
      </div>
    );
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
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 premium-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <History className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-5xl font-extrabold text-gradient mb-2 tracking-tight">Archive</h1>
            <p className="text-white/40 font-medium">Your creative footprint, preserved forever.</p>
          </div>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-6">
        {/* Filter Tabs */}
        <div className="p-1.5 glass-card rounded-2xl flex items-center gap-1">
          {[
            { value: 'all', label: 'ALL ENTRIES', count: history.length },
            { value: 'favorites', label: 'FAVORITES', count: favCount },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as any)}
              className={`relative px-6 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${filter === tab.value ? 'text-white' : 'text-white/30 hover:text-white/60'
                }`}
            >
              {filter === tab.value && (
                <motion.div
                  layoutId="active-history-tab"
                  className="absolute inset-0 premium-gradient rounded-xl shadow-lg shadow-primary/20"
                />
              )}
              <span className="relative z-10 flex items-center gap-3">
                {tab.value === 'favorites' && <Heart className={`h-3.5 w-3.5 ${filter === 'favorites' ? 'fill-white' : ''}`} />}
                {tab.label}
                <span className={`px-2 py-0.5 rounded-md ${filter === tab.value ? 'bg-white/20 text-white' : 'bg-white/5 text-white/30'}`}>
                  {tab.count}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 min-w-[300px] group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/20 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by topic, keyword, or platform..."
            className="w-full pl-16 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary/50 text-white text-base font-medium placeholder-white/20 transition-all outline-none"
          />
        </div>
      </motion.div>

      {/* History Grid */}
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-8"
          >
            {filtered.map((entry) => {
              const date = new Date(entry.timestamp);
              return (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass-card rounded-[2rem] p-8 border-white/5 hover:border-white/10 transition-colors group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-10 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none" />

                  <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-3xl font-black text-white tracking-tight uppercase">{entry.topic}</h3>
                        {entry.favorite && <Star className="h-6 w-6 text-accent fill-accent shadow-sm" />}
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold tracking-widest text-white/30 uppercase">
                        <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="h-1 w-1 bg-white/20 rounded-full" />
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md">{entry.results?.length} BUNDLES</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleFavorite(entry.id, entry.favorite)}
                      className={`p-4 rounded-2xl border-2 transition-all ${entry.favorite
                          ? 'bg-accent/10 border-accent/20 text-accent'
                          : 'bg-white/5 border-white/10 text-white/20 hover:text-white hover:border-white/30'
                        }`}
                    >
                      <Heart className={`h-6 w-6 ${entry.favorite ? 'fill-accent' : ''}`} />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {entry.results?.map((res: any, idx: number) => (
                      <div key={idx} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.05] transition-colors">
                        <PlatformPreview
                          platform={res.platform}
                          content={res.content}
                          characterCount={res.characterCount}
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 glass-card rounded-[3rem] border-dashed border-white/10"
          >
            <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <History className="h-10 w-10 text-white/20" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-2">No echoes found</h3>
            <p className="text-white/30 font-medium">Try broadening your search or creating new magic.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}