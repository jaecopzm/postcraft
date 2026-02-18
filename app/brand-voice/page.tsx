'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Palette, Plus, Edit2, Trash2, Save, X, Sparkles,
  Zap, Check, ChevronDown, Tag, PenLine, Star, Layers, Activity,
  BrainCircuit, LayoutGrid
} from 'lucide-react';
import AuraHarvester from '../../components/AuraHarvester';

interface BrandVoice {
  id: string;
  name: string;
  tone: string;
  keywords: string[];
  style: string;
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
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
      style={{ background: `${color}10`, color, border: `1px solid ${color}20` }}
    >
      <div className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {tone}
    </span>
  );
}

export default function BrandVoicePage() {
  const { user } = useAuth();
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
  const [formData, setFormData] = useState({ name: '', tone: 'professional', keywords: '', style: '' });
  const [toneOpen, setToneOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<'manual' | 'harvest'>('manual');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isFormOpen = isCreating || !!editingId;

  const handleSave = () => {
    if (editingId) {
      setVoices(voices.map(v =>
        v.id === editingId
          ? { ...v, name: formData.name, tone: formData.tone, keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean), style: formData.style }
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
        isDefault: false,
      }]);
      setIsCreating(false);
    }
    setFormData({ name: '', tone: 'professional', keywords: '', style: '' });
    setToneOpen(false);
  };

  const handleEdit = (voice: BrandVoice) => {
    setEditingId(voice.id);
    setIsCreating(false);
    setFormData({ name: voice.name, tone: voice.tone, keywords: voice.keywords.join(', '), style: voice.style });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ name: '', tone: 'professional', keywords: '', style: '' });
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4"
          >
            <Palette className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">Aura Configurator</span>
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter text-white">BRAND <span className="text-gradient">VOICE</span></h1>
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
                : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'}`}
          >
            <Plus className="h-4 w-4" />
            Generate New Profile
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 20 }}
            className="mb-12 glass-card rounded-[2.5rem] border-white/5 overflow-hidden shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 premium-gradient opacity-30" />

            <div className="flex items-center justify-between p-8 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white tracking-widest uppercase">
                    {editingId ? 'Edit Profile' : 'Configure Aura'}
                  </h3>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Neural Calibration Active</p>
                </div>
              </div>
              <button onClick={handleCancel} className="p-3 hover:bg-white/5 rounded-2xl text-white/20 hover:text-white transition-all">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 p-2 bg-white/5 border-b border-white/5">
              <button
                onClick={() => setCreationMode('manual')}
                className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${creationMode === 'manual' ? 'bg-white/10 text-white shadow-xl' : 'text-white/20 hover:text-white/40'}`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> MANUAL FORGE
              </button>
              <button
                onClick={() => setCreationMode('harvest')}
                className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${creationMode === 'harvest' ? 'bg-primary/20 text-primary shadow-xl shadow-primary/10' : 'text-white/20 hover:text-white/40'}`}
              >
                <BrainCircuit className="h-3.5 w-3.5" /> NEURAL HARVEST
              </button>
            </div>

            {creationMode === 'harvest' && (
              <div className="p-10 border-b border-white/5 bg-primary/[0.02]">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <BrainCircuit className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white tracking-widest uppercase">Neural Synchronization</h4>
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Awaiting uplink signal...</p>
                    </div>
                  </div>
                  <AuraHarvester onAnalysisComplete={(aura) => {
                    setFormData({
                      ...formData,
                      tone: aura.tone,
                      keywords: aura.keywords.join(', '),
                      style: aura.style
                    });
                    setCreationMode('manual');
                  }} />
                </div>
              </div>
            )}

            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Designation</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.G. SILICON VALLEY NEXUS"
                    className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/10 text-sm font-bold tracking-tight focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Neural Tone</label>
                  <div className="relative">
                    <button
                      onClick={() => setToneOpen(!toneOpen)}
                      className="w-full flex items-center justify-between px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm font-bold text-white transition-all hover:border-white/20 focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full" style={{ background: selectedTone?.color }} />
                        <span className="uppercase tracking-widest">{selectedTone?.label}</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-white/20 transition-transform ${toneOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {toneOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute z-50 mt-3 w-full glass-card border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl"
                        >
                          {TONE_OPTIONS.map(t => (
                            <button
                              key={t.value}
                              onClick={() => { setFormData({ ...formData, tone: t.value }); setToneOpen(false); }}
                              className="w-full flex items-center justify-between px-6 py-4 text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-colors text-left text-white/50 hover:text-white"
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
                  <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Semantic Nodes</label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={e => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="INNOVATIVE, ARCHITECTURAL, BOLD"
                    className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/10 text-sm font-bold tracking-tight focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Aura Blueprint</label>
                  <textarea
                    value={formData.style}
                    onChange={e => setFormData({ ...formData, style: e.target.value })}
                    placeholder="DESCRIBE THE CORE ESSENCE OF THIS VOICE..."
                    rows={1}
                    className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/10 text-sm font-bold tracking-tight focus:outline-none focus:border-primary/50 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2 pt-6 flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={!formData.name.trim()}
                  className="px-10 py-5 premium-gradient text-white text-[10px] font-black tracking-[0.3em] uppercase rounded-2xl shadow-xl shadow-primary/20 disabled:opacity-40"
                >
                  Confirm Configuration
                </motion.button>
                <button
                  onClick={handleCancel}
                  className="px-10 py-5 bg-white/5 border border-white/10 text-white/40 text-[10px] font-black tracking-[0.3em] uppercase rounded-2xl hover:text-white hover:border-white/20 transition-all"
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
            className={`group relative glass-card rounded-[2.5rem] p-10 border-white/5 transition-all overflow-hidden
                        ${voice.isDefault ? 'border-primary/30 ring-1 ring-primary/20' : 'hover:border-white/20'}`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: TONE_COLOR[voice.tone] }} />

            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center bg-white/[0.03] border border-white/10 group-hover:scale-110 transition-transform">
                  <Palette className="h-7 w-7" style={{ color: TONE_COLOR[voice.tone] }} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{voice.name}</h3>
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
                  <button onClick={() => setDefault(voice.id)} className="p-3 bg-white/5 rounded-2xl text-white/20 hover:text-white transition-all">
                    <Star className="h-5 w-5" />
                  </button>
                )}
                <button onClick={() => handleEdit(voice)} className="p-3 bg-white/5 rounded-2xl text-white/20 hover:text-primary transition-all">
                  <Edit2 className="h-5 w-5" />
                </button>
                {!voice.isDefault && (
                  <button onClick={() => setDeletingId(voice.id)} className="p-3 bg-white/5 rounded-2xl text-white/20 hover:text-red-400 transition-all">
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">
                  <Layers className="h-3.5 w-3.5" /> Semantic Framework
                </div>
                <div className="flex flex-wrap gap-2">
                  {voice.keywords.map((kw, i) => (
                    <span key={i} className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl text-[10px] font-bold text-white/40 uppercase tracking-widest">{kw}</span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">
                  <Activity className="h-3.5 w-3.5" /> Style Dynamics
                </div>
                <p className="text-sm font-medium text-white/60 leading-relaxed">{voice.style}</p>
              </div>
            </div>

            <AnimatePresence>
              {deletingId === voice.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-[#050505]/90 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center z-50"
                >
                  <h4 className="text-xl font-black text-white tracking-widest uppercase mb-4">Terminate Profile?</h4>
                  <p className="text-sm text-white/40 mb-8 max-w-xs">This operation is irreversible. Neural patterns will be lost.</p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleDelete(voice.id)} className="px-8 py-4 bg-red-500 text-white text-[10px] font-black tracking-[0.2em] uppercase rounded-2xl">Confirm</button>
                    <button onClick={() => setDeletingId(null)} className="px-8 py-4 bg-white/5 text-white/50 text-[10px] font-black tracking-[0.2em] uppercase rounded-2xl">Abort</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {!isPro && voices.length === 1 && (
          <div className="glass-card rounded-[2.5rem] p-10 border-white/5 border-dashed flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-16 h-16 rounded-[1.25rem] bg-white/[0.03] flex items-center justify-center mb-6">
              <Zap className="h-8 w-8 text-white/20" />
            </div>
            <h4 className="text-sm font-black text-white/30 uppercase tracking-[0.3em]">SLOT RESTRICTED</h4>
            <p className="text-xs font-medium text-white/10 mt-2">Upgrade to PRO for infinite Aura slots.</p>
            <Link href="/settings" className="mt-8 px-6 py-3 premium-gradient rounded-xl text-white text-[10px] font-black tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">Upgrade</Link>
          </div>
        )}
      </div>
    </div>
  );
}