'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Palette, Plus, Edit2, Trash2, Save, X, Sparkles,
  Zap, Check, ChevronDown, Tag, PenLine, Star, Layers, Activity,
  BrainCircuit, LayoutGrid
} from 'lucide-react';
import AuraHarvester from '../../components/AuraHarvester';
import { BrandVoiceSkeleton } from '../../components/Skeleton';

interface BrandVoice {
  id: string;
  name: string;
  tone: string;
  keywords: string[];
  style: string;
  brandGuide?: string;
  isDefault: boolean;
}

const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional', color: '#0EA5E9' },
  { value: 'casual', label: 'Casual', color: '#8B5CF6' },
  { value: 'enthusiastic', label: 'Enthusiastic', color: '#F59E0B' },
  { value: 'informative', label: 'Informative', color: '#10B981' },
  { value: 'friendly', label: 'Friendly', color: '#EC4899' },
  { value: 'authoritative', label: 'Authoritative', color: '#EF4444' },
];

const TONE_COLOR: Record<string, string> = Object.fromEntries(TONE_OPTIONS.map(t => [t.value, t.color]));

function TonePill({ tone }: { tone: string }) {
  const color = TONE_COLOR[tone] ?? '#0EA5E9';
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight sm:tracking-widest"
      style={{ background: `${color}10`, color, border: `1px solid ${color}20` }}
    >
      <div className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {tone}
    </span>
  );
}

import { useRouter } from 'next/navigation';

