'use client';

import { useState, useEffect } from 'react';
import {
  Library, Folder, Tag, Search, Star, Trash2, FolderPlus,
  Copy, Check, Sparkles, ChevronDown, ChevronUp, ArrowRight, BookOpen
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../../components/Toast';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LibrarySkeleton } from '../../components/Skeleton';
import Link from 'next/link';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  platform: string;
  folder: string;
  tags: string[];
  isFavorite: boolean;
  isEvergreen: boolean;
  createdAt: string;
}

const PLATFORM_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  twitter: { bg: 'rgba(255,255,255,0.07)', text: '#ffffff', border: 'rgba(255,255,255,0.15)' },
  linkedin: { bg: 'rgba(10,102,194,0.15)', text: '#60a5fa', border: 'rgba(10,102,194,0.3)' },
  instagram: { bg: 'rgba(225,48,108,0.15)', text: '#f472b6', border: 'rgba(225,48,108,0.3)' },
  facebook: { bg: 'rgba(24,119,242,0.15)', text: '#60a5fa', border: 'rgba(24,119,242,0.3)' },
  tiktok: { bg: 'rgba(0,242,234,0.1)', text: '#22d3ee', border: 'rgba(0,242,234,0.2)' },
  youtube: { bg: 'rgba(255,0,0,0.1)', text: '#f87171', border: 'rgba(255,0,0,0.2)' },
};

function PlatformBadge({ platform }: { platform: string }) {
  const key = platform.toLowerCase();
  const style = PLATFORM_STYLES[key] || { bg: 'rgba(255,255,255,0.05)', text: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.1)' };
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
      style={{ background: style.bg, color: style.text, borderColor: style.border }}
    >
      {platform}
    </span>
  );
}

