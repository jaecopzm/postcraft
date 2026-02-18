import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, X, Copy, Check, Type, Hash, Smile, Scissors } from 'lucide-react';

interface PostEditorProps {
    initialContent: string;
    platform: string;
    onSave: (newContent: string) => void;
    onCancel: () => void;
}

export default function PostEditor({ initialContent, platform, onSave, onCancel }: PostEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [copied, setCopied] = useState(false);

    const characterLimits: Record<string, number> = {
        twitter: 280,
        linkedin: 3000,
        instagram: 2200,
        facebook: 63206,
        tiktok: 2200,
        youtube: 5000
    };

    const limit = characterLimits[platform] || 280;
    const isOverLimit = content.length > limit;

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card rounded-3xl border-white/10 overflow-hidden shadow-2xl"
        >
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 premium-gradient rounded-xl shadow-lg shadow-primary/20 text-white font-black text-xs uppercase tracking-widest">
                        {platform}
                    </div>
                    <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Neural Feedback Editor</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-3 bg-white/5 rounded-xl text-white/30 hover:text-white transition-all overflow-hidden relative group"
                    >
                        <AnimatePresence mode="wait">
                            {copied ? (
                                <motion.div key="check" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}>
                                    <Check className="h-4 w-4 text-green-400" />
                                </motion.div>
                            ) : (
                                <motion.div key="copy" initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: -20 }}>
                                    <Copy className="h-4 w-4" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                    <button
                        onClick={onCancel}
                        className="p-3 bg-white/5 rounded-xl text-white/30 hover:text-red-400 transition-all"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="p-8 space-y-6">
                <div className="relative">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-transparent border-none text-white text-base leading-relaxed font-medium placeholder-white/10 focus:outline-none focus:ring-0 resize-none min-h-[200px]"
                        placeholder="REFINE YOUR MESSAGE..."
                        autoFocus
                    />

                    <div className="absolute top-0 right-0 w-32 h-32 premium-gradient blur-[100px] opacity-10 pointer-events-none" />
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${isOverLimit ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-primary'}`} />
                            <span className={`text-[10px] font-black tracking-widest uppercase ${isOverLimit ? 'text-red-500' : 'text-white/30'}`}>
                                {content.length} / {limit} CHARS
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onSave(content)}
                            className="flex items-center gap-3 px-8 py-4 premium-gradient text-white text-[10px] font-black tracking-[0.2em] uppercase rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                        >
                            <Save className="h-4 w-4" />
                            Preserve
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
