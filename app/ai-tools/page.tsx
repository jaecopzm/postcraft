'use client';

import { useState } from 'react';
import { Hash, Smile, Target, Sparkles, Copy, Check, Zap, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIEnhancementsPage() {
  const [activeTab, setActiveTab] = useState<'hashtags' | 'emojis' | 'cta' | 'reply'>('hashtags');
  const [input, setInput] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hashtagSuggestions = [
    '#ContentMarketing', '#SocialMedia', '#DigitalMarketing', '#Marketing',
    '#ContentCreation', '#SocialMediaMarketing', '#MarketingStrategy', '#ContentStrategy',
    '#Branding', '#BusinessGrowth', '#Entrepreneur', '#SmallBusiness'
  ];

  const emojiSuggestions = [
    '🚀', '💡', '✨', '🎯', '📈', '💪', '🔥', '⚡',
    '👏', '🎉', '💼', '📊', '🌟', '💯', '🏆', '📱'
  ];

  const ctaSuggestions = [
    'Learn more in the comments 👇',
    'Save this for later 📌',
    'Share with someone who needs this 🔄',
    'Double tap if you agree ❤️',
    'Follow for more tips like this ✨',
    'Click the link in bio 🔗',
    'Tag a friend who needs to see this 👥',
    'What do you think? Comment below 💬'
  ];

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      const endpoint = activeTab === 'reply' ? '/api/ai-replies' : '/api/ai-tools';
      const body = activeTab === 'reply'
        ? { comment: input.trim(), tone: 'professional' }
        : {
          type: activeTab,
          input: input.trim()
        };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Failed to generate');
      }

      const data = await response.json();
      setResults(data.results || data.replies || []);
    } catch (error) {
      console.error('Generation failed:', error);
      // Fallback to mock data
      if (activeTab === 'hashtags') {
        setResults(hashtagSuggestions.slice(0, 10));
      } else if (activeTab === 'emojis') {
        setResults(emojiSuggestions);
      } else if (activeTab === 'cta') {
        setResults(ctaSuggestions);
      } else {
        setResults(['Thank you so much for the feedback! 🙌', 'Glad you found this helpful! 🚀', 'Interesting perspective, thanks for sharing.']);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="h-10 w-10 sm:h-14 sm:w-14 premium-gradient rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
          <Zap className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gradient tracking-tight uppercase">AI <span className="text-foreground">Enhancements</span></h1>
          <p className="text-accent/40 font-medium text-xs sm:text-base hidden sm:block">Smart suggestions to boost your content</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-1 glass-card rounded-xl sm:rounded-2xl flex items-center gap-1 overflow-x-auto hide-scrollbar">
        {[
          { id: 'hashtags', label: 'Hashtags', icon: Hash },
          { id: 'emojis', label: 'Emojis', icon: Smile },
          { id: 'cta', label: 'CTA', icon: Target },
          { id: 'reply', label: 'Auto-Reply', icon: MessageSquare }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black tracking-wider transition-all ${activeTab === tab.id ? 'text-white' : 'text-accent/30 hover:text-accent hover:bg-accent/5'
              }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tool-tab"
                className="absolute inset-0 premium-gradient rounded-lg sm:rounded-xl shadow-lg shadow-primary/20"
              />
            )}
            <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 relative z-10" />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border-border"
      >
        <label className="block text-[10px] sm:text-xs font-black text-accent/30 uppercase tracking-widest mb-2 sm:mb-3">
          {activeTab === 'hashtags' && 'Enter your topic or keywords'}
          {activeTab === 'emojis' && 'Describe your content mood'}
          {activeTab === 'cta' && 'What action do you want?'}
          {activeTab === 'reply' && 'Paste the comment you want to reply to'}
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder={
            activeTab === 'hashtags' ? 'e.g., social media marketing' :
              activeTab === 'emojis' ? 'e.g., exciting product launch' :
                activeTab === 'cta' ? 'e.g., get more engagement' :
                  'e.g., "Love this post! How do I start?"'
          }
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-accent/5 border border-border rounded-xl focus:ring-4 focus:ring-accent/5 focus:border-accent/40 text-foreground text-sm sm:text-base placeholder-accent/20 mb-3 sm:mb-4 outline-none transition-all"
        />
        <button
          onClick={handleGenerate}
          disabled={!input.trim() || loading}
          className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 premium-gradient text-white text-xs sm:text-sm font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full"
              />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
              Generate Suggestions
            </>
          )}
        </button>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border-border"
          >
            <h3 className="text-base sm:text-xl font-black text-foreground mb-3 sm:mb-4 uppercase tracking-wider">Suggestions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {results.map((item, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => copyToClipboard(item)}
                  className="flex items-center justify-between gap-2 p-2.5 sm:p-3 bg-accent/5 border border-border hover:border-accent/30 hover:bg-white rounded-lg sm:rounded-xl transition-all group"
                >
                  <span className="text-accent/60 group-hover:text-foreground text-xs sm:text-sm font-medium truncate">
                    {item}
                  </span>
                  {copied === item ? (
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent/20 group-hover:text-accent flex-shrink-0" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
