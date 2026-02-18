'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, CalendarDays, X, Sparkles, Target, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4"
          >
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">Content Timeline</span>
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter text-white">CHRONOS <span className="text-gradient">CALENDAR</span></h1>
        </div>

        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center gap-1 p-1.5 glass-card border-white/5 rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button onClick={prevMonth} className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-white/50 hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="px-4 text-center min-w-[140px]">
              <div className="text-sm font-black text-white uppercase tracking-widest">{MONTH_NAMES[month]}</div>
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{year}</div>
            </div>
            <button onClick={nextMonth} className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-white/50 hover:text-white">
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>

          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-6 py-3.5 glass-card border-white/10 text-[10px] font-black tracking-[0.2em] uppercase text-white hover:border-white/30 transition-all rounded-2xl"
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
            className="glass-card rounded-[2.5rem] border-white/5 p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 premium-gradient opacity-30" />

            <div className="grid grid-cols-7 mb-6">
              {DAY_NAMES.map(d => (
                <div key={d} className="text-center text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
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
                      group relative aspect-square rounded-3xl p-4 flex flex-col items-center justify-center transition-all border
                      ${today_
                        ? 'premium-gradient text-white border-transparent shadow-xl shadow-primary/20'
                        : sel
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-white/[0.03] border-white/5 text-white/30 hover:bg-white/[0.06] hover:border-white/10 hover:text-white'
                      }
                    `}
                  >
                    <span className="text-xl font-black tracking-tighter leading-none mb-2">{day}</span>

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="glass-card rounded-[2.5rem] border-white/5 p-8 relative overflow-hidden">
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
                  className="w-full py-5 premium-gradient rounded-3xl text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/20 flex items-center justify-center gap-3 mb-8"
                >
                  <Plus className="h-4 w-4" />
                  INITIALIZE PLAN
                </motion.button>

                <div className="space-y-4">
                  <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">SEQUENCE ACTIVE</div>
                  {scheduledFor(selectedDate.getDate()).length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center justify-center opacity-20">
                      <Sparkles className="h-8 w-8 mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Void Detected</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {scheduledFor(selectedDate.getDate()).map(item => (
                        <div key={item.id} className="p-5 glass-card border-white/10 rounded-3xl relative overflow-hidden group">
                          <div className="absolute top-0 left-0 bottom-0 w-1 premium-gradient" />
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{item.platform}</span>
                            <span className="text-[10px] font-bold text-white/20">{item.time}</span>
                          </div>
                          <p className="text-sm font-medium text-white/60 line-clamp-2">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-[2.5rem] border-white/5 border-dashed p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-white/[0.03] flex items-center justify-center mb-6">
                  <Activity className="h-8 w-8 text-white/20" />
                </div>
                <h4 className="text-sm font-black text-white/30 uppercase tracking-[0.3em]">SELECT NODE</h4>
                <p className="text-xs font-medium text-white/10 mt-2">Activate a date cluster to manage operations.</p>
              </div>
            )}

            {/* Metadata / Legend */}
            <div className="glass-card rounded-[2rem] border-white/5 p-6">
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
    </div>
  );
}