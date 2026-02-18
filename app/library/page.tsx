'use client';

import { useState, useEffect } from 'react';
import { Folder, Tag, Search, Plus, MoreVertical, Star, Archive, Trash2, FolderPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

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
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedTag, setSelectedTag] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) fetchContent();
  }, [user]);

  const fetchContent = async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const response = await fetch('/api/library', {
        headers: { 'Authorization': `Bearer ${idToken}` }
      });
      const data = await response.json();
      setContent(data.content || []);
    } catch (error) {
      console.error('Failed to fetch content:', error);
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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ id, isFavorite: !current })
      });
      setContent(prev => prev.map(item => item.id === id ? { ...item, isFavorite: !current } : item));
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
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
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  const folders = ['All Content', ...Array.from(new Set(content.map(c => c.folder)))];
  const tags = Array.from(new Set(content.flatMap(c => c.tags)));

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || selectedFolder === 'All Content' || item.folder === selectedFolder;
    const matchesTag = !selectedTag || item.tags.includes(selectedTag);
    return matchesSearch && matchesFolder && matchesTag;
  });

  const platformColors: Record<string, string> = {
    Twitter: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    twitter: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    LinkedIn: 'bg-blue-600/20 text-blue-300 border-blue-600/30',
    linkedin: 'bg-blue-600/20 text-blue-300 border-blue-600/30',
    Instagram: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    instagram: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    Facebook: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    facebook: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    tiktok: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    youtube: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-cool-blue to-white bg-clip-text text-transparent mb-2">
          Content Library
        </h1>
        <p className="text-cool-blue/60 text-sm sm:text-base">Organize and manage all your content</p>
      </div>

      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-4">
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
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${selectedFolder === 'all'
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
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${selectedFolder === folder
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
                  className={`px-3 py-1 text-xs rounded-full transition-all ${selectedTag === tag
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
                      <button onClick={() => toggleFavorite(item.id, item.isFavorite)}>
                        <Star className={`h-4 w-4 ${item.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-cool-blue/40'}`} />
                      </button>
                      {item.isEvergreen && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                          Evergreen
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-cool-blue/70 mb-3">{item.content}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-1 text-xs rounded-full border ${platformColors[item.platform] || 'bg-cool-blue/20 text-cool-blue border-cool-blue/30'}`}>
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
                  <span className="text-xs text-cool-blue/60">{new Date(item.createdAt).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    <button onClick={() => deleteItem(item.id)} className="p-2 hover:bg-red-500/10 rounded-lg transition-all">
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
