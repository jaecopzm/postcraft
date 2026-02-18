'use client';

import { useState } from 'react';
import { Hash, Smile, Target, Sparkles, Copy, Check } from 'lucide-react';

export default function AIEnhancementsPage() {
  const [activeTab, setActiveTab] = useState<'hashtags' | 'emojis' | 'cta'>('hashtags');
  const [input, setInput] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

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

    setResults([]);

    try {
      const response = await fetch('/api/ai-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab === 'hashtags' ? 'hashtags' : activeTab === 'cta' ? 'cta' : 'hashtags',
          input: input.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate');
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Generation failed:', error);
      // Fallback to mock data
      if (activeTab === 'hashtags') {
        setResults(hashtagSuggestions.slice(0, 10));
      } else if (activeTab === 'emojis') {
        setResults(emojiSuggestions);
      } else {
        setResults(ctaSuggestions);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cool-blue to-white bg-clip-text text-transparent mb-2">
          AI Enhancements
        </h1>
        <p className="text-cool-blue/60">Smart suggestions to boost your content</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('hashtags')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'hashtags'
              ? 'text-white shadow-lg'
              : 'bg-[#22222A] border border-cool-blue/10 text-cool-blue/70 hover:text-cool-blue'
            }`}
          style={activeTab === 'hashtags' ? {
            background: 'linear-gradient(to right, #0EA5E9, rgba(14, 165, 233, 0.8))',
            boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.2)'
          } : {}}
        >
          <Hash className="h-5 w-5" />
          Hashtags
        </button>
        <button
          onClick={() => setActiveTab('emojis')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'emojis'
              ? 'text-white shadow-lg'
              : 'bg-[#22222A] border border-cool-blue/10 text-cool-blue/70 hover:text-cool-blue'
            }`}
          style={activeTab === 'emojis' ? {
            background: 'linear-gradient(to right, #0EA5E9, rgba(14, 165, 233, 0.8))',
            boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.2)'
          } : {}}
        >
          <Smile className="h-5 w-5" />
          Emojis
        </button>
        <button
          onClick={() => setActiveTab('cta')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'cta'
              ? 'text-white shadow-lg'
              : 'bg-[#22222A] border border-cool-blue/10 text-cool-blue/70 hover:text-cool-blue'
            }`}
          style={activeTab === 'cta' ? {
            background: 'linear-gradient(to right, #0EA5E9, rgba(14, 165, 233, 0.8))',
            boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.2)'
          } : {}}
        >
          <Target className="h-5 w-5" />
          Call-to-Action
        </button>
      </div>

      {/* Input Section */}
      <div className="bg-gradient-to-br from-[#22222A] to-[#1E1E27] border border-cool-blue/10 rounded-2xl p-6 mb-6">
        <label className="block text-sm font-bold text-cool-blue mb-3">
          {activeTab === 'hashtags' && 'Enter your topic or keywords'}
          {activeTab === 'emojis' && 'Describe your content mood'}
          {activeTab === 'cta' && 'What action do you want?'}
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            activeTab === 'hashtags' ? 'e.g., social media marketing' :
              activeTab === 'emojis' ? 'e.g., exciting product launch' :
                'e.g., get more engagement'
          }
          className="w-full px-4 py-3 bg-[#1A1A1F] border border-cool-blue/20 rounded-xl focus:ring-2 focus:border-[#0EA5E9] text-white placeholder-cool-blue/40 mb-4"
        />
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl hover:opacity-90 transition-all"
          style={{
            background: 'linear-gradient(to right, #0EA5E9, rgba(14, 165, 233, 0.8))',
            boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.2)'
          }}
        >
          <Sparkles className="h-5 w-5" />
          Generate Suggestions
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-gradient-to-br from-[#22222A] to-[#1E1E27] border border-cool-blue/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Suggestions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {results.map((item, i) => (
              <button
                key={i}
                onClick={() => copyToClipboard(item)}
                className="flex items-center justify-between gap-2 p-3 bg-[#1A1A1F] border border-cool-blue/10 hover:border-[#0EA5E9] rounded-xl transition-all group"
              >
                <span className="text-cool-blue group-hover:text-white text-sm font-medium truncate">
                  {item}
                </span>
                {copied === item ? (
                  <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                ) : (
                  <Copy className="h-4 w-4 text-cool-blue/60 group-hover:text-[#0EA5E9] flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