export default function BrandVoicePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return <BrandVoiceSkeleton />;
  }

  const [isPro] = useState(false);
  const [voices, setVoices] = useState<BrandVoice[]>([
    {
      id: '1',
      name: 'PRO CORE',
      tone: 'professional',
      keywords: ['innovative', 'strategic', 'results-driven'],
      style: 'Clear, authoritative, data-backed architecture.',
      isDefault: true,
    },
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', tone: 'professional', keywords: '', style: '', brandGuide: '' });
  const [toneOpen, setToneOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<'manual' | 'harvest'>('manual');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isFormOpen = isCreating || !!editingId;

  const handleSave = () => {
    if (editingId) {
      setVoices(voices.map(v =>
        v.id === editingId
          ? { ...v, name: formData.name, tone: formData.tone, keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean), style: formData.style, brandGuide: formData.brandGuide }
          : v
      ));
      setEditingId(null);
    } else {
      setVoices([...voices, {
        id: Date.now().toString(),
        name: formData.name,
        tone: formData.tone,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
        style: formData.style,
        brandGuide: formData.brandGuide,
        isDefault: voices.length === 0,
      }]);
      setIsCreating(false);
    }
    setFormData({ name: '', tone: 'professional', keywords: '', style: '', brandGuide: '' });
    setToneOpen(false);
  };

  const handleEdit = (voice: BrandVoice) => {
    setEditingId(voice.id);
    setIsCreating(false);
    setFormData({ name: voice.name, tone: voice.tone, keywords: voice.keywords.join(', '), style: voice.style, brandGuide: voice.brandGuide || '' });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ name: '', tone: 'professional', keywords: '', style: '', brandGuide: '' });
    setToneOpen(false);
  };

  const handleDelete = (id: string) => {
    setVoices(voices.filter(v => v.id !== id));
    setDeletingId(null);
  };

  const setDefault = (id: string) => setVoices(voices.map(v => ({ ...v, isDefault: v.id === id })));

  const canCreate = isPro || voices.length < 1;
  const selectedTone = TONE_OPTIONS.find(t => t.value === formData.tone);

  return (
    <div className="container mx-auto max-w-5xl animate-in fade-in duration-700">

      {/* Cinematic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-4"
          >
            <Palette className="h-4 w-4 text-accent" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-accent">Aura Configurator</span>
          </motion.div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-foreground">GENETIC <span className="text-gradient">AURA</span></h1>
        </div>

        {!isFormOpen && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreating(true)}
            disabled={!canCreate}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase transition-all
                        ${canCreate
                ? 'premium-gradient text-white shadow-xl shadow-primary/20'
                : 'bg-white border border-border text-accent/20 cursor-not-allowed'}`}
          >
            <Plus className="h-4 w-4" />
            SYNTHESIZE NEW CORE
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            className="mb-8 sm:mb-12 glass-card rounded-2xl sm:rounded-2xl border-border overflow-hidden shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 premium-gradient opacity-30" />

            <div className="flex items-center justify-between p-5 sm:p-8 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-foreground tracking-widest uppercase">
                    {editingId ? 'Edit Profile' : 'Configure Aura'}
                  </h3>
                  <p className="text-[10px] font-bold text-accent/40 uppercase tracking-[0.2em]">Neural Calibration Active</p>
                </div>
              </div>
              <button onClick={handleCancel} className="p-3 hover:bg-accent/5 rounded-2xl text-accent/40 hover:text-foreground transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 p-2 bg-accent/5 border-b border-border">
              <button
                onClick={() => setCreationMode('manual')}
                className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${creationMode === 'manual' ? 'bg-white text-foreground shadow-sm' : 'text-accent/20 hover:text-accent/40'}`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> MANUAL FORGE
              </button>
              <button
                onClick={() => setCreationMode('harvest')}
                className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${creationMode === 'harvest' ? 'bg-primary/10 text-primary shadow-sm' : 'text-accent/20 hover:text-accent/40'}`}
              >
                <BrainCircuit className="h-3.5 w-3.5" /> NEURAL HARVEST
              </button>
            </div>

            {creationMode === 'harvest' && (
              <div className="p-5 sm:p-10 border-b border-border bg-primary/[0.02]">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <BrainCircuit className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-foreground tracking-widest uppercase">Neural Synchronization</h4>
                      <p className="text-[10px] font-bold text-accent/40 uppercase tracking-widest">Awaiting uplink signal...</p>
                    </div>
                  </div>
                  <AuraHarvester onAnalysisComplete={(aura, sourceText) => {
                    setFormData({
                      ...formData,
                      tone: aura.tone,
                      keywords: aura.keywords.join(', '),
                      style: aura.style,
                      brandGuide: sourceText || ''
                    });
                    setCreationMode('manual');
                  }} />
                </div>
              </div>
            )}

            <div className="p-5 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-accent/40 uppercase tracking-[0.3em] mb-4">
                    Designation <span className="normal-case tracking-normal text-accent/20 font-bold">(Name)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.G. SILICON VALLEY NEXUS"
                    className="w-full px-6 py-4 bg-white border border-border rounded-2xl text-foreground placeholder-accent/10 text-sm font-bold tracking-tight focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-accent/40 uppercase tracking-[0.3em] mb-4">
                    Neural Tone <span className="normal-case tracking-normal text-accent/20 font-bold">(Tone)</span>
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setToneOpen(!toneOpen)}
                      className="w-full flex items-center justify-between px-6 py-4 bg-white border border-border rounded-2xl text-sm font-bold text-foreground transition-all hover:border-accent/20 focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full" style={{ background: selectedTone?.color }} />
                        <span className="uppercase tracking-widest">{selectedTone?.label}</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-accent/40 transition-transform ${toneOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {toneOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute z-50 mt-3 w-full glass-card border-border rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl"
                        >
                          {TONE_OPTIONS.map(t => (
                            <button
                              key={t.value}
                              onClick={() => { setFormData({ ...formData, tone: t.value }); setToneOpen(false); }}
                              className="w-full flex items-center justify-between px-6 py-4 text-xs font-black uppercase tracking-widest hover:bg-accent/5 transition-colors text-left text-accent/40 hover:text-foreground"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full" style={{ background: t.color }} />
                                <span>{t.label}</span>
                              </div>
                              {formData.tone === t.value && <Check className="h-4 w-4" style={{ color: t.color }} />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-accent/40 uppercase tracking-[0.3em] mb-4">
                    Semantic Nodes <span className="normal-case tracking-normal text-accent/20 font-bold">(Keywords, comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="INNOVATIVE, ARCHITECTURAL, BOLD"
                    className="w-full px-6 py-4 bg-white border border-border rounded-2xl text-foreground placeholder-accent/10 text-sm font-bold tracking-tight focus:outline-none focus:border-accent/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-accent/40 uppercase tracking-[0.3em] mb-4">
                    Aura Blueprint <span className="normal-case tracking-normal text-accent/20 font-bold">(Writing style)</span>
                  </label>
                  <textarea
                    value={formData.style}
                    onChange={e => setFormData({ ...formData, style: e.target.value })}
                    placeholder="DESCRIBE THE CORE ESSENCE OF THIS VOICE..."
                    rows={1}
                    className="w-full px-6 py-4 bg-white border border-border rounded-2xl text-foreground placeholder-accent/10 text-sm font-bold tracking-tight focus:outline-none focus:border-accent/50 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black text-accent/40 uppercase tracking-[0.3em] mb-4">
                    Brand Guidelines Context (RAG)
                    <span className="text-[8px] tracking-normal text-primary">OPTIONAL</span>
                  </label>
                  <textarea
                    value={formData.brandGuide || ''}
                    onChange={e => setFormData({ ...formData, brandGuide: e.target.value })}
                    placeholder="PASTE YOUR BRAND GUIDELINES, DO'S AND DON'TS, OR MANIFESTO HERE FOR THE AI TO REFERENCE..."
                    rows={4}
                    className="w-full px-6 py-4 bg-white border border-border rounded-2xl text-foreground placeholder-accent/10 text-sm font-bold tracking-tight focus:outline-none focus:border-accent/50 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2 pt-4 sm:pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={!formData.name.trim()}
                  className="flex-1 sm:flex-none px-6 sm:px-10 py-4 sm:py-5 premium-gradient text-white text-[10px] font-black tracking-[0.3em] uppercase rounded-2xl shadow-xl shadow-primary/20 disabled:opacity-40 text-center"
                >
                  Confirm Configuration
                </motion.button>
                <button
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none px-6 sm:px-10 py-4 sm:py-5 bg-white border border-border text-accent/40 text-[10px] font-black tracking-[0.3em] uppercase rounded-2xl hover:text-foreground hover:border-accent/30 transition-all text-center"
                >
                  Abort
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {voices.map((voice) => (
          <motion.div
            layout
            key={voice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className={`group relative glass-card rounded-2xl sm:rounded-2xl p-5 sm:p-10 border-border transition-all overflow-hidden
                        ${voice.isDefault ? 'border-primary/40 ring-2 ring-primary/10 shadow-[0_0_50px_-12px_rgba(236,88,0,0.1)]' : 'hover:border-accent/20'}`}
          >
            {voice.isDefault && (
              <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-primary/5 pointer-events-none"
              />
            )}
            <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: TONE_COLOR[voice.tone] }} />

            <div className="flex items-start justify-between mb-5 sm:mb-8">
              <div className="flex items-center gap-3 sm:gap-5 min-w-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[1.25rem] flex items-center justify-center bg-white border border-border group-hover:scale-110 transition-transform shrink-0">
                  <Palette className="h-5 w-5 sm:h-7 sm:w-7" style={{ color: TONE_COLOR[voice.tone] }} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-2xl font-black text-foreground tracking-tighter uppercase truncate">{voice.name}</h3>
                  <div className="mt-2">
                    <TonePill tone={voice.tone} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {voice.isDefault ? (
                  <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                    <Star className="h-5 w-5 text-primary fill-current" />
                  </div>
                ) : (
                  <button onClick={() => setDefault(voice.id)} className="p-3 bg-white border border-border rounded-2xl text-accent/20 hover:text-accent transition-all">
                    <Star className="h-5 w-5" />
                  </button>
                )}
                <button onClick={() => handleEdit(voice)} className="p-3 bg-white border border-border rounded-2xl text-accent/20 hover:text-primary transition-all">
                  <Edit2 className="h-5 w-5" />
                </button>
                {!voice.isDefault && (
                  <button onClick={() => setDeletingId(voice.id)} className="p-3 bg-white border border-border rounded-2xl text-accent/20 hover:text-red-400 transition-all">
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 text-[10px] font-black text-accent/40 uppercase tracking-[0.3em] mb-4">
                  <Layers className="h-3.5 w-3.5" /> Semantic Framework
                </div>
                <div className="flex flex-wrap gap-2">
                  {voice.keywords.map((kw, i) => (
                    <span key={i} className="px-4 py-2 bg-white border border-border rounded-xl text-[10px] font-bold text-accent/40 uppercase tracking-widest">{kw}</span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 text-[10px] font-black text-accent/40 uppercase tracking-[0.3em] mb-4">
                  <Activity className="h-3.5 w-3.5" /> Style Dynamics
                </div>
                <p className="text-sm font-medium text-accent/60 leading-relaxed">{voice.style}</p>
              </div>
            </div>

            <AnimatePresence>
              {deletingId === voice.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center z-50"
                >
                  <h4 className="text-xl font-black text-foreground tracking-widest uppercase mb-4">Terminate Profile?</h4>
                  <p className="text-sm text-accent/40 mb-8 max-w-xs">This operation is irreversible. Neural patterns will be lost.</p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleDelete(voice.id)} className="px-8 py-4 bg-red-500 text-white text-[10px] font-black tracking-[0.2em] uppercase rounded-2xl">Confirm</button>
                    <button onClick={() => setDeletingId(null)} className="px-8 py-4 bg-white border border-border text-accent/40 text-[10px] font-black tracking-[0.2em] uppercase rounded-2xl">Abort</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {!isPro && voices.length === 1 && (
          <div className="glass-card rounded-2xl sm:rounded-2xl p-8 sm:p-12 border-border border-dashed flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white border border-border flex items-center justify-center mb-6 relative">
              <Zap className="h-8 w-8 text-accent/10" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-4px] border border-primary/20 rounded-xl border-t-transparent"
              />
            </div>
            <h4 className="text-sm font-black text-accent/20 uppercase tracking-[0.4em] mb-2">NEURAL SLOT LOCKED</h4>
            <p className="text-[10px] font-bold text-accent/10 uppercase tracking-widest max-w-[150px] leading-relaxed">Upgrade to PRO for infinite multidimensional profiles.</p>
            <Link href="/settings" className="mt-8 px-8 py-4 premium-gradient rounded-2xl text-white text-[10px] font-black tracking-widest uppercase shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              Initialize Pro Uplink
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}