function ContentCard({ item, onToggleFavorite, onDelete }: {
  item: ContentItem;
  onToggleFavorite: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(item.content);
    setCopied(true);
    toast('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const isLong = item.content.length > 180;
  const displayText = isLong && !expanded ? item.content.slice(0, 180) + '…' : item.content;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ scale: 1.005 }}
      className="group relative glass-card rounded-2xl sm:rounded-2xl p-5 sm:p-8 border-border hover:border-accent/20 transition-all overflow-hidden"
    >
      {/* Subtle hover glow */}
      <div className="absolute top-0 right-0 w-48 h-48 blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-primary pointer-events-none" />

      {/* Top row: title + actions */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-black text-foreground tracking-tight truncate">{item.title}</h3>
            {item.isEvergreen && (
              <span className="px-2 py-0.5 bg-green-500/15 text-green-400 text-[9px] font-black rounded-full border border-green-500/25 uppercase tracking-widest">
                Evergreen
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <PlatformBadge platform={item.platform} />
            {item.folder && item.folder !== 'Uncategorized' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/10 bg-accent/5 text-accent/40">
                <Folder className="h-2.5 w-2.5" />
                {item.folder}
              </span>
            )}
            {item.tags.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onToggleFavorite(item.id, item.isFavorite)}
            className={`p-2 rounded-xl border transition-all ${item.isFavorite
              ? 'bg-accent/10 border-accent/30 text-accent shadow-[0_0_15px_rgba(255,200,0,0.1)]'
              : 'bg-white border-border text-accent/20 hover:text-accent hover:border-accent/30'
              }`}
            title={item.isFavorite ? 'Unfavorite' : 'Favorite'}
          >
            <Star className={`h-4 w-4 ${item.isFavorite ? 'fill-accent' : ''}`} />
          </button>
          <button
            onClick={handleCopy}
            className={`p-2 rounded-xl border transition-all ${copied
              ? 'bg-green-500/15 border-green-500/30 text-green-400'
              : 'bg-white border-border text-accent/20 hover:text-accent hover:border-accent/30'
              }`}
            title="Copy content"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setConfirmDelete(!confirmDelete)}
            className={`p-2 rounded-xl border transition-all ${confirmDelete
              ? 'bg-red-500/15 border-red-500/30 text-red-400'
              : 'bg-white border-border text-accent/20 hover:text-red-400 hover:border-red-500/20'
              }`}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content preview */}
      <p className="text-sm text-accent/60 leading-relaxed font-medium mb-2">{displayText}</p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[10px] font-black tracking-widest text-primary uppercase hover:text-primary/80 transition-colors mb-3"
        >
          {expanded ? <><ChevronUp className="h-3 w-3" /> Show Less</> : <><ChevronDown className="h-3 w-3" /> Read More</>}
        </button>
      )}

      {/* Footer: date + inline delete confirm */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-[10px] font-bold text-accent/20 uppercase tracking-widest">
          {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <AnimatePresence>
          {confirmDelete && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2"
            >
              <span className="text-[10px] text-red-400 font-black uppercase tracking-widest">Delete?</span>
              <button
                onClick={() => onDelete(item.id)}
                className="px-3 py-1.5 bg-red-500 text-white text-[10px] font-black tracking-widest uppercase rounded-xl hover:bg-red-400 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1.5 bg-accent/5 text-accent/40 text-[10px] font-black tracking-widest uppercase rounded-xl hover:bg-accent/10 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function LibraryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/signin');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchContent();
  }, [user]);

  const fetchContent = async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/library', { headers: { 'Authorization': `Bearer ${idToken}` } });
      const data = await response.json();
      setContent(data.content || []);
    } catch (error) {
      console.error('Failed to fetch content:', error);
      toast('Failed to load library', 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      await fetch('/api/library', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
        body: JSON.stringify({ id, isFavorite: !current })
      });
      setContent(prev => prev.map(item => item.id === id ? { ...item, isFavorite: !current } : item));
      toast(current ? 'Removed from favorites' : 'Added to favorites ♥');
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast('Failed to update', 'error');
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      await fetch(`/api/library?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      setContent(prev => prev.filter(item => item.id !== id));
      toast('Item deleted from library');
    } catch (error) {
      console.error('Failed to delete:', error);
      toast('Failed to delete item', 'error');
    }
  };

  const folders = Array.from(new Set(content.map(c => c.folder))).filter(Boolean);
  const tags = Array.from(new Set(content.flatMap(c => c.tags))).filter(Boolean);

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || item.folder === selectedFolder;
    const matchesTag = !selectedTag || item.tags.includes(selectedTag);
    return matchesSearch && matchesFolder && matchesTag;
  });

  const folderCount = (folder: string) => content.filter(c => c.folder === folder).length;

  if (loading || authLoading) {
    return <LibrarySkeleton />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto max-w-7xl space-y-8 sm:space-y-12"
    >
      {/* ── Cinematic Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="h-14 w-14 sm:h-20 sm:w-20 premium-gradient rounded-2xl sm:rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 shrink-0 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <Library className="h-7 w-7 sm:h-10 sm:w-10 text-white relative z-10" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-2">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-primary">Content Vault</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tighter uppercase">
              Your <span className="text-gradient">Library</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-black tracking-widest text-accent/30 uppercase">
          <span>{content.length} items saved</span>
          {content.filter(c => c.isFavorite).length > 0 && (
            <>
              <div className="h-4 w-px bg-accent/10" />
              <span className="text-accent">{content.filter(c => c.isFavorite).length} favorites</span>
            </>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-6 lg:gap-8">

        {/* ── Sidebar ── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-3 flex flex-row lg:flex-col gap-4 overflow-x-auto no-scrollbar lg:overflow-visible pb-1 lg:pb-0"
        >
          {/* Folders panel */}
          <div className="glass-card rounded-2xl p-5 border-border shrink-0 lg:shrink w-64 sm:w-72 lg:w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black text-accent/20 uppercase tracking-[0.3em]">Folders</h3>
              <button
                onClick={() => setShowNewFolder(!showNewFolder)}
                className="p-1.5 hover:bg-accent/5 rounded-lg text-accent/20 hover:text-accent transition-all"
                title="New folder"
              >
                <FolderPlus className="h-4 w-4" />
              </button>
            </div>

            <AnimatePresence>
              {showNewFolder && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-3 overflow-hidden"
                >
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                    placeholder="Folder name..."
                    autoFocus
                    className="w-full px-3 py-2.5 bg-accent/5 border border-border rounded-xl text-sm text-foreground placeholder-accent/20 mb-2 focus:outline-none focus:border-accent/40 transition-all"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowNewFolder(false); setNewFolderName(''); }}
                      className="flex-1 py-2 premium-gradient text-white text-[10px] font-black tracking-widest uppercase rounded-xl"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => { setShowNewFolder(false); setNewFolderName(''); }}
                      className="flex-1 py-2 bg-accent/5 text-accent/40 text-[10px] font-black tracking-widest uppercase rounded-xl hover:bg-accent/10 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              {/* All */}
              <button
                onClick={() => setSelectedFolder('all')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedFolder === 'all'
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-accent/30 hover:text-accent hover:bg-accent/5'
                  }`}
              >
                <span className="flex items-center gap-2.5">
                  <Folder className="h-4 w-4" />
                  All Content
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${selectedFolder === 'all' ? 'bg-accent/20 text-accent' : 'bg-accent/5 text-accent/20'}`}>
                  {content.length}
                </span>
              </button>

              {folders.map(folder => (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedFolder === folder
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'text-accent/30 hover:text-accent hover:bg-accent/5'
                    }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Folder className="h-4 w-4 shrink-0" />
                    <span className="truncate">{folder}</span>
                  </span>
                  <span className={`shrink-0 text-[10px] font-black px-2 py-0.5 rounded-md ${selectedFolder === folder ? 'bg-accent/20 text-accent' : 'bg-accent/5 text-accent/20'}`}>
                    {folderCount(folder)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags panel */}
          {tags.length > 0 && (
            <div className="glass-card rounded-2xl p-5 border-border shrink-0 lg:shrink w-64 sm:w-72 lg:w-full">
              <h3 className="text-[10px] font-black text-accent/20 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <Tag className="h-3 w-3" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedTag === tag
                      ? 'bg-accent/15 text-accent border-accent/30'
                      : 'bg-accent/5 text-accent/30 border-border hover:text-accent hover:border-accent/30'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Main Content ── */}
        <div className="col-span-12 lg:col-span-9 space-y-6">

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative group"
          >
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title or content..."
              className="w-full pl-12 pr-5 py-4 bg-accent/5 border border-border rounded-2xl text-foreground placeholder-accent/20 text-sm font-medium focus:outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/5 transition-all"
            />
            {searchQuery && (
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-accent/20 uppercase tracking-widest">
                {filteredContent.length} results
              </span>
            )}
          </motion.div>

          {/* Content list */}
          <AnimatePresence mode="popLayout">
            {filteredContent.length > 0 ? (
              <motion.div className="space-y-4">
                {filteredContent.map(item => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    onToggleFavorite={toggleFavorite}
                    onDelete={deleteItem}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 sm:py-32 glass-card rounded-2xl border-dashed border-border text-center px-8"
              >
                <div className="h-20 w-20 sm:h-28 sm:w-28 bg-accent/5 rounded-2xl flex items-center justify-center mb-8 relative border border-accent/10">
                  <BookOpen className="h-10 w-10 sm:h-14 sm:w-14 text-accent/10" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-[-10px] border border-dashed border-border rounded-full"
                  />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mb-3">
                  {searchQuery || selectedTag || selectedFolder !== 'all'
                    ? 'No matches found'
                    : 'Library is empty'}
                </h3>
                <p className="text-accent/40 font-medium text-sm max-w-xs leading-relaxed mb-8">
                  {searchQuery || selectedTag || selectedFolder !== 'all'
                    ? 'Try adjusting your filters or search query.'
                    : 'Save standout posts here from your generated content or history.'}
                </p>
                {!searchQuery && !selectedTag && selectedFolder === 'all' && (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-3 px-8 py-4 premium-gradient rounded-2xl text-white text-xs font-black tracking-widest uppercase shadow-xl shadow-primary/20 hover:scale-105 transition-all group"
                  >
                    <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                    Generate Content
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
