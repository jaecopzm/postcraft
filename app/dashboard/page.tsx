'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Target, Zap, Sparkles, TrendingUp, Clock, CheckCircle2, Palette, ChevronDown, X } from 'lucide-react';
import { XIcon, LinkedInIcon, InstagramIcon, FacebookIcon, TikTokIcon, YouTubeIcon } from '../../components/SocialIcons';
import { useRouter } from 'next/navigation';
import PlatformPreviewWithVariations from '../../components/PlatformPreviewWithVariations';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useToast } from '../../components/Toast';
import { DashboardSkeleton } from '../../components/Skeleton';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isPro] = useState(false); // TODO: Connect to actual subscription
  const [topic, setTopic] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter', 'linkedin']);
  const [tone, setTone] = useState('professional');
  const [variationCount, setVariationCount] = useState(3);
  const [results, setResults] = useState<any[]>([]);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [isCampaignMode, setIsCampaignMode] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [staging, setStaging] = useState<string | null>(null);
  const [voiceDropdownOpen, setVoiceDropdownOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Generated', value: '...', icon: Sparkles, color: 'text-primary' },
    { label: 'This Month', value: '...', icon: TrendingUp, color: 'text-accent' },
    { label: 'Avg. Time', value: '8s', icon: Clock, color: 'text-accent/60' }
  ]);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
      // Check if user has dismissed onboarding before
      const dismissed = localStorage.getItem('dr_onboarding_dismissed');
      if (dismissed) setShowOnboarding(false);
    }
  }, [user]);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('dr_onboarding_dismissed', '1');
  };

  const fetchAnalytics = async () => {
    try {
      const idToken = await user!.getIdToken();

      // Fetch stats
      const respStats = await fetch('/api/analytics', { headers: { 'Authorization': `Bearer ${idToken}` } });
      if (respStats.ok) {
        const data = await respStats.json();
        setStats([
          { label: 'Generated', value: data.totalGenerations?.toString() || '0', icon: Sparkles, color: 'text-primary' },
          { label: 'This Month', value: data.monthTotal?.toString() || '0', icon: TrendingUp, color: 'text-accent' },
          { label: 'Avg. Time', value: `${data.avgTime || 8}s`, icon: Clock, color: 'text-accent/60' }
        ]);
      }

      // Fetch voices
      const respVoices = await fetch('/api/brand-voices', { headers: { 'Authorization': `Bearer ${idToken}` } });
      if (respVoices.ok) {
        const data = await respVoices.json();
        if (data.voices && data.voices.length > 0) {
          setVoices(data.voices);
          const def = data.voices.find((v: any) => v.isDefault);
          if (def) {
            setSelectedVoiceId(def.id);
            setTone(def.tone || 'professional');
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    }
  }, [user, loading, router]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  const platforms = [
    { id: 'twitter', name: 'Twitter/X', icon: XIcon },
    { id: 'linkedin', name: 'LinkedIn', icon: LinkedInIcon },
    { id: 'instagram', name: 'Instagram', icon: InstagramIcon },
    { id: 'facebook', name: 'Facebook', icon: FacebookIcon },
    { id: 'tiktok', name: 'TikTok', icon: TikTokIcon },
    { id: 'youtube', name: 'YouTube', icon: YouTubeIcon }
  ];

  const tones = [
    { value: 'professional', label: 'Professional', icon: Target },
    { value: 'casual', label: 'Casual', icon: Sparkles },
    { value: 'enthusiastic', label: 'Enthusiastic', icon: Zap },
    { value: 'informative', label: 'Informative', icon: TrendingUp }
  ];

  const handleGenerate = async () => {
    if (!topic.trim() || !user) return;

    setGenerating(true);
    setHistoryId(null);
    try {
      // Get the ID token from the user
      const idToken = await user.getIdToken();

      const selectedVoice = voices.find(v => v.id === selectedVoiceId);
      const activeTone = selectedVoice ? selectedVoice.tone : tone;
      const brandGuide = selectedVoice ? selectedVoice.brandGuide : undefined;

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          topic,
          platforms: selectedPlatforms,
          tone: activeTone,
          brandGuide: brandGuide,
          variationCount: isPro ? variationCount : 3,
          isCampaignMode // Pass mode
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
      className="space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gradient mb-1 sm:mb-2">Create Magic</h1>
          <p className="text-accent/60 font-medium text-sm sm:text-base">Power up your social presence with AI excellence.</p>
        </div>
        {/* Stats — scrollable on mobile */}
        <div className="flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center px-3 sm:px-5 py-2.5 glass-card rounded-xl shrink-0">
              <span className="text-[9px] sm:text-[10px] font-bold text-accent/40 uppercase tracking-widest mb-1">{stat.label}</span>
              <span className={`text-lg sm:text-xl font-black ${stat.color}`}>{stat.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Onboarding nudge ── */}
      <AnimatePresence>
        {showOnboarding && voices.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="glass-card rounded-xl border border-primary/20 p-3 sm:p-4 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent pointer-events-none" />
            <button
              onClick={dismissOnboarding}
              className="absolute top-2 right-2 p-1.5 text-accent/40 hover:text-accent transition-colors rounded-lg hover:bg-accent/5 z-10"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-start gap-2.5 sm:gap-3 pr-7 relative">
              <div className="h-8 w-8 shrink-0 premium-gradient rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <Palette className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-black text-foreground mb-0.5">Set up your Brand Voice</p>
                <p className="text-[11px] text-accent/60 font-medium mb-2 sm:mb-3">Configure your tone and style.</p>
                <Link
                  href="/brand-voice"
                  className="inline-block px-4 py-2 premium-gradient rounded-lg text-white text-[9px] font-black tracking-widest uppercase shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
                  Configure
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generation Form */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl p-4 sm:p-6 relative overflow-hidden">
        {/* Subtle inner glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/[0.04] blur-[60px] -mr-24 -mt-24" />

        <div className="relative z-10 space-y-5 sm:space-y-6">

          {/* Mode Toggle */}
          <div className="flex items-center justify-center p-1 bg-accent/5 rounded-xl w-full sm:w-fit mx-auto border border-border">
            <button
              onClick={() => setIsCampaignMode(false)}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${!isCampaignMode ? 'bg-white text-foreground shadow-sm' : 'text-accent/40 hover:text-accent'}`}
            >
              Single Post
            </button>
            <button
              onClick={() => setIsCampaignMode(true)}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${isCampaignMode ? 'premium-gradient text-white shadow-md shadow-primary/20' : 'text-accent/40 hover:text-accent'}`}
            >
              Drip Campaign
            </button>
          </div>

          {/* Topic Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black text-accent/40 uppercase tracking-[0.2em] ml-1">
              <Zap className="h-3 w-3 text-primary" /> {isCampaignMode ? 'Campaign Objective' : 'Content Topic'}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What's on your mind today?"
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-accent/5 border border-border rounded-xl focus:ring-4 focus:ring-accent/10 focus:border-accent/40 text-foreground text-base sm:text-lg font-medium placeholder-accent/20 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Platforms */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Distribution channels</label>
              <div className="grid grid-cols-3 gap-2">
                {platforms.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id);
                  const IconComponent = platform.icon;
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
                      className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${isSelected
                        ? 'border-accent bg-accent/10 shadow-sm'
                        : 'border-border bg-accent/5 hover:border-accent/30'
                        }`}
                    >
                      <IconComponent className={`h-5 w-5 mb-1 ${isSelected ? 'text-accent' : 'text-accent/30'}`} />
                      <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-tight sm:tracking-wider ${isSelected ? 'text-foreground' : 'text-accent/30'}`}>
                        {platform.name.split('/')[0]}
                      </span>
                      {isSelected && (
                        <motion.div
                          layoutId="active-platform"
                          className="absolute -top-1 -right-1"
                        >
                          <CheckCircle2 className="h-5 w-5 text-accent bg-background rounded-full" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Tone / Voice Selection */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Brand Voice (Aura)</label>

              {voices.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {/* Custom dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setVoiceDropdownOpen(!voiceDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-accent/5 border border-border rounded-xl text-foreground font-bold hover:border-accent/40 focus:outline-none transition-all"
                    >
                      <span className="text-sm uppercase tracking-wide">
                        {voices.find(v => v.id === selectedVoiceId)?.name || 'Select Voice'}
                      </span>
                      <ChevronDown className={`h-4 w-4 text-accent/40 transition-transform ${voiceDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {voiceDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute z-50 mt-2 w-full bg-white/95 backdrop-blur-xl border border-border rounded-xl shadow-xl overflow-hidden"
                        >
                          {voices.map(v => (
                            <button
                              key={v.id}
                              onClick={() => { setSelectedVoiceId(v.id); setTone(v.tone || 'professional'); setVoiceDropdownOpen(false); }}
                              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-wide hover:bg-accent/5 transition-colors text-left ${v.id === selectedVoiceId ? 'text-accent' : 'text-accent/60 hover:text-foreground'
                                }`}
                            >
                              <span>{v.name}</span>
                              {v.id === selectedVoiceId && <CheckCircle2 className="h-4 w-4 text-accent" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {voices.find(v => v.id === selectedVoiceId)?.brandGuide && (
                    <div className="flex items-center gap-2 mt-1 px-2">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span className="text-[10px] text-primary/80 font-bold uppercase tracking-widest">Brand Guide Active</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {tones.map((t) => {
                    const IconComponent = t.icon;
                    return (
                      <motion.button
                        key={t.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTone(t.value)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all duration-300 ${tone === t.value
                          ? 'border-accent bg-accent/10'
                          : 'border-border bg-accent/5 hover:border-accent/30'
                          }`}
                      >
                        <IconComponent className={`h-4 w-4 shrink-0 ${tone === t.value ? 'text-accent' : 'text-accent/30'}`} />
                        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-tight sm:tracking-widest truncate ${tone === t.value ? 'text-foreground' : 'text-accent/30'}`}>
                          {t.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Variations Count (Pro Feature) */}
          {isPro && (
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-3">
                Number of variations
                <span className="ml-2 px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full">PRO</span>
              </label>
              <div className="flex gap-2">
                {[3, 5, 7, 10].map((count) => (
                  <button
                    key={count}
                    onClick={() => setVariationCount(count)}
                    className={`px-4 py-2 border rounded-xl transition-all ${variationCount === count
                      ? 'border-accent bg-accent/5 text-foreground'
                      : 'border-border bg-white text-accent/30 hover:border-accent/30'
                      }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="space-y-2">
            <motion.button
              whileHover={(!generating && !!topic.trim() && selectedPlatforms.length > 0) ? { scale: 1.01, boxShadow: "0 20px 40px rgba(232, 89, 12, 0.25)" } : {}}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={generating || !topic.trim() || selectedPlatforms.length === 0}
              className="w-full relative group premium-button premium-gradient rounded-xl sm:rounded-2xl py-3 sm:py-5 px-4 sm:px-8 text-white font-black text-sm sm:text-lg tracking-wider sm:tracking-widest shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                {generating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    CRAFTING...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 sm:h-6 sm:w-6" />
                    GENERATE UNIVERSE
                  </>
                )}
              </span>
            </motion.button>
            {/* Inline hint when button is disabled */}
            <AnimatePresence>
              {!generating && (!topic.trim() || selectedPlatforms.length === 0) && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="text-center text-[11px] text-gray-300 font-bold tracking-widest uppercase"
                >
                  {!topic.trim() && selectedPlatforms.length === 0
                    ? 'Add a topic and select at least one platform'
                    : !topic.trim()
                      ? '← Add a topic to activate'
                      : 'Select at least one platform →'}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5 sm:space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 shrink-0">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight uppercase">Platform Previews</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {results.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-2xl p-3 sm:p-5 hover:border-gray-300 transition-colors"
                >
                  <PlatformPreviewWithVariations
                    platform={result.platform}
                    variations={result.variations}
                    isCampaignMode={isCampaignMode}
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
                        <div className="bg-accent text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg shadow-accent/20 uppercase tracking-widest">
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
