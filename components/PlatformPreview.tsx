import { Twitter, Linkedin, Instagram, Facebook, Music, Youtube, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface PlatformPreviewProps {
  platform: string;
  content: string;
  characterCount: number;
}

export default function PlatformPreview({ platform, content, characterCount }: PlatformPreviewProps) {
  const [copied, setCopied] = useState(false);

  const getPlatformIcon = () => {
    switch (platform) {
      case 'twitter': return <Twitter className="h-4 w-4 text-white" />;
      case 'linkedin': return <Linkedin className="h-4 w-4 text-white" />;
      case 'instagram': return <Instagram className="h-4 w-4 text-white" />;
      case 'facebook': return <Facebook className="h-4 w-4 text-white" />;
      case 'tiktok': return <Music className="h-4 w-4 text-white" />;
      case 'youtube': return <Youtube className="h-4 w-4 text-white" />;
      default: return null;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                <p className="text-white text-[13px] leading-relaxed line-clamp-6">{content}</p>
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
            <p className="text-white/90 text-[13px] leading-relaxed line-clamp-6">{content}</p>
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
              <p className="text-white/80 text-[12px] leading-relaxed line-clamp-3">{content}</p>
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
              <p className="text-white text-[12px] leading-relaxed line-clamp-3">{content}</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 backdrop-blur-md">
            <p className="text-white/70 text-[13px] leading-relaxed line-clamp-6">{content}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 premium-gradient rounded-lg shadow-lg shadow-primary/20">
            {getPlatformIcon()}
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-white/60">{platform}</h3>
        </div>
        <span className="text-[10px] font-bold text-white/30 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
          {characterCount} CHARS
        </span>
      </div>

      {getPlatformPreview()}

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
          <>
            <Check className="h-3 w-3" />
            COPIED
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            COPY
          </>
        )}
      </motion.button>
    </div>
  );
}
