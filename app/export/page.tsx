'use client';

import { useState } from 'react';
import { Download, FileText, Table, Copy, Check, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExportPage() {
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'pdf' | 'copy'>('csv');
  const [copied, setCopied] = useState(false);

  const mockContent = [
    { platform: 'Twitter', content: 'Excited to share our latest AI features! 🚀 #AI #Tech', date: '2024-01-15' },
    { platform: 'LinkedIn', content: 'How AI is transforming content creation...', date: '2024-01-16' },
    { platform: 'Instagram', content: 'New product launch! Check it out 📱✨', date: '2024-01-17' }
  ];

  const handleExportCSV = () => {
    const csv = [
      ['Platform', 'Content', 'Date'],
      ...mockContent.map(item => [item.platform, item.content, item.date])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-export.csv';
    a.click();
  };

  const handleExportPDF = () => {
    alert('PDF export would generate a formatted PDF report here');
  };

  const handleCopyAll = () => {
    const text = mockContent.map(item => 
      `${item.platform}:\n${item.content}\n---`
    ).join('\n\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formats = [
    { id: 'csv', label: 'CSV/Excel', desc: 'Spreadsheet', icon: Table },
    { id: 'pdf', label: 'PDF Report', desc: 'Document', icon: FileText },
    { id: 'copy', label: 'Copy Format', desc: 'Clipboard', icon: Copy }
  ];

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="h-10 w-10 sm:h-14 sm:w-14 premium-gradient rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
          <Package className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gradient tracking-tight">Export & Integration</h1>
          <p className="text-white/40 font-medium text-xs sm:text-base hidden sm:block">Export your content in multiple formats</p>
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
            className={`relative p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all ${
              selectedFormat === format.id
                ? 'border-primary/50 bg-primary/10'
                : 'glass-card border-white/5 hover:border-white/10'
            }`}
          >
            {selectedFormat === format.id && (
              <motion.div
                layoutId="selected-format"
                className="absolute inset-0 bg-primary/5 rounded-xl sm:rounded-2xl border-2 border-primary/30"
              />
            )}
            <div className="relative z-10">
              <format.icon className={`h-6 w-6 sm:h-8 sm:w-8 mb-2 sm:mb-3 ${
                selectedFormat === format.id ? 'text-primary' : 'text-white/40'
              }`} />
              <h3 className="text-sm sm:text-lg font-black text-white mb-0.5 sm:mb-1 uppercase tracking-wider">{format.label}</h3>
              <p className="text-xs sm:text-sm text-white/40 font-medium">{format.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border-white/5"
      >
        <h3 className="text-base sm:text-xl font-black text-white mb-3 sm:mb-4 uppercase tracking-wider">Preview</h3>
        <div className="space-y-2 sm:space-y-4">
          {mockContent.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/[0.03] border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-white/[0.06] transition-all"
            >
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm font-black text-primary uppercase tracking-wider">{item.platform}</span>
                <span className="text-[10px] sm:text-xs text-white/40 font-medium">{item.date}</span>
              </div>
              <p className="text-xs sm:text-sm text-white/70 font-medium">{item.content}</p>
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
              Export as {selectedFormat.toUpperCase()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
