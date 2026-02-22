'use client';

import { Copy, Check, Zap, X } from 'lucide-react';
import { XIcon, LinkedInIcon, InstagramIcon, FacebookIcon, TikTokIcon, YouTubeIcon } from './SocialIcons';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './Toast';

interface PlatformPreviewProps {
  platform: string;
  content: string;
  characterCount: number;
  initialExpanded?: boolean;
}

export default function PlatformPreview({ platform, content, characterCount, initialExpanded = false }: PlatformPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [expanded, setExpanded] = useState(initialExpanded);
  const [viralityData, setViralityData] = useState<{ score: number; hookQuality: number; tips: string[] } | null>(null);
  const { toast } = useToast();

  const getPlatformIcon = () => {
    switch (platform) {
      case 'twitter': return <XIcon className="h-4 w-4 text-white" />;
      case 'linkedin': return <LinkedInIcon className="h-4 w-4 text-white" />;
      case 'instagram': return <InstagramIcon className="h-4 w-4 text-white" />;
      case 'facebook': return <FacebookIcon className="h-4 w-4 text-white" />;
      case 'tiktok': return <TikTokIcon className="h-4 w-4 text-white" />;
      case 'youtube': return <YouTubeIcon className="h-4 w-4 text-white" />;
      default: return null;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const analyzeVirality = async () => {
    try {
      setAnalyzing(true);
      const res = await fetch('/api/analyze-virality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platform })
      });
      const data = await res.json();
      if (data.success) {
        setViralityData(data.result);
      }
    } catch (e) {
      console.error(e);
      toast('Analysis failed. Try again.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const getPlatformPreview = () => {
    switch (platform) {
      case 'twitter':
        return (
          <div className="bg-[#000] border border-white/5 rounded-xl p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-full flex-shrink-0 border border-white/10"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 truncate">
                  <span className="font-bold text-white text-[13px]">User</span>
                  <span className="text-white/30 text-[13px]">@handle</span>
                </div>
                <p className={`text-white text-[13px] leading-relaxed whitespace-pre-wrap break-words ${!expanded && content.length > 200 ? 'line-clamp-6' : ''}`}>{content}</p>
                {content.length > 200 && (
                  <button onClick={() => setExpanded(!expanded)} className="text-white/30 hover:text-white text-[10px] font-bold mt-1">
                    {expanded ? 'show less' : '... more'}
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 'linkedin':
        return (
          <div className="bg-[#1B1B1F] border border-white/5 rounded-xl p-4 shadow-xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-white/5 rounded flex-shrink-0 border border-white/10"></div>
              <div className="min-w-0">
                <div className="font-bold text-white text-[13px] truncate">Professional Profile</div>
                <div className="text-white/30 text-[11px] truncate">Expert Specialist</div>
              </div>
            </div>
            <p className={`text-white/90 text-[13px] leading-relaxed whitespace-pre-wrap break-words ${!expanded && content.length > 300 ? 'line-clamp-6' : ''}`}>{content}</p>
            {content.length > 300 && (
              <button onClick={() => setExpanded(!expanded)} className="text-white/30 hover:text-white text-[10px] font-bold mt-2">
                {expanded ? 'show less' : '... more'}
              </button>
            )}
          </div>
        );

      case 'instagram':
        return (
          <div className="bg-[#000] border border-white/5 rounded-xl overflow-hidden shadow-xl">
            <div className="flex items-center gap-2 p-3 border-b border-white/5">
              <div className="w-6 h-6 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-full p-[1px]">
                <div className="w-full h-full rounded-full bg-black border-2 border-black"></div>
              </div>
              <span className="font-bold text-white text-[12px]">username</span>
            </div>
            <div className="aspect-square bg-white/5 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-primary/5 blur-sm opacity-50" />
              <span className="text-white/10 text-[10px] font-black tracking-widest uppercase relative z-10">Image</span>
            </div>
            <div className="p-3">
              <p className={`text-white/80 text-[12px] leading-relaxed whitespace-pre-wrap break-words ${!expanded && content.length > 150 ? 'line-clamp-3' : ''}`}>{content}</p>
              {content.length > 150 && (
                <button onClick={() => setExpanded(!expanded)} className="text-white/30 hover:text-white text-[10px] font-bold mt-1">
                  {expanded ? 'show less' : '... more'}
                </button>
              )}
            </div>
          </div>
        );

      case 'tiktok':
        return (
          <div className="bg-[#000] rounded-xl p-4 border border-white/10 relative overflow-hidden aspect-[9/16] min-h-[240px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-white/10 rounded-full border border-white/20"></div>
                <span className="font-bold text-white text-[12px]">@user</span>
              </div>
              <p className={`text-white text-[12px] leading-relaxed whitespace-pre-wrap ${!expanded && content.length > 150 ? 'line-clamp-3' : ''}`}>{content}</p>
              {content.length > 150 && (
                <button onClick={() => setExpanded(!expanded)} className="text-white/40 hover:text-white text-[10px] font-bold mt-1 relative z-30">
                  {expanded ? 'show less' : '... more'}
                </button>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-md">
            <p className={`text-white/70 text-[13px] leading-relaxed whitespace-pre-wrap break-words ${!expanded && content.length > 300 ? 'line-clamp-6' : ''}`}>{content}</p>
            {content.length > 300 && (
              <button onClick={() => setExpanded(!expanded)} className="text-white/30 hover:text-white text-[10px] font-bold mt-2">
                {expanded ? 'show less' : '... more'}
              </button>
            )}
          </div>
        );
    }
  };

  // Virality score color
  const scoreColor = viralityData
    ? viralityData.score >= 70
      ? 'text-green-400'
      : viralityData.score >= 40
        ? 'text-yellow-400'
        : 'text-red-400'
    : 'text-white';

  return (
    <div className="space-y-4">
      {/* ── Header row: platform + char count + score icon ── */}
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="p-1.5 premium-gradient rounded-lg shadow-lg shadow-primary/20 shrink-0">
            {getPlatformIcon()}
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-white/60 truncate">{platform}</h3>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="text-[10px] font-bold text-white/30 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 whitespace-nowrap">
            {characterCount} <span className="hidden sm:inline">CHARS</span>
          </span>
          {/* Virality score trigger — compact icon button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={analyzeVirality}
            disabled={analyzing}
            title="Score this post"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-black text-[10px] tracking-widest uppercase transition-all bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 disabled:opacity-50"
          >
            {analyzing ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="h-3 w-3 border border-primary/30 border-t-primary rounded-full"
              />
            ) : (
              <Zap className="h-3 w-3" />
            )}
            <span className="hidden sm:inline">SCORE</span>
          </motion.button>
        </div>
      </div>

      {getPlatformPreview()}

      {/* ── Copy button (full width) ── */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={copyToClipboard}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all
          ${copied
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white'
          }`}
      >
        {copied ? (
          <><Check className="h-3 w-3" />COPIED</>
        ) : (
          <><Copy className="h-3 w-3" />COPY TO CLIPBOARD</>
        )}
      </motion.button>

      {/* ── Virality score card (dismissible) ── */}
      <AnimatePresence>
        {viralityData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-6">
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Virality</p>
                  <div className="flex items-end gap-1">
                    <span className={`text-2xl font-black ${scoreColor}`}>{viralityData.score}</span>
                    <span className="text-xs text-white/40 mb-0.5">/100</span>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Hook Quality</p>
                  <div className="flex items-end gap-1">
                    <span className="text-xl font-black text-white">{viralityData.hookQuality}</span>
                    <span className="text-xs text-white/40 mb-0.5">/100</span>
                  </div>
                </div>
              </div>
              {/* Dismiss button */}
              <button
                onClick={() => setViralityData(null)}
                className="p-1 text-white/20 hover:text-white/60 transition-colors rounded-lg hover:bg-white/5"
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">AI Suggestions</p>
              {viralityData.tips.map((tip, i) => (
                <p key={i} className="text-xs text-white/70 flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span> {tip}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
