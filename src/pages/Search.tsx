import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Film, Tv, Sparkles, Loader2, SlidersHorizontal } from 'lucide-react';
import { searchTitles } from '../services/api';
import { SearchResult, MediaType } from '../types';
import { PosterCard } from '../components/PosterCard';
import { TitleDetailModal } from '../components/TitleDetailModal';
import { AddToSectionModal } from '../components/AddToSectionModal';
import { useAppStore } from '../store';
import { useToast } from '../components/Toast';

export const Search: React.FC = () => {
  const { tmdbApiKey } = useAppStore();
  const { showToast } = useToast();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | MediaType>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const [activeItem, setActiveItem] = useState<SearchResult | null>(null);
  const [addModalItem, setAddModalItem] = useState<SearchResult | null>(null);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchTitles(query, filterType, tmdbApiKey);
        if (active) setResults(res);
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, filterType, tmdbApiKey]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Search Films, Series & Anime
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Search any movie, show, or anime to add to your custom folders and rate it 0/10.
          </p>
        </div>

        {/* Input Field */}
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, anime name, movie, characters (e.g. Inception, Naruto, Stranger Things)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-zinc-900/90 border border-white/10 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm md:text-base transition-all shadow-xl"
            autoFocus
          />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 animate-spin pointer-events-none" />
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Categories', icon: SlidersHorizontal },
            { id: 'movie', label: 'Movies', icon: Film },
            { id: 'tv', label: 'TV Series', icon: Tv },
            { id: 'anime', label: 'Anime', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = filterType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id as 'all' | MediaType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            {query.trim() ? `Search Results (${results.length})` : 'Popular & Curated Highlights'}
          </h2>
        </div>

        {results.length === 0 && !loading ? (
          <div className="py-20 text-center space-y-3 bg-zinc-900/30 rounded-3xl border border-white/5">
            <span className="text-5xl">🔍</span>
            <h3 className="text-lg font-bold text-white">No titles found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try searching with another spelling, or switch between Movies, TV Series, and Anime tabs.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((item) => (
              <PosterCard
                key={item.id}
                item={item}
                onClick={() => setActiveItem(item)}
                onQuickAdd={() => setAddModalItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <TitleDetailModal
        item={activeItem}
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        onOpenAddModal={() => {
          if (activeItem) setAddModalItem(activeItem);
        }}
        onToast={showToast}
      />

      <AddToSectionModal
        item={addModalItem}
        isOpen={Boolean(addModalItem)}
        onClose={() => setAddModalItem(null)}
        onSuccess={showToast}
      />
    </div>
  );
};
