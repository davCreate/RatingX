import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, Film, Tv, Sparkles, Loader2, SlidersHorizontal, History, X, Globe, ChevronDown } from 'lucide-react';
import { searchTitles, fetchWorldwideCatalog, CATALOG_GENRES } from '../services/api';
import { SearchResult, MediaType } from '../types';
import { PosterCard } from '../components/PosterCard';
import { TitleDetailModal } from '../components/TitleDetailModal';
import { AddToSectionModal } from '../components/AddToSectionModal';
import { useAppStore } from '../store';
import { useToast } from '../components/Toast';

export const Search: React.FC = () => {
  const { tmdbApiKey, recentSearches, addRecentSearch, clearRecentSearches, toggleFavorite } = useAppStore();
  const { showToast } = useToast();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | MediaType>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [activeItem, setActiveItem] = useState<SearchResult | null>(null);
  const [addModalItem, setAddModalItem] = useState<SearchResult | null>(null);

  // Load or search when query, filterType, or genre changes
  useEffect(() => {
    let active = true;
    setPage(0);
    setHasMore(true);

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        if (query.trim()) {
          const res = await searchTitles(query, filterType, tmdbApiKey);
          if (active) {
            setResults(res);
            setHasMore(false);
          }
        } else {
          // Worldwide Stremio catalog browse
          const res = await fetchWorldwideCatalog(filterType, selectedGenre, 0);
          if (active) {
            setResults(res);
            setHasMore(res.length >= 20);
          }
        }
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 280);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, filterType, selectedGenre, tmdbApiKey]);

  // Load next page of worldwide catalog
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || query.trim()) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    try {
      const more = await fetchWorldwideCatalog(filterType, selectedGenre, nextPage);
      if (more.length === 0) {
        setHasMore(false);
      } else {
        setResults((prev) => {
          const seen = new Set(prev.map((i) => i.id));
          const newUnique = more.filter((i) => !seen.has(i.id));
          return [...prev, ...newUnique];
        });
        setPage(nextPage);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query.trim());
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Universal Catalog Explorer</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Stremio + TMDB + Anime
              </span>
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Explore virtually every film, series, and anime in the world. Add to your folders and rate on a 0/10 scale.
            </p>
          </div>
        </div>

        {/* Input Field */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search any title in the world (e.g. Inception, Breaking Bad, Jujutsu Kaisen, Dune, One Piece)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-zinc-900/90 border border-white/10 rounded-2xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm md:text-base transition-all shadow-xl"
            autoFocus
          />
          {loading ? (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 animate-spin pointer-events-none" />
          ) : query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          ) : null}
        </form>

        {/* Recent Searches */}
        {recentSearches.length > 0 && !query && (
          <div className="flex items-center gap-2 overflow-x-auto text-xs py-1">
            <span className="text-zinc-500 flex items-center gap-1 font-semibold whitespace-nowrap">
              <History className="w-3.5 h-3.5" /> Recent:
            </span>
            {recentSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/5 whitespace-nowrap transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
            <button
              type="button"
              onClick={clearRecentSearches}
              className="text-[11px] text-zinc-600 hover:text-zinc-400 cursor-pointer ml-1"
            >
              Clear
            </button>
          </div>
        )}

        {/* Media Type Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Catalog', icon: SlidersHorizontal },
            { id: 'movie', label: 'Movies', icon: Film },
            { id: 'tv', label: 'TV Shows & Series', icon: Tv },
            { id: 'anime', label: 'Anime Universe', icon: Sparkles },
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

        {/* Genre Badges (When browsing catalog) */}
        {!query && filterType !== 'anime' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {CATALOG_GENRES.map((g) => {
              const isSelected = selectedGenre === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGenre(g.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                      : 'bg-zinc-950/60 border border-white/5 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>{g.icon}</span>
                  <span>{g.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <span>
              {query.trim()
                ? `Search Results for "${query}" (${results.length})`
                : `${filterType === 'all' ? 'Worldwide Top Titles' : filterType === 'movie' ? 'Top Movies' : filterType === 'tv' ? 'Popular Series' : 'Top Anime'} (${results.length} loaded)`}
            </span>
          </h2>
        </div>

        {results.length === 0 && !loading ? (
          <div className="py-24 text-center space-y-3 bg-zinc-900/30 rounded-3xl border border-white/5">
            <span className="text-5xl">🔍</span>
            <h3 className="text-lg font-bold text-white">No titles found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Check spelling or try a broader search across Movies, TV Series, and Anime.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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

        {/* Load More Button for Infinite Catalog */}
        {!query && hasMore && results.length > 0 && (
          <div className="flex justify-center pt-8">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-semibold text-xs shadow-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span>Loading titles from Stremio Cinemeta...</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-purple-400" />
                  <span>Load More Titles</span>
                </>
              )}
            </button>
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
