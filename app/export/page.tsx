'use client';

import { useState } from 'react';
import { Download, FileText, Table, Copy, Check } from 'lucide-react';

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

  return (
    <div className="container mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cool-blue to-white bg-clip-text text-transparent mb-2">
          Export & Integration
        </h1>
        <p className="text-cool-blue/60">Export your content in multiple formats</p>
      </div>

      {/* Format Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => setSelectedFormat('csv')}
          className={`p-6 rounded-2xl border transition-all ${
            selectedFormat === 'csv'
              ? 'border-[#0EA5E9] shadow-lg'
              : 'bg-[#22222A] border-cool-blue/10 hover:border-cool-blue/20'
          }`}
          style={selectedFormat === 'csv' ? {
            background: 'linear-gradient(to bottom right, rgba(14, 165, 233, 0.1), rgba(14, 165, 233, 0.05))',
            boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.2)'
          } : {}}
        >
          <Table className="h-8 w-8 mb-3" style={{ color: selectedFormat === 'csv' ? '#0EA5E9' : '#D1EAF0' }} />
          <h3 className="text-lg font-bold text-white mb-1">CSV/Excel</h3>
          <p className="text-sm text-cool-blue/60">Spreadsheet format</p>
        </button>

        <button
          onClick={() => setSelectedFormat('pdf')}
          className={`p-6 rounded-2xl border transition-all ${
            selectedFormat === 'pdf'
              ? 'border-[#0EA5E9] shadow-lg'
              : 'bg-[#22222A] border-cool-blue/10 hover:border-cool-blue/20'
          }`}
          style={selectedFormat === 'pdf' ? {
            background: 'linear-gradient(to bottom right, rgba(14, 165, 233, 0.1), rgba(14, 165, 233, 0.05))',
            boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.2)'
          } : {}}
        >
          <FileText className="h-8 w-8 mb-3" style={{ color: selectedFormat === 'pdf' ? '#0EA5E9' : '#D1EAF0' }} />
          <h3 className="text-lg font-bold text-white mb-1">PDF Report</h3>
          <p className="text-sm text-cool-blue/60">Formatted document</p>
        </button>

        <button
          onClick={() => setSelectedFormat('copy')}
          className={`p-6 rounded-2xl border transition-all ${
            selectedFormat === 'copy'
              ? 'border-[#0EA5E9] shadow-lg'
              : 'bg-[#22222A] border-cool-blue/10 hover:border-cool-blue/20'
          }`}
          style={selectedFormat === 'copy' ? {
            background: 'linear-gradient(to bottom right, rgba(14, 165, 233, 0.1), rgba(14, 165, 233, 0.05))',
            boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.2)'
          } : {}}
        >
          <Copy className="h-8 w-8 mb-3" style={{ color: selectedFormat === 'copy' ? '#0EA5E9' : '#D1EAF0' }} />
          <h3 className="text-lg font-bold text-white mb-1">Copy Format</h3>
          <p className="text-sm text-cool-blue/60">Quick clipboard</p>
        </button>
      </div>

      {/* Preview */}
      <div className="bg-gradient-to-br from-[#22222A] to-[#1E1E27] border border-cool-blue/10 rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-4">Preview</h3>
        <div className="space-y-4">
          {mockContent.map((item, i) => (
            <div key={i} className="bg-[#1A1A1F] border border-cool-blue/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold" style={{ color: '#0EA5E9' }}>{item.platform}</span>
                <span className="text-xs text-cool-blue/60">{item.date}</span>
              </div>
              <p className="text-sm text-cool-blue/80">{item.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={() => {
          if (selectedFormat === 'csv') handleExportCSV();
          else if (selectedFormat === 'pdf') handleExportPDF();
          else handleCopyAll();
        }}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 text-white font-bold rounded-xl hover:opacity-90 transition-all"
        style={{
          background: 'linear-gradient(to right, #0EA5E9, rgba(14, 165, 233, 0.8))',
          boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.2)'
        }}
      >
        {copied ? (
          <>
            <Check className="h-5 w-5" />
            Copied to Clipboard!
          </>
        ) : (
          <>
            <Download className="h-5 w-5" />
            Export as {selectedFormat.toUpperCase()}
          </>
        )}
      </button>
    </div>
  );
}
