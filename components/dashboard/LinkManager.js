import React, { useState } from 'react';
import { Search, Calendar, Link2, ExternalLink, Trash2, Copy, ArrowUpDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import useSWR from 'swr';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'most-clicked', label: 'Most Clicked' },
  { value: 'least-clicked', label: 'Least Clicked' },
  { value: 'expiring-soon', label: 'Expiring Soon' }
];

const LinkManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const { data, error, mutate } = useSWR(
    '/api/dashboard/urls',
    fetcher,
    { 
      refreshInterval: 30000,
      keepPreviousData: true,
    }
  );

  const getUsageLimitDisplay = () => {
    if (!data) return null;

    const { urls, subscription } = data;
    const totalUrls = urls?.length || 0;
    
    if (subscription?.type === 'pro') {
      return (
        <div className="text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2" 
          style={{ 
            backgroundColor: totalUrls >= 50 ? '#FEF3F2' : '#F0FDF4',
            color: totalUrls >= 50 ? '#B42318' : '#027A48'
          }}
        >
          {totalUrls} / 50 daily links
        </div>
      );
    }

    // Free tier
    return (
      <div className="text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2"
        style={{ 
          backgroundColor: totalUrls >= 10 ? '#FEF3F2' : '#F0FDF4',
          color: totalUrls >= 10 ? '#B42318' : '#027A48'
        }}
      >
        {totalUrls} / 10 daily links
      </div>
    );
  };

  const getFilteredAndSortedUrls = () => {
    if (!data?.urls) return [];
    
    let filtered = data.urls.filter(url => 
      url.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.short_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'most-clicked':
          return (b.clicks || 0) - (a.clicks || 0);
        case 'least-clicked':
          return (a.clicks || 0) - (b.clicks || 0);
        case 'expiring-soon':
          return new Date(a.expires_at) - new Date(b.expires_at);
        default:
          return 0;
      }
    });
  };

  const filteredUrls = getFilteredAndSortedUrls();
  const activeLinks = data?.urls?.filter(url => url.is_active).length || 0;
  const expiringLinks = data?.urls?.filter(url => {
    const expiryDate = new Date(url.expires_at);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  }).length || 0;

  const [deletingUrls, setDeletingUrls] = useState(new Set());

  const handleDelete = async (shortCode) => {
    if (!window.confirm('Are you sure you want to delete this link? This action cannot be undone.')) {
      return;
    }
    
    setDeletingUrls(prev => new Set([...prev, shortCode]));
    
    try {
      const res = await fetch('/api/dashboard/urls', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shortCode }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete');
      }

      // Optimistically update the UI
      mutate(
        current => ({
          ...current,
          urls: current.urls.filter(url => url.short_code !== shortCode)
        }),
        { revalidate: false }
      );
    } catch (error) {
      console.error('Failed to delete URL:', error);
      // You might want to add a toast notification here
    } finally {
      setDeletingUrls(prev => {
        const next = new Set(prev);
        next.delete(shortCode);
        return next;
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-white pb-4">
        <Card>
          <CardContent className="p-6">
            {/* Top Row - Search and Usage */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search links..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                {getUsageLimitDisplay()}
              </div>
            </div>

            {/* Bottom Row - Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Daily Links Used</div>
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-semibold text-blue-600">
                        {data?.urls?.length || 0}
                      </div>
                      <div className="text-sm text-gray-500">
                        / {data?.subscription?.type === 'pro' ? '50' : '10'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Active Links</div>
                    <div className="text-2xl font-semibold text-green-600">
                      {activeLinks}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">Expiring Soon</div>
                    <div className="text-2xl font-semibold text-orange-600">
                      {expiringLinks}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* URLs List - Your existing list rendering code */}
      <div className="space-y-4">
        {!data ? (
          Array(3).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-24" />
            </Card>
          ))
        ) : filteredUrls.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              {searchTerm ? 'No matching links found.' : 'Create your first shortened URL to get started!'}
            </CardContent>
          </Card>
        ) : (
          filteredUrls.map((url) => (
            <Card 
              key={url.short_code} 
              className={`hover:shadow-md transition-shadow ${
                !url.is_active ? 'opacity-60' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      {url.title || url.original_url}
                      {!url.is_active && ' (Inactive)'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Link2 size={16} />
                      <span className="truncate">{url.short_code}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(url.created_at).toLocaleDateString()}
                      </div>
                      <div>👁 {url.clicks || 0} clicks</div>
                      {url.expires_at && (
                        <div className="text-xs">
                          Expires: {new Date(url.expires_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                    {/* Rest of your action buttons */}
                    <button
                      onClick={() => handleDelete(url.short_code)}
                      disabled={deletingUrls.has(url.short_code)}
                      className={`p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                      title="Delete link"
                    >
                      {deletingUrls.has(url.short_code) ? (
                        <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                  </button>
                </div>
              </CardContent>
              </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default LinkManager;