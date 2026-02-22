'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, Table, Copy, Check, Package, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '../../components/Toast';

interface ExportItem {
  platform: string;
  content: string;
  date: string;
  topic: string;
}

export default function ExportPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'pdf' | 'copy'>('csv');
  const [copied, setCopied] = useState(false);
  const [exportContent, setExportContent] = useState<ExportItem[]>([]);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'year' | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchExportContent();
  }, [user]);

  const fetchExportContent = async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/history', {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      const data = await response.json();
      const history = data.history || [];

      // Flatten history entries into individual platform items
      const items: ExportItem[] = [];
      for (const entry of history) {
        const date = new Date(entry.timestamp).toISOString().split('T')[0];
        if (entry.results && Array.isArray(entry.results)) {
          for (const result of entry.results) {
            items.push({
              platform: result.platform || 'unknown',
              content: result.content || '',
              date,
              topic: entry.topic || '',
            });
          }
        }
      }
      setExportContent(items);
    } catch (error) {
      console.error('Failed to fetch export content:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const filteredContent = exportContent.filter((item) => {
    if (dateRange === 'all') return true;
    const itemDate = new Date(item.date).getTime();
    const now = new Date().getTime();
    switch (dateRange) {
      case '7d': return now - itemDate <= 7 * 24 * 60 * 60 * 1000;
      case '30d': return now - itemDate <= 30 * 24 * 60 * 60 * 1000;
      case 'year': return new Date(item.date).getFullYear() === new Date().getFullYear();
      default: return true;
    }
  });

  const handleExportCSV = () => {
    if (filteredContent.length === 0) return;
    const csv = [
      ['Platform', 'Topic', 'Content', 'Date'],
      ...filteredContent.map(item => [
        item.platform,
        `"${item.topic.replace(/"/g, '""')}"`,
        `"${item.content.replace(/"/g, '""')}"`,
        item.date
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `draftrapid-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast(`Exported ${filteredContent.length} posts as CSV spreadsheet!`, 'success');
  };

  const handleExportPDF = () => {
    if (filteredContent.length === 0) return;
    // Build a printable HTML document
    const html = `
      <!DOCTYPE html>
      <html><head>
        <title>DraftRapid Export</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 40px; color: #1a1a2e; }
          h1 { font-size: 24px; margin-bottom: 4px; }
          .subtitle { color: #888; font-size: 13px; margin-bottom: 32px; }
          .entry { border: 1px solid #e5e5e5; border-radius: 12px; padding: 16px; margin-bottom: 12px; }
          .meta { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .platform { font-weight: 800; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em; color: #EC5800; }
          .topic { font-weight: 700; font-size: 12px; color: #888; }
          .date { font-size: 11px; color: #aaa; }
          .content { font-size: 14px; line-height: 1.6; color: #333; }
        </style>
      </head><body>
        <h1>DraftRapid — Content Export</h1>
        <p class="subtitle">${filteredContent.length} posts • Exported ${new Date().toLocaleDateString()}</p>
        ${filteredContent.map(item => `
          <div class="entry">
            <div class="meta">
              <span class="platform">${item.platform}</span>
              <span class="date">${item.date}</span>
            </div>
            ${item.topic ? `<div class="topic">${item.topic}</div>` : ''}
            <p class="content">${item.content}</p>
          </div>
        `).join('')}
      </body></html>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      win.print();
      toast('Generated PDF Report for printing', 'success');
    }
  };

  const handleCopyAll = () => {
    if (filteredContent.length === 0) return;
    const text = filteredContent.map(item =>
      `--- ${item.platform.toUpperCase()} ---\n${item.topic ? `Topic: ${item.topic}\n` : ''}${item.content}`
    ).join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast(`Copied ${filteredContent.length} posts to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const formats = [
    { id: 'csv', label: 'CSV/Excel', desc: 'Spreadsheet', icon: Table },
    { id: 'pdf', label: 'PDF Report', desc: 'Print-ready', icon: FileText },
    { id: 'copy', label: 'Copy All', desc: 'Clipboard', icon: Copy }
  ];

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-4 border-primary/10 border-t-primary"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="h-10 w-10 sm:h-14 sm:w-14 premium-gradient rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
          <Package className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gradient tracking-tight uppercase">Export <span className="text-foreground">& Integration</span></h1>
          <p className="text-accent/60 font-medium text-sm sm:text-base hidden sm:block">Export your generated content in multiple formats</p>
        </div>
      </div>

      {exportContent.length === 0 ? (
        /* ── Empty State ── */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 sm:py-32 glass-card rounded-2xl border-dashed border-border text-center px-8"
        >
          <div className="h-20 w-20 sm:h-28 sm:w-28 bg-accent/5 rounded-2xl flex items-center justify-center mb-8 relative border border-accent/10">
            <Package className="h-10 w-10 sm:h-14 sm:w-14 text-accent/10" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-[-10px] border border-dashed border-border rounded-full"
            />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mb-3 uppercase">Nothing to Export</h3>
          <p className="text-accent/40 font-medium text-sm max-w-xs leading-relaxed mb-8">
            Generate some content first and it'll be ready to export here.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 premium-gradient rounded-2xl text-white text-xs font-black tracking-widest uppercase shadow-xl shadow-primary/20 hover:scale-105 transition-all group"
          >
            <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            Generate Content
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Stats bar & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-black tracking-widest text-accent/30 uppercase">
              <span>{filteredContent.length} posts ready</span>
              <div className="h-4 w-px bg-accent/10 hidden sm:block" />
              <span>{new Set(filteredContent.map(e => e.platform)).size} platforms</span>
              <div className="h-4 w-px bg-accent/10 hidden sm:block" />
              <span>{new Set(filteredContent.map(e => e.topic)).size} topics</span>
            </div>

            <div className="flex bg-accent/5 border border-border rounded-xl p-1 shrink-0 overflow-x-auto no-scrollbar">
              {[
                { id: '7d', label: '7D' },
                { id: '30d', label: '30D' },
                { id: 'year', label: 'Yr' },
                { id: 'all', label: 'All' }
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setDateRange(range.id as any)}
                  className={`px-3 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-lg transition-all ${dateRange === range.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-accent/30 hover:text-accent hover:bg-accent/5'
                    }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {formats.map((format) => (
              <motion.button
                key={format.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedFormat(format.id as any)}
                className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all ${selectedFormat === format.id
                  ? 'border-accent/40 bg-accent/5'
                  : 'glass-card border-border hover:border-accent/20'
                  }`}
              >
                {selectedFormat === format.id && (
                  <motion.div
                    layoutId="selected-format"
                    className="absolute inset-0 bg-accent/5 rounded-xl sm:rounded-2xl border-2 border-accent/20"
                  />
                )}
                <div className="relative z-10">
                  <format.icon className={`h-6 w-6 sm:h-8 sm:w-8 mb-2 sm:mb-3 ${selectedFormat === format.id ? 'text-accent' : 'text-accent/20'
                    }`} />
                  <h3 className="text-sm sm:text-lg font-black text-foreground mb-0.5 sm:mb-1 uppercase tracking-wider">{format.label}</h3>
                  <p className="text-xs sm:text-sm text-accent/40 font-medium">{format.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border-border"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-xl font-black text-foreground uppercase tracking-wider">Preview</h3>
              <span className="text-[10px] font-black text-accent/20 uppercase tracking-widest">
                Showing {Math.min(filteredContent.length, 10)} of {filteredContent.length}
              </span>
            </div>
            <div className="space-y-2 sm:space-y-4 max-h-[400px] overflow-y-auto no-scrollbar">
              {filteredContent.slice(0, 10).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-accent/5 border border-border rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-white transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs sm:text-sm font-black text-primary uppercase tracking-wider">{item.platform}</span>
                      {item.topic && (
                        <span className="text-[10px] font-bold text-accent/30 uppercase tracking-widest truncate max-w-[150px]">{item.topic}</span>
                      )}
                    </div>
                    <span className="text-[10px] sm:text-xs text-accent/20 font-medium shrink-0">{item.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-accent/60 font-medium line-clamp-2">{item.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (selectedFormat === 'csv') handleExportCSV();
              else if (selectedFormat === 'pdf') handleExportPDF();
              else handleCopyAll();
            }}
            className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 premium-gradient text-white text-xs sm:text-sm font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 transition-all"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="copied"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  Copied to Clipboard!
                </motion.div>
              ) : (
                <motion.div
                  key="export"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                  Export {filteredContent.length} Posts as {selectedFormat.toUpperCase()}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </>
      )}
    </div>
  );
}
