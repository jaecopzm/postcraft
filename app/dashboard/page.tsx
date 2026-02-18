'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Target, Zap, Sparkles, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PlatformPreviewWithVariations from '../../components/PlatformPreviewWithVariations';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isPro] = useState(false); // TODO: Connect to actual subscription
  const [topic, setTopic] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter', 'linkedin']);
  const [tone, setTone] = useState('professional');
  const [variationCount, setVariationCount] = useState(3);
  const [results, setResults] = useState<any[]>([]);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [staging, setStaging] = useState<string | null>(null);
  const [stats, setStats] = useState([
    { label: 'Generated', value: '...', icon: Sparkles, color: 'text-primary' },
    { label: 'This Month', value: '...', icon: TrendingUp, color: 'text-accent' },
    { label: 'Avg. Time', value: '8s', icon: Clock, color: 'text-white' }
  ]);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const idToken = await user!.getIdToken();
      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats([
          { label: 'Generated', value: data.totalGenerations?.toString() || '0', icon: Sparkles, color: 'text-primary' },
          { label: 'This Month', value: data.monthTotal?.toString() || '0', icon: TrendingUp, color: 'text-accent' },
          { label: 'Avg. Time', value: `${data.avgTime || 8}s`, icon: Clock, color: 'text-white' }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading) {
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

  const platforms = [
    { id: 'twitter', name: 'Twitter/X', icon: '𝕏' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'facebook', name: 'Facebook', icon: '👥' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵' },
    { id: 'youtube', name: 'YouTube', icon: '📺' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional', icon: '💼' },
    { value: 'casual', label: 'Casual', icon: '😊' },
    { value: 'enthusiastic', label: 'Enthusiastic', icon: '🚀' },
    { value: 'informative', label: 'Informative', icon: '📚' }
  ];

  const handleGenerate = async () => {
    if (!topic.trim() || !user) return;

    setGenerating(true);
    setHistoryId(null);
    try {
      // Get the ID token from the user
      const idToken = await user.getIdToken();

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          topic,
          platforms: selectedPlatforms,
          tone,
          variationCount: isPro ? variationCount : 3
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();
      setResults(data.results || []);
      setHistoryId(data.historyId);
    } catch (error: any) {
      console.error('Generation failed:', error);
      alert(error.message || 'Generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateVariation = async (platformIndex: number, variationIndex: number, newContent: string) => {
    const newResults = [...results];
    const targetPlatform = newResults[platformIndex];
    targetPlatform.variations[variationIndex].content = newContent;
    targetPlatform.variations[variationIndex].characterCount = newContent.length;
    setResults(newResults);

    if (historyId && user) {
      try {
        const idToken = await user.getIdToken();
        const resultsToSave = newResults.flatMap((r: any) => r.variations.map((v: any) => ({
          platform: r.platform,
          content: v.content,
          characterCount: v.characterCount
        })));

        await fetch('/api/history', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({
            id: historyId,
            results: resultsToSave
          })
        });
      } catch (error) {
        console.error('Failed to auto-save refined content:', error);
      }
    }
  };

  const handleStageVariation = async (platform: string, content: string) => {
    if (!historyId || !user) return;

    setStaging(platform);
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/staging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          historyId,
          platform,
          content
        })
      });

      if (response.ok) {
        // Success feedback
        setTimeout(() => setStaging(null), 2000);
      }
    } catch (error) {
      console.error('Failed to stage variation:', error);
      setStaging(null);
    }
  };

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
        <div>
          <h1 className="text-5xl font-extrabold text-gradient mb-3">Create Magic</h1>
          <p className="text-white/40 font-medium">Power up your social presence with AI excellence.</p>
        </div>
        <div className="flex gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center px-6 py-3 glass-card rounded-2xl border-white/5">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{stat.label}</span>
              <span className={`text-xl font-black ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Generation Form */}
      <motion.div variants={itemVariants} className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden">
        {/* Subtle inner glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -mr-32 -mt-32" />

        <div className="relative z-10 space-y-8">
          {/* Topic Input */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-black text-white/40 uppercase tracking-[0.2em] ml-1">
              <Zap className="h-3 w-3 text-primary" /> Content Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What's on your mind today?"
              className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary/50 text-white text-lg font-medium placeholder-white/20 transition-all outline-none shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Platforms */}
            <div className="space-y-4">
              <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] ml-1">Distribution channels</label>
              <div className="grid grid-cols-3 gap-3">
                {platforms.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id);
                  return (
                    <motion.button
                      key={platform.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.id));
                        } else {
                          setSelectedPlatforms([...selectedPlatforms, platform.id]);
                        }
                      }}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${isSelected
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                        : 'border-white/5 bg-white/5 hover:border-white/20'
                        }`}
                    >
                      <span className="text-xl mb-1">{platform.icon}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-white/40'}`}>
                        {platform.id}
                      </span>
                      {isSelected && (
                        <motion.div
                          layoutId="active-platform"
                          className="absolute -top-1 -right-1"
                        >
                          <CheckCircle2 className="h-5 w-5 text-primary bg-[#0A0A0B] rounded-full" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Tone */}
            <div className="space-y-4">
              <label className="text-xs font-black text-white/40 uppercase tracking-[0.2em] ml-1">Campaign Vibe</label>
              <div className="grid grid-cols-2 gap-3">
                {tones.map((t) => (
                  <motion.button
                    key={t.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setTone(t.value)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${tone === t.value
                      ? 'border-primary bg-primary/10'
                      : 'border-white/5 bg-white/5 hover:border-white/20'
                      }`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <span className={`text-xs font-bold uppercase tracking-widest ${tone === t.value ? 'text-white' : 'text-white/40'}`}>
                      {t.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Variations Count (Pro Feature) */}
          {isPro && (
            <div>
              <label className="block text-sm font-bold text-cool-blue mb-3">
                Number of variations
                <span className="ml-2 px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full">PRO</span>
              </label>
              <div className="flex gap-2">
                {[3, 5, 7, 10].map((count) => (
                  <button
                    key={count}
                    onClick={() => setVariationCount(count)}
                    className={`px-4 py-2 border rounded-xl transition-all ${variationCount === count
                      ? 'border-primary bg-primary/10 text-white'
                      : 'border-cool-blue/20 bg-[#1A1A1F] text-cool-blue/70 hover:border-cool-blue/40'
                      }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.01, boxShadow: "0 20px 40px rgba(236, 88, 0, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={generating || !topic.trim() || selectedPlatforms.length === 0}
            className="w-full relative group premium-button premium-gradient rounded-[1.5rem] py-6 px-8 text-white font-black text-xl tracking-widest shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-4">
              {generating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full"
                  />
                  CRAFTING...
                </>
              ) : (
                <>
                  <Sparkles className="h-7 w-7" />
                  GENERATE UNIVERSE
                </>
              )}
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 premium-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">Platform Previews</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-[2rem] p-8 border-white/5 hover:border-white/10 transition-colors"
                >
                  <PlatformPreviewWithVariations
                    platform={result.platform}
                    variations={result.variations}
                    onUpdate={(varIdx, newContent) => handleUpdateVariation(index, varIdx, newContent)}
                    onStage={(content) => handleStageVariation(result.platform, content)}
                  />

                  <AnimatePresence>
                    {staging === result.platform && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-x-0 -bottom-4 flex justify-center"
                      >
                        <div className="bg-green-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg shadow-green-500/20 uppercase tracking-widest">
                          Staged to Command Center
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
