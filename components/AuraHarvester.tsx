import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, FileText, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../app/contexts/AuthContext';

interface AuraHarvesterProps {
    onAnalysisComplete: (aura: { tone: string; keywords: string[]; style: string }) => void;
}

export default function AuraHarvester({ onAnalysisComplete }: AuraHarvesterProps) {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'url' | 'text'>('url');
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!input.trim() || !user) return;

        setLoading(true);
        setError(null);
        try {
            const idToken = await user.getIdToken();
            const response = await fetch('/api/analyze-voice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({
                    [activeTab]: input
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Analysis failed');

            onAnalysisComplete(data.aura);
            setInput('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/5 border border-white/5 rounded-2xl w-full sm:w-fit">
                <button
                    onClick={() => { setActiveTab('url'); setError(null); }}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'url' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
                >
                    <Link2 className="h-3.5 w-3.5" /> URL UPLINK
                </button>
                <button
                    onClick={() => { setActiveTab('text'); setError(null); }}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'text' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
                >
                    <FileText className="h-3.5 w-3.5" /> TEXT SNIPPET
                </button>
            </div>

            <div className="relative group">
                {activeTab === 'url' ? (
                    <input
                        type="url"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="PASTE URL (TWITTER, BLOG, LINKEDIN)..."
                        className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/10 text-sm font-bold tracking-tight focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all backdrop-blur-md group-hover:border-white/20"
                    />
                ) : (
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="PASTE SAMPLE CONTENT FOR ANALYSIS (MIN 50 CHARS)..."
                        rows={4}
                        className="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder-white/10 text-sm font-bold tracking-tight focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all resize-none backdrop-blur-md group-hover:border-white/20"
                    />
                )}
                <div className="absolute inset-0 pointer-events-none rounded-2xl border border-primary/0 group-focus-within:border-primary/20 transition-all duration-500" />
            </div>

            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold"
                    >
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={loading || !input.trim()}
                className="w-full flex items-center justify-center gap-3 px-8 py-5 premium-gradient text-white text-[10px] font-black tracking-[0.3em] uppercase rounded-2xl shadow-xl shadow-primary/20 disabled:opacity-40 transition-all overflow-hidden relative group"
            >
                {loading && (
                    <motion.div
                        className="absolute inset-0 bg-white/5 z-0"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                )}
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-3">
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                            <span className="animate-pulse">ANALYZING NEURAL PATTERNS...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-4 w-4" />
                            HARVEST AURA
                        </>
                    )}
                </span>
            </motion.button>
        </div>
    );
}
