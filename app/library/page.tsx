'use client';

import { useState } from 'react';
import { Folder, Tag, Search, Plus, MoreVertical, Star, Archive, Trash2, FolderPlus } from 'lucide-react';

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

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [folders] = useState(['All Content', 'Social Media', 'Blog Posts', 'Email Campaigns']);
  const [tags] = useState(['Marketing', 'Product', 'Announcement', 'Tutorial', 'Evergreen']);
  
  const [content] = useState<ContentItem[]>([
    {
      id: '1',
      title: 'AI in Marketing 2024',
      content: 'Discover how AI is transforming...',
      platform: 'LinkedIn',
      folder: 'Social Media',
      tags: ['Marketing', 'Evergreen'],
      isFavorite: true,
      isEvergreen: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Product Launch Announcement',
      content: 'Excited to announce our new...',
      platform: 'Twitter',
      folder: 'Social Media',
      tags: ['Product', 'Announcement'],
      isFavorite: false,
      isEvergreen: false,
      createdAt: '2024-01-20'
    }
  ]);

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || item.folder === selectedFolder;
    const matchesTag = !selectedTag || item.tags.includes(selectedTag);
    return matchesSearch && matchesFolder && matchesTag;
  });

  const platformColors: Record<string, string> = {
    Twitter: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    LinkedIn: 'bg-blue-600/20 text-blue-300 border-blue-600/30',
    Instagram: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    Facebook: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cool-blue to-white bg-clip-text text-transparent mb-2">
          Content Library
        </h1>
        <p className="text-cool-blue/60">Organize and manage all your content</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-gradient-to-br from-[#22222A] to-[#1E1E27] border border-cool-blue/10 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Folders</h3>
              <button
                onClick={() => setShowNewFolder(true)}
                className="p-1 hover:bg-[#0EA5E9]/10 rounded transition-all"
              >
                <FolderPlus className="h-4 w-4" style={{ color: '#0EA5E9' }} />
              </button>
            </div>
            
            {showNewFolder && (
              <div className="mb-3">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="w-full px-3 py-2 bg-[#1A1A1F] border border-cool-blue/20 rounded-lg text-sm text-white placeholder-cool-blue/40 mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowNewFolder(false);
                      setNewFolderName('');
                    }}
                    className="flex-1 px-3 py-1 text-xs text-white rounded-lg hover:opacity-90"
                    style={{ background: 'linear-gradient(to right, #0EA5E9, rgba(14, 165, 233, 0.8))' }}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowNewFolder(false);
                      setNewFolderName('');
                    }}
                    className="flex-1 px-3 py-1 text-xs bg-[#1A1A1F] text-cool-blue rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <button
                onClick={() => setSelectedFolder('all')}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedFolder === 'all'
                    ? 'text-white'
                    : 'text-cool-blue/70 hover:text-cool-blue hover:bg-cool-blue/5'
                }`}
                style={selectedFolder === 'all' ? {
                  background: 'linear-gradient(to right, rgba(14, 165, 233, 0.2), rgba(14, 165, 233, 0.1))',
                  borderLeft: '3px solid #0EA5E9'
                } : {}}
              >
                <Folder className="h-4 w-4" />
                All Content
              </button>
              {folders.slice(1).map((folder) => (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedFolder === folder
                      ? 'text-white'
                      : 'text-cool-blue/70 hover:text-cool-blue hover:bg-cool-blue/5'
                  }`}
                  style={selectedFolder === folder ? {
                    background: 'linear-gradient(to right, rgba(14, 165, 233, 0.2), rgba(14, 165, 233, 0.1))',
                    borderLeft: '3px solid #0EA5E9'
                  } : {}}
                >
                  <Folder className="h-4 w-4" />
                  {folder}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#22222A] to-[#1E1E27] border border-cool-blue/10 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                  className={`px-3 py-1 text-xs rounded-full transition-all ${
                    selectedTag === tag
                      ? 'text-white border'
                      : 'bg-[#1A1A1F] text-cool-blue/70 hover:text-cool-blue'
                  }`}
                  style={selectedTag === tag ? {
                    background: 'rgba(14, 165, 233, 0.2)',
                    color: '#0EA5E9',
                    borderColor: '#0EA5E9'
                  } : {}}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-9">
          {/* Search Bar */}
          <div className="bg-gradient-to-br from-[#22222A] to-[#1E1E27] border border-cool-blue/10 rounded-2xl p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cool-blue/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search content..."
                className="w-full pl-12 pr-4 py-3 bg-[#1A1A1F] border border-cool-blue/20 rounded-xl text-white placeholder-cool-blue/40"
              />
            </div>
          </div>

          {/* Content Grid */}
          <div className="space-y-4">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-[#22222A] to-[#1E1E27] border border-cool-blue/10 rounded-2xl p-6 hover:border-cool-blue/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      {item.isFavorite && (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      )}
                      {item.isEvergreen && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                          Evergreen
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-cool-blue/70 mb-3">{item.content}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 text-xs rounded-full border ${platformColors[item.platform]}`}>
                        {item.platform}
                      </span>
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            background: 'rgba(14, 165, 233, 0.1)',
                            color: '#0EA5E9',
                            border: '1px solid rgba(14, 165, 233, 0.2)'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="p-2 hover:bg-cool-blue/10 rounded-lg transition-all">
                    <MoreVertical className="h-5 w-5 text-cool-blue/60" />
                  </button>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-cool-blue/10">
                  <span className="text-xs text-cool-blue/60">{item.createdAt}</span>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-cool-blue/10 rounded-lg transition-all">
                      <Archive className="h-4 w-4 text-cool-blue/60" />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 className="h-4 w-4 text-cool-blue/60 hover:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
