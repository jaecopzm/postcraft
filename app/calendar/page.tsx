'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, CalendarDays, X, Sparkles, Target, Zap, Activity, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CalendarSkeleton } from '../../components/Skeleton';

interface ScheduledContent {
  id: string;
  date: string;
  platform: string;
  content: string;
  time: string;
}

const PLATFORM_META: Record<string, { color: string; dot: string }> = {
  twitter: { color: '#ffffff', dot: '#ffffff' },
  linkedin: { color: '#0A66C2', dot: '#0A66C2' },
  instagram: { color: '#E1306C', dot: '#E1306C' },
  facebook: { color: '#1877F2', dot: '#1877F2' },
  tiktok: { color: '#00F2EA', dot: '#00F2EA' },
  youtube: { color: '#FF0000', dot: '#FF0000' },
};

const BEST_TIMES = [
  { platform: 'Twitter / X', time: '12–3 PM, 5–6 PM', color: '#ffffff', icon: Zap },
  { platform: 'LinkedIn', time: '7–8 AM, 12 PM, 5–6 PM', color: '#0A66C2', icon: Target },
  { platform: 'Instagram', time: '11 AM–1 PM, 7–9 PM', color: '#E1306C', icon: Activity },
];

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduled, setScheduled] = useState<ScheduledContent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPost, setNewPost] = useState({ platform: 'twitter', content: '', time: '12:00' });

  useEffect(() => {
    if (user) fetchScheduled();
  }, [user]);

  const fetchScheduled = async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/calendar', {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      const data = await response.json();
      setScheduled(data.scheduled || []);
    } catch (error) {
      console.error('Failed to fetch scheduled posts:', error);
    }
  };

  const addScheduledPost = async () => {
    if (!user || !selectedDate || !newPost.content.trim()) return;
    try {
      const idToken = await user.getIdToken();
      const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

      await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          date: dateStr,
          time: newPost.time,
          platform: newPost.platform,
          content: newPost.content
        })
      });

      await fetchScheduled();
      setShowAddModal(false);
      setNewPost({ platform: 'twitter', content: '', time: '12:00' });
    } catch (error) {
      console.error('Failed to schedule post:', error);
    }
  };

  const deletePost = async (id: string) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      await fetch(`/api/calendar?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      await fetchScheduled();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  if (loading) {
    return <CalendarSkeleton />;
  }

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  const dateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const scheduledFor = (day: number) => scheduled.filter(s => s.date === dateStr(day));

  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  const isSelected = (day: number) =>
    selectedDate?.getDate() === day &&
    selectedDate?.getMonth() === month &&
    selectedDate?.getFullYear() === year;

  return (
    <div className="container mx-auto max-w-7xl animate-in fade-in duration-700">
      {/* Cinematic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4"
          >
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">Content Timeline</span>
          </motion.div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-white">CHRONOS <span className="text-gradient">CALENDAR</span></h1>
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center gap-1 p-1.5 glass-card border-white/5 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button onClick={prevMonth} className="p-2 sm:p-2.5 hover:bg-white/5 rounded-xl transition-colors text-white/50 hover:text-white">
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <div className="px-2 sm:px-4 text-center min-w-[110px] sm:min-w-[140px]">
              <div className="text-xs sm:text-sm font-black text-white uppercase tracking-widest">{MONTH_NAMES[month]}</div>
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{year}</div>
            </div>
            <button onClick={nextMonth} className="p-2 sm:p-2.5 hover:bg-white/5 rounded-xl transition-colors text-white/50 hover:text-white">
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </motion.div>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 sm:px-6 py-3 sm:py-3.5 glass-card border-white/10 text-[10px] font-black tracking-[0.2em] uppercase text-white hover:border-white/30 transition-all rounded-2xl"
          >
            Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-8">
        {/* Calendar Grid Section */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl sm:rounded-[2.5rem] border-white/5 p-4 sm:p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 premium-gradient opacity-30" />

            <div className="grid grid-cols-7 mb-6">
              {DAY_NAMES.map(d => (
                <div key={d} className="text-center text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-3">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`e-${i}`} className="aspect-square rounded-3xl bg-white/[0.02] border border-transparent opacity-30" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const items = scheduledFor(day);
                const today_ = isToday(day);
                const sel = isSelected(day);

                return (
                  <motion.button
                    key={day}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={`
                      group relative aspect-square rounded-xl sm:rounded-3xl p-1 sm:p-4 flex flex-col items-center justify-center transition-all border
                      ${today_
                        ? 'premium-gradient text-white border-transparent shadow-xl shadow-primary/20'
                        : sel
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-white/[0.03] border-white/5 text-white/30 hover:bg-white/[0.06] hover:border-white/10 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-sm sm:text-xl font-black tracking-tighter leading-none mb-1 sm:mb-2">{day}</span>

                    {items.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-center max-w-full">
                        {items.slice(0, 3).map(item => (
                          <div
                            key={item.id}
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: PLATFORM_META[item.platform]?.dot ?? '#0EA5E9' }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Intelligence Banner: Best Times */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {BEST_TIMES.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="glass-card rounded-[2rem] p-6 border-white/5 group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: stat.color }} />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/5 group-hover:border-white/10 transition-all">
                    <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{stat.platform}</div>
                    <div className="text-sm font-bold text-white tracking-tight">{stat.time}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected Day Controller */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate?.toISOString() || 'empty'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {selectedDate ? (
              <div className="glass-card rounded-2xl sm:rounded-[2.5rem] border-white/5 p-5 sm:p-8 relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">{selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}</div>
                    <h3 className="text-2xl font-black text-white tracking-tighter">
                      {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </h3>
                  </div>
                  <button onClick={() => setSelectedDate(null)} className="p-3 hover:bg-white/5 rounded-2xl text-white/20 hover:text-white transition-all">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddModal(true)}
                  className="w-full py-5 premium-gradient rounded-3xl text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 mb-8"
                >
                  <Plus className="h-4 w-4" />
                  INITIALIZE PLAN
                </motion.button>

                <div className="space-y-4">
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">SEQUENCE ACTIVE</div>
                  {scheduledFor(selectedDate.getDate()).length === 0 ? (
                    <div className="py-16 sm:py-20 text-center flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-4">
                        <CalendarDays className="h-6 w-6 text-white/20" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">Schedule Clear</p>
                      <p className="text-xs text-white/20 mb-6">No operations scheduled for this sector.</p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-black text-white/60 tracking-widest uppercase transition-all flex items-center gap-2"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Schedule First Post
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {scheduledFor(selectedDate.getDate()).map(item => (
                        <div key={item.id} className="p-5 glass-card border-white/10 rounded-3xl relative overflow-hidden group">
                          <div className="absolute top-0 left-0 bottom-0 w-1 premium-gradient" />
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black uppercase tracking-widest text-primary">{item.platform}</span>
                              <span className="text-[10px] font-bold text-white/20">{item.time}</span>
                            </div>
                            <button
                              onClick={() => deletePost(item.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-white/20 hover:text-red-500 transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-sm font-medium text-white/60 line-clamp-2">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl sm:rounded-[2.5rem] border-white/5 border-dashed p-8 sm:p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-white/[0.03] flex items-center justify-center mb-6">
                  <Activity className="h-8 w-8 text-white/20" />
                </div>
                <h4 className="text-sm font-black text-white/30 uppercase tracking-[0.3em]">SELECT NODE</h4>
                <p className="text-xs font-medium text-white/10 mt-2">Activate a date cluster to manage operations.</p>
              </div>
            )}

            {/* Metadata / Legend */}
            <div className="glass-card rounded-2xl sm:rounded-[2rem] border-white/5 p-4 sm:p-6">
              <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6">SIGNAL SOURCES</div>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(PLATFORM_META).map(([name, { color }]) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full" style={{ background: color }} />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Post Modal */}
      <AnimatePresence>
        {showAddModal && selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-3xl p-8 max-w-lg w-full border-white/10"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white">Schedule Post</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-white/40 uppercase tracking-widest mb-2 block">Platform</label>
                  <select
                    value={newPost.platform}
                    onChange={(e) => setNewPost({ ...newPost, platform: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium outline-none focus:border-primary/50 transition-all"
                  >
                    <option value="twitter">Twitter / X</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-white/40 uppercase tracking-widest mb-2 block">Time</label>
                  <input
                    type="time"
                    value={newPost.time}
                    onChange={(e) => setNewPost({ ...newPost, time: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-white/40 uppercase tracking-widest mb-2 block">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={4}
                    placeholder="What's on your mind?"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium outline-none focus:border-primary/50 transition-all resize-none placeholder-white/20"
                  />
                </div>

                <button
                  onClick={addScheduledPost}
                  disabled={!newPost.content.trim()}
                  className="w-full py-4 premium-gradient rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Schedule Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}