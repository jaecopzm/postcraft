'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, CalendarDays, X, Sparkles, Target, Zap, Activity, Trash2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CalendarSkeleton } from '../../components/Skeleton';
import Link from 'next/link';
import { XIcon, LinkedInIcon, InstagramIcon, FacebookIcon, TikTokIcon, YouTubeIcon } from '../../components/SocialIcons';
import { useToast } from '../../components/Toast';

interface ScheduledContent {
  id: string;
  date: string;
  platform: string;
  content: string;
  time: string;
}

const PLATFORM_META: Record<string, { color: string; dot: string; icon: any }> = {
  twitter: { color: '#1DA1F2', dot: '#1DA1F2', icon: XIcon },
  linkedin: { color: '#0A66C2', dot: '#0A66C2', icon: LinkedInIcon },
  instagram: { color: '#E1306C', dot: '#E1306C', icon: InstagramIcon },
  facebook: { color: '#1877F2', dot: '#1877F2', icon: FacebookIcon },
  tiktok: { color: '#000000', dot: '#000000', icon: TikTokIcon },
  youtube: { color: '#FF0000', dot: '#FF0000', icon: YouTubeIcon },
};

const BEST_TIMES = [
  { platform: 'Twitter / X', time: '12–3 PM, 5–6 PM', color: '#1DA1F2', icon: XIcon },
  { platform: 'LinkedIn', time: '7–8 AM, 12 PM, 5–6 PM', color: '#0A66C2', icon: LinkedInIcon },
  { platform: 'Instagram', time: '11 AM–1 PM, 7–9 PM', color: '#E1306C', icon: InstagramIcon },
];

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduled, setScheduled] = useState<ScheduledContent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [stagedContent, setStagedContent] = useState<any[]>([]);
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
      
      // Fetch staged content
      const stagedResponse = await fetch('/api/staging', {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      const stagedData = await stagedResponse.json();
      setStagedContent(stagedData.staged || []);
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
      toast('Post scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule post:', error);
      toast('Failed to schedule post', 'error');
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
      toast('Post deleted');
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast('Failed to delete post', 'error');
    }
  };

  const scheduleStagedContent = (stagedItem: any) => {
    setNewPost({
      platform: stagedItem.platform,
      content: stagedItem.content,
      time: '12:00'
    });
    setSelectedDate(new Date());
    setShowAddModal(true);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAddModal) {
        setShowAddModal(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowAddModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal]);

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
      {/* Back to Dashboard Link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-accent/60 hover:text-accent font-medium mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-3"
          >
            <CalendarDays className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-primary">Content Calendar</span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">Content <span className="text-gradient">Calendar</span></h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Stats */}
          <div className="flex gap-2">
            <div className="px-2.5 py-1.5 bg-accent/5 border border-border rounded-lg">
              <div className="text-[9px] text-accent/40 font-medium">Scheduled</div>
              <div className="text-sm font-bold text-foreground">{scheduled.length}</div>
            </div>
            {stagedContent.length > 0 && (
              <div className="px-2.5 py-1.5 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="text-[9px] text-primary font-medium">Staged</div>
                <div className="text-sm font-bold text-primary">{stagedContent.length}</div>
              </div>
            )}
          </div>

          <motion.div
            className="flex items-center gap-1 p-1.5 glass-card border-gray-200 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button onClick={prevMonth} className="p-2 sm:p-2.5 hover:bg-accent/5 rounded-xl transition-colors text-accent/40 hover:text-accent">
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <div className="px-2 sm:px-4 text-center min-w-[110px] sm:min-w-[140px]">
              <div className="text-xs sm:text-sm font-black text-foreground uppercase tracking-widest">{MONTH_NAMES[month]}</div>
              <div className="text-[10px] font-bold text-accent/30 uppercase tracking-[0.2em]">{year}</div>
            </div>
            <button onClick={nextMonth} className="p-2 sm:p-2.5 hover:bg-accent/5 rounded-xl transition-colors text-accent/40 hover:text-accent">
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </motion.div>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 sm:px-6 py-3 sm:py-3.5 glass-card border-border text-[10px] font-black tracking-[0.2em] uppercase text-foreground hover:border-accent/40 transition-all rounded-2xl"
          >
            Today
          </button>
        </div>
      </div>

      {/* Staged Content Section */}
      {stagedContent.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl border-border p-4 sm:p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Staged Content</h3>
                <p className="text-[10px] text-accent/40">Ready to schedule</p>
              </div>
            </div>
            <span className="text-xs font-bold text-primary">{stagedContent.length} items</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stagedContent.map((item, idx) => {
              const PlatformIcon = PLATFORM_META[item.platform]?.icon;
              return (
                <div key={idx} className="p-3 bg-accent/5 border border-border rounded-lg hover:border-primary/20 transition-all group cursor-pointer" onClick={() => scheduleStagedContent(item)}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {PlatformIcon && <PlatformIcon size={14} style={{ color: PLATFORM_META[item.platform]?.color }} />}
                      <span className="text-[10px] font-bold uppercase" style={{ color: PLATFORM_META[item.platform]?.color }}>{item.platform}</span>
                    </div>
                    <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-accent transition-all">
                      Schedule →
                    </span>
                  </div>
                  <p className="text-xs text-accent/60 line-clamp-2">{item.content}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-8">
        {/* Calendar Grid Section */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl border-border p-4 sm:p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 premium-gradient opacity-20" />

            <div className="grid grid-cols-7 mb-4">
              {DAY_NAMES.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`e-${i}`} className="aspect-square rounded-lg bg-accent/5 border border-transparent opacity-30" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const items = scheduledFor(day);
                const today_ = isToday(day);
                const sel = isSelected(day);

                return (
                  <motion.button
                    key={day}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={`
                        group relative aspect-square rounded-lg p-1 sm:p-3 flex flex-col items-center justify-center transition-all border
                        ${today_
                        ? 'premium-gradient text-white border-transparent shadow-lg shadow-primary/20'
                        : sel
                          ? 'bg-accent/10 border-accent/30 text-accent shadow-md shadow-accent/10'
                          : 'bg-accent/5 border-border text-accent/30 hover:bg-white hover:border-accent/20 hover:text-foreground'
                      }
                      `}
                  >
                    <span className="text-xs sm:text-lg font-bold tracking-tight leading-none mb-1">{day}</span>

                    {items.length > 0 && (
                      <div className="flex flex-wrap gap-0.5 sm:gap-1 justify-center max-w-full">
                        {items.slice(0, 3).map(item => (
                          <div
                            key={item.id}
                            className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full"
                            style={{ background: PLATFORM_META[item.platform]?.dot ?? '#0EA5E9' }}
                          />
                        ))}
                        {items.length > 3 && (
                          <span className="text-[8px] font-bold text-current">+{items.length - 3}</span>
                        )}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Best Posting Times */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {BEST_TIMES.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -2 }}
                  className="glass-card rounded-xl p-4 border-border group overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: stat.color }} />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-accent/5 border border-border group-hover:border-accent/20 transition-all">
                      <Icon size={16} style={{ color: stat.color }} />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-accent/40 uppercase tracking-wider mb-0.5">{stat.platform}</div>
                      <div className="text-xs font-bold text-foreground">{stat.time}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
              <div className="glass-card rounded-xl border-border p-4 sm:p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-[10px] font-bold text-accent/40 uppercase tracking-wider mb-1">{selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}</div>
                    <h3 className="text-xl font-bold text-foreground">
                      {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </h3>
                  </div>
                  <button onClick={() => setSelectedDate(null)} className="p-2 hover:bg-accent/5 rounded-lg text-accent/20 hover:text-accent transition-all">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddModal(true)}
                  className="w-full py-3 premium-gradient rounded-xl text-white text-xs font-bold uppercase tracking-wide shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mb-6 relative group"
                >
                  <Plus className="h-4 w-4" />
                  Schedule Post
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Ctrl+K
                  </span>
                </motion.button>

                <div className="space-y-4">
                  <div className="text-[10px] font-bold text-accent/40 uppercase tracking-wider mb-3">Scheduled Posts</div>
                  {scheduledFor(selectedDate.getDate()).length === 0 ? (
                    <div className="py-12 text-center flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-accent/5 flex items-center justify-center mb-3">
                        <CalendarDays className="h-5 w-5 text-accent/20" />
                      </div>
                      <p className="text-xs font-bold text-accent/30 mb-1">No posts scheduled</p>
                      <p className="text-[11px] text-accent/40 mb-4">Add your first post for this day.</p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 py-2 bg-accent/5 hover:bg-accent/10 border border-border rounded-lg text-xs font-bold text-accent/40 tracking-wide uppercase transition-all flex items-center gap-2"
                      >
                        <Plus className="h-3 w-3" />
                        Add Post
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {scheduledFor(selectedDate.getDate()).map(item => {
                        const PlatformIcon = PLATFORM_META[item.platform]?.icon;
                        return (
                          <div key={item.id} className="p-4 glass-card border-border rounded-xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 bottom-0 w-1 premium-gradient" />
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {PlatformIcon && <PlatformIcon size={14} style={{ color: PLATFORM_META[item.platform]?.color }} />}
                                <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: PLATFORM_META[item.platform]?.color }}>{item.platform}</span>
                                <span className="text-[10px] font-medium text-accent/40">{item.time}</span>
                              </div>
                              <button
                                onClick={() => deletePost(item.id)}
                                className="p-1.5 hover:bg-red-500/10 rounded-lg text-accent/20 hover:text-red-500 transition-all"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <p className="text-xs text-accent/60 line-clamp-2">{item.content}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-xl border-border border-dashed p-8 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-xl bg-accent/5 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-accent/20" />
                </div>
                <h4 className="text-xs font-bold text-accent/30 uppercase tracking-wider">Select a Date</h4>
                <p className="text-[11px] text-accent/20 mt-1">Click on a date to view and manage posts.</p>
              </div>
            )}

            {/* Platform Legend */}
            <div className="glass-card rounded-xl border-border p-4">
              <div className="text-[10px] font-bold text-accent/40 uppercase tracking-wider mb-4">Platforms</div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(PLATFORM_META).map(([name, { color, icon: Icon }]) => (
                  <div key={name} className="flex items-center gap-2">
                    <Icon size={12} style={{ color }} />
                    <span className="text-[10px] font-bold text-accent/40 uppercase tracking-wide">{name}</span>
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
              className="glass-card rounded-xl p-6 max-w-lg w-full border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-foreground">Schedule Post</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-accent/5 rounded-lg text-accent/20 hover:text-accent transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-accent/40 uppercase tracking-wide mb-2 block">Platform</label>
                  <select
                    value={newPost.platform}
                    onChange={(e) => setNewPost({ ...newPost, platform: e.target.value })}
                    className="w-full px-4 py-3 bg-accent/5 border border-border rounded-xl text-foreground font-medium outline-none focus:border-accent/40 transition-all"
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
                  <label className="text-xs font-bold text-accent/40 uppercase tracking-wide mb-2 block">Time</label>
                  <input
                    type="time"
                    value={newPost.time}
                    onChange={(e) => setNewPost({ ...newPost, time: e.target.value })}
                    className="w-full px-4 py-3 bg-accent/5 border border-border rounded-xl text-foreground font-medium outline-none focus:border-accent/40 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-accent/40 uppercase tracking-wide mb-2 block">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={4}
                    placeholder="What's on your mind?"
                    className="w-full px-4 py-3 bg-accent/5 border border-border rounded-xl text-foreground font-medium outline-none focus:border-accent/40 transition-all resize-none placeholder-accent/20"
                  />
                </div>

                <button
                  onClick={addScheduledPost}
                  disabled={!newPost.content.trim()}
                  className="w-full py-3 premium-gradient rounded-xl text-white text-xs font-bold uppercase tracking-wide shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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