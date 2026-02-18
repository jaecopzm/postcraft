'use client';

import { useState } from 'react';
import { Twitter, Linkedin, Instagram, Facebook, Music, Youtube, ChevronLeft, ChevronRight, Copy, Check, Edit2, ExternalLink, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import PostEditor from './PostEditor';

interface PlatformPreviewWithVariationsProps {
  platform: string;
  variations: Array<{
    content: string;
    characterCount: number;
    withinLimit: boolean;
  }>;
  onUpdate?: (index: number, newContent: string) => void;
  onStage?: (content: string) => void;
}

export default function PlatformPreviewWithVariations({ platform, variations, onUpdate, onStage }: PlatformPreviewWithVariationsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const current = variations[currentIndex];

  const handleUplink = () => {
    const text = encodeURIComponent(current.content);
    let url = '';

    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${text}`;
    } else if (platform === 'linkedin') {
      url = `https://www.linkedin.com/feed/?shareActive=true&text=${text}`;
    }

    if (url) {
      window.open(url, '_blank');
    }
  };

  const getPlatformIcon = () => {
    switch (platform) {
      case 'twitter': return <Twitter className="h-5 w-5 text-white" />;
      case 'linkedin': return <Linkedin className="h-5 w-5 text-white" />;
      case 'instagram': return <Instagram className="h-5 w-5 text-white" />;
      case 'facebook': return <Facebook className="h-5 w-5 text-white" />;
      case 'tiktok': return <Music className="h-5 w-5 text-white" />;
      case 'youtube': return <Youtube className="h-5 w-5 text-white" />;
      default: return null;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlatformPreview = (content: string) => {
    switch (platform) {
      case 'twitter':
        return (
          <div className="bg-[#000] border border-white/10 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-full flex-shrink-0 border border-white/10"></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-[15px]">Premium User</span>
                  <span className="text-white/40 text-[14px]">@handle · now</span>
                </div>
                <p className="text-white text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
              </div>
            </div>
          </div>
        );

      case 'linkedin':
        return (
          <div className="bg-[#1B1B1F] border border-white/5 rounded-xl p-6 shadow-2xl">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-14 h-14 bg-white/5 rounded-lg flex-shrink-0 border border-white/10"></div>
              <div className="py-1">
                <div className="font-bold text-white text-[16px]">Professional Profile</div>
                <div className="text-white/40 text-[13px] font-medium">Visionary Founder | Tech Specialist</div>
              </div>
            </div>
            <p className="text-white/90 text-[15px] leading-[1.6] whitespace-pre-wrap">{content}</p>
          </div>
        );

      case 'instagram':
        return (
          <div className="bg-[#000] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-3 p-4 border-b border-white/5">
              <div className="w-9 h-9 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-full p-[2px]">
                <div className="w-full h-full rounded-full bg-black border-2 border-black"></div>
              </div>
              <span className="font-bold text-white text-[14px]">creative_mind</span>
            </div>
            <div className="aspect-square bg-white/5 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50" />
              <span className="text-white/20 text-sm font-black uppercase tracking-[0.3em]">Visual Preview</span>
            </div>
            <div className="p-4">
              <p className="text-white/90 text-[14px] leading-relaxed line-clamp-4">{content}</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <p className="text-white/80 text-[15px] leading-relaxed whitespace-pre-wrap font-medium">{content}</p>
          </div>
        );
    }
  };

  if (isEditing) {
    return (
      <PostEditor
        initialContent={current.content}
        platform={platform}
        onSave={(newContent) => {
          onUpdate?.(currentIndex, newContent);
          setIsEditing(false);
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="p-3 premium-gradient rounded-xl shadow-lg shadow-primary/20"
          >
            {getPlatformIcon()}
          </motion.div>
          <h3 className="text-xl font-black uppercase tracking-widest text-white">{platform}</h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
            {current.characterCount} <span className="text-white/20">CHARS</span>
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="ml-2 p-1 hover:bg-white/10 rounded-lg text-white/30 hover:text-white transition-all group/edit"
            title="Edit variation"
          >
            <Edit2 className="h-3 w-3 group-hover/edit:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {getPlatformPreview(current.content)}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-4">
        {/* Variation Navigation */}
        {variations.length > 1 && (
          <div className="flex items-center justify-between bg-white/5 rounded-2xl p-2 border border-white/5">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="p-3 rounded-xl hover:bg-white/5 disabled:opacity-20 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex gap-2">
              {variations.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-primary shadow-[0_0_10px_rgba(236,88,0,0.5)]' : 'w-1.5 bg-white/10'
                    }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentIndex(Math.min(variations.length - 1, currentIndex + 1))}
              disabled={currentIndex === variations.length - 1}
              className="p-3 rounded-xl hover:bg-white/5 disabled:opacity-20 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={copyToClipboard}
            className={`
              flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all
              ${copied
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20 hover:text-white'
              }
            `}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'COPIED' : 'COPY'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStage?.(current.content)}
            className="flex items-center justify-center gap-3 py-4 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all hover:bg-primary/20"
          >
            <Zap className="h-4 w-4" />
            STAGE
          </motion.button>
        </div>

        {(platform === 'twitter' || platform === 'linkedin') && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUplink}
            className="w-full flex items-center justify-center gap-3 py-4 premium-gradient text-white rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase shadow-xl shadow-primary/20"
          >
            <ExternalLink className="h-4 w-4" />
            DIRECT UPLINK TO {platform === 'twitter' ? 'X' : 'LINKEDIN'}
          </motion.button>
        )}
      </div>
    </div>
  );
}
