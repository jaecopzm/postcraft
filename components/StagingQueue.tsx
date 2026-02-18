import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, Linkedin, Instagram, Facebook, Music, Youtube, Zap, Check, ExternalLink, Trash2, Loader2, Calendar } from 'lucide-react';
import { useAuth } from '../app/contexts/AuthContext';

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
    const [posts, setPosts] = useState<StagedPost[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 premium-gradient rounded-xl flex items-center justify-center">
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white tracking-widest uppercase">Staging Queue</h3>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{stagedCount} POSTS AWAITING DEPLOYMENT</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
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
                                className={`group glass-card rounded-3xl border-white/5 overflow-hidden transition-all ${post.status === 'live' ? 'opacity-50' : 'hover:border-primary/30'}`}
                            >
                                <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl text-white/40">
                                            {getPlatformIcon(post.platform)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white/80 line-clamp-1 max-w-md">{post.content}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">
                                                    {new Date(post.stagedAt).toLocaleDateString()}
                                                </span>
                                                {post.status === 'live' && (
                                                    <span className="flex items-center gap-1 text-[9px] font-black text-green-400 uppercase tracking-[0.2em] px-2 py-0.5 bg-green-400/10 rounded-full">
                                                        <Check className="h-2 w-2" /> LIVE
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        {post.status === 'staged' ? (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleMarkAsLive(post.id, post.content, post.platform)}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 premium-gradient text-white rounded-xl font-black text-[9px] tracking-[0.2em] uppercase shadow-lg shadow-primary/20"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" /> UPLINK & GO LIVE
                                            </motion.button>
                                        ) : (
                                            <div className="px-6 py-3 bg-white/5 text-white/20 rounded-xl font-black text-[9px] tracking-[0.2em] uppercase border border-white/5">
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
        </div>
    );
}
