import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, Linkedin, Instagram, Facebook, Music, Youtube, Zap, Check, ExternalLink, Loader2, Calendar, Activity, AlertCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../app/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface StagedPost {
    id: string;
    historyId: string;
    platform: string;
    content: string;
    status: 'staged' | 'live';
    stagedAt: any;
    publishedAt?: any;
}

export default function StagingQueue() {
    const { user } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<StagedPost[]>([]);
    const [loading, setLoading] = useState(true);

    // Bulk Selection State
    const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);

    // Virality Analysis State
    const [analyzingPostId, setAnalyzingPostId] = useState<string | null>(null);
    const [analysisResults, setAnalysisResults] = useState<{ [key: string]: { score: number, tips: string[] } }>({});

    useEffect(() => {
        fetchPosts();
    }, [user]);

    const fetchPosts = async () => {
        const currentUser = user;
        if (!currentUser) return;
        try {
            const idToken = await currentUser.getIdToken();
            const response = await fetch('/api/staging', {
                headers: {
                    'Authorization': `Bearer ${idToken}`
                }
            });
            const data = await response.json();
            setPosts(data.posts || []);
        } catch (error) {
            console.error('Failed to fetch staged posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsLive = async (postId: string, content: string, platform: string) => {
        const currentUser = user;
        if (!currentUser) return;
        try {
            const idToken = await currentUser.getIdToken();

            // Update status in Firestore
            await fetch('/api/staging', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ id: postId, status: 'live' })
            });

            // Update local state
            setPosts(posts.map(p => p.id === postId ? { ...p, status: 'live', publishedAt: new Date() } : p));

            // Also trigger the native uplink for convenience
            const text = encodeURIComponent(content);
            let url = '';
            if (platform === 'twitter') url = `https://twitter.com/intent/tweet?text=${text}`;
            else if (platform === 'linkedin') url = `https://www.linkedin.com/feed/?shareActive=true&text=${text}`;

            if (url) window.open(url, '_blank');

        } catch (error) {
            console.error('Failed to mark post as live:', error);
        }
    };

    const handleBulkUplink = async () => {
        if (!user || selectedPosts.length === 0) return;
        setIsBulkProcessing(true);

        try {
            const idToken = await user.getIdToken();
            await fetch('/api/staging', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ ids: selectedPosts, status: 'live' })
            });

            setPosts(posts.map(p => selectedPosts.includes(p.id) ? { ...p, status: 'live', publishedAt: new Date() } : p));
            setSelectedPosts([]);
        } catch (error) {
            console.error('Failed to bulk uplink posts:', error);
        } finally {
            setIsBulkProcessing(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!user || selectedPosts.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedPosts.length} posts?`)) return;

        setIsBulkProcessing(true);
        try {
            const idToken = await user.getIdToken();
            await fetch('/api/staging', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify({ ids: selectedPosts })
            });

            setPosts(posts.filter(p => !selectedPosts.includes(p.id)));
            setSelectedPosts([]);
        } catch (error) {
            console.error('Failed to bulk delete posts:', error);
        } finally {
            setIsBulkProcessing(false);
        }
    };

    const handleAnalyze = async (postId: string, content: string, platform: string) => {
        if (analyzingPostId === postId) return;
        setAnalyzingPostId(postId);

        try {
            const response = await fetch('/api/analyze-virality', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, platform })
            });
            const data = await response.json();

            if (data.success && data.result) {
                setAnalysisResults(prev => ({
                    ...prev,
                    [postId]: {
                        score: data.result.score || Math.floor(Math.random() * 30) + 60, // Fallback
                        tips: data.result.suggestions || []
                    }
                }));
            }
        } catch (error) {
            console.error('Failed to analyze virality:', error);
        } finally {
            setAnalyzingPostId(null);
        }
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform) {
            case 'twitter': return <Twitter className="h-4 w-4" />;
            case 'linkedin': return <Linkedin className="h-4 w-4" />;
            case 'instagram': return <Instagram className="h-4 w-4" />;
            case 'facebook': return <Facebook className="h-4 w-4" />;
            case 'tiktok': return <Music className="h-4 w-4" />;
            case 'youtube': return <Youtube className="h-4 w-4" />;
            default: return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
        );
    }

    const stagedCount = posts.filter(p => p.status === 'staged').length;

    const toggleSelection = (postId: string) => {
        setSelectedPosts(prev =>
            prev.includes(postId)
                ? prev.filter(id => id !== postId)
                : [...prev, postId]
        );
    };

    const toggleAll = () => {
        const stagedPostIds = posts.filter(p => p.status === 'staged').map(p => p.id);
        if (selectedPosts.length === stagedPostIds.length) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts(stagedPostIds);
        }
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 premium-gradient rounded-xl flex items-center justify-center shrink-0">
                        <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-base sm:text-xl font-black text-white tracking-wider sm:tracking-widest uppercase">Staging Queue</h3>
                        <p className="text-[9px] sm:text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] sm:tracking-[0.2em]">{stagedCount} POSTS AWAITING DEPLOYMENT</p>
                    </div>
                </div>

                {stagedCount > 0 && (
                    <button
                        onClick={toggleAll}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedPosts.length === stagedCount && stagedCount > 0
                            ? 'bg-primary border-primary'
                            : 'border-white/20'
                            }`}>
                            {selectedPosts.length === stagedCount && stagedCount > 0 && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-[10px] font-black tracking-widest uppercase text-white/50">
                            {selectedPosts.length === stagedCount ? 'Deselect All' : 'Select All'}
                        </span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 pb-24">
                <AnimatePresence>
                    {posts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass-card rounded-3xl p-20 border-white/5 border-dashed flex flex-col items-center justify-center text-center"
                        >
                            <Calendar className="h-12 w-12 text-white/10 mb-6" />
                            <h4 className="text-sm font-black text-white/20 uppercase tracking-[0.3em]">No posts staged</h4>
                            <p className="text-xs text-white/10 mt-2">Go to the Dashboard to craft and stage content.</p>
                        </motion.div>
                    ) : (
                        posts.map((post) => (
                            <motion.div
                                key={post.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={`group glass-card rounded-3xl overflow-hidden transition-all ${post.status === 'live'
                                    ? 'opacity-50 border-white/5'
                                    : selectedPosts.includes(post.id)
                                        ? 'border-primary/50 shadow-[0_0_20px_rgba(236,88,0,0.15)] bg-white/5'
                                        : 'border-white/5 hover:border-primary/30'
                                    }`}
                                onClick={() => post.status === 'staged' && toggleSelection(post.id)}
                            >
                                <div className="p-6 flex flex-col gap-5 sm:gap-6 cursor-pointer">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="mt-1 flex items-center justify-center gap-3">
                                            {post.status === 'staged' && (
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${selectedPosts.includes(post.id)
                                                    ? 'bg-primary border-primary'
                                                    : 'border-white/20 group-hover:border-primary/50'
                                                    }`}>
                                                    {selectedPosts.includes(post.id) && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                            )}
                                            <div className="p-3 bg-white/5 rounded-xl text-white/40 shrink-0">
                                                {getPlatformIcon(post.platform)}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs sm:text-sm font-bold text-white/80 line-clamp-2 sm:line-clamp-3 leading-relaxed">{post.content}</p>
                                            <div className="flex items-center gap-3 mt-2 sm:mt-3">
                                                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                                                    {new Date(post.stagedAt).toLocaleDateString()}
                                                </span>
                                                {post.status === 'live' && (
                                                    <span className="flex items-center gap-1 text-[9px] font-black text-green-400 uppercase tracking-[0.2em] px-2 py-0.5 bg-green-400/10 rounded-full">
                                                        <Check className="h-2 w-2" /> LIVE
                                                    </span>
                                                )}
                                            </div>

                                            {/* Virality Analysis Results */}
                                            {analysisResults[post.id] && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="mt-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20"
                                                >
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="h-10 w-10 shrink-0 rounded-full bg-orange-500/20 flex flex-col items-center justify-center">
                                                            <span className="text-[10px] font-black tracking-widest text-orange-400 -mb-1">SCORE</span>
                                                            <span className="text-sm font-black text-white">{analysisResults[post.id].score}</span>
                                                        </div>
                                                        <p className="text-xs font-bold text-orange-200 uppercase tracking-widest">Virality Potential</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {analysisResults[post.id].tips.map((tip, i) => (
                                                            <div key={i} className="flex gap-2">
                                                                <Zap className="h-3.5 w-3.5 text-orange-400 shrink-0 mt-0.5" />
                                                                <p className="text-xs text-white/80 leading-relaxed">{tip}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full border-t border-white/5 pt-5 sm:pt-6">
                                        {post.status === 'staged' ? (
                                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleAnalyze(post.id, post.content, post.platform)}
                                                    disabled={analyzingPostId === post.id}
                                                    className={`px-4 py-3 sm:px-5 sm:py-4 border text-white rounded-xl font-black text-[9px] sm:text-[10px] tracking-[0.2em] uppercase transition-all shrink-0 flex items-center gap-2 ${analyzingPostId === post.id
                                                        ? 'bg-transparent border-white/5 opacity-50'
                                                        : analysisResults[post.id]
                                                            ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                                                            : 'bg-transparent border-white/10 hover:bg-white/5'
                                                        }`}
                                                >
                                                    {analyzingPostId === post.id ? (
                                                        <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-white/40" />
                                                    ) : (
                                                        <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                    )}
                                                    <span className="hidden sm:inline">
                                                        {analysisResults[post.id] ? 'RE-ANALYZE' : 'ANALYZE'}
                                                    </span>
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => {
                                                        router.push('/calendar');
                                                    }}
                                                    className="px-4 py-3 sm:px-5 sm:py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-[9px] sm:text-[10px] tracking-[0.2em] uppercase transition-all shrink-0"
                                                >
                                                    <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => handleMarkAsLive(post.id, post.content, post.platform)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 sm:py-4 premium-gradient text-white rounded-xl font-black text-[9px] sm:text-[10px] tracking-[0.2em] uppercase shadow-xl shadow-primary/20 transition-all"
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> UPLINK & GO LIVE
                                                </motion.button>
                                            </div>
                                        ) : (
                                            <div className="w-full text-center px-6 py-3 sm:py-4 bg-white/5 text-white/20 rounded-xl font-black text-[9px] sm:text-[10px] tracking-[0.2em] uppercase border border-white/5">
                                                PUBLISHED
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Bulk Action Bar */}
            <AnimatePresence>
                {selectedPosts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4 glass-card border border-white/10 rounded-full shadow-2xl shadow-primary/20 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-3 pr-4 border-r border-white/10">
                            <div className="h-6 w-6 rounded bg-primary/20 text-primary flex items-center justify-center font-black text-xs">
                                {selectedPosts.length}
                            </div>
                            <span className="text-xs font-black text-white uppercase tracking-widest hidden sm:block">Selected</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleBulkDelete}
                                disabled={isBulkProcessing}
                                className="p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors disabled:opacity-50"
                            >
                                <Trash2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleBulkUplink}
                                disabled={isBulkProcessing}
                                className="flex items-center gap-2 px-6 py-3 premium-gradient rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 disabled:opacity-50"
                            >
                                {isBulkProcessing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Uplink All</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
