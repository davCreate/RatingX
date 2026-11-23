import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, Flame, Search as SearchIcon, ArrowRight, Play, Film, Tv, Heart } from 'lucide-react';
import { useAppStore } from '../store';
import { PosterCard } from '../components/PosterCard';
import { TitleDetailModal } from '../components/TitleDetailModal';
import { AddToSectionModal } from '../components/AddToSectionModal';
import { TrailerModal } from '../components/TrailerModal';
import { fetchLiveTrending } from '../services/api';
import { LibraryItem, SearchResult, MediaType } from '../types';
import { useToast } from '../components/Toast';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { library, sections, toggleFavorite } = useAppStore();
  const { showToast } = useToast();

  const [activeModalItem, setActiveModalItem] = useState<LibraryItem | SearchResult | null>(null);
  const [addModalItem, setAddModalItem] = useState<SearchResult | null>(null);
  const [isSpotlightTrailerOpen, setIsSpotlightTrailerOpen] = useState(false);

  // Trending Tab category
  const [trendingCategory, setTrendingCategory] = useState<'all' | MediaType>('all');
  const [trendingList, setTrendingList] = useState<SearchResult[]>([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    setIsTrendingLoading(true);
    fetchLiveTrending(trendingCategory)
      .then((items) => {
        if (isCurrent) setTrendingList(items);
      })
      .finally(() => {
        if (isCurrent) setIsTrendingLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [trendingCategory]);

  const ratedItems = library
    .filter((i) => i.rating !== null)
    .sort((a, b) => (b.ratedAt || 0) - (a.ratedAt || 0));

  const favorites = library.filter((i) => i.favorite);

  const averageRating =
    ratedItems.length > 0
      ? (ratedItems.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratedItems.length).toFixed(1)
      : '0.0';

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Hero Spotlight Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-zinc-900 to-indigo-950/70 border border-white/10 p-8 md:p-12 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Discover, Collect & Rate Cinema & Anime
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Rate every film, series & anime on a <span className="text-amber-400">0/10 scale</span>.
          </h1>
          <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
            Create custom folders, rate with fine decimal precision, write reviews, and share your personal watch profile with the world.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <SearchIcon className="w-4 h-4" />
              Search Titles
            </button>
            <button
              type="button"
              onClick={() => navigate('/library')}
              className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              My Collections ({sections.length})
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsSpotlightTrailerOpen(true)}
              className="px-5 py-3 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-white/5 font-medium text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-zinc-300" />
              Watch Trailer
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Quick Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-sm">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
            Total In Library
          </span>
          <span className="text-3xl font-black text-white mt-1 block">{library.length}</span>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-sm">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
            Rated Titles
          </span>
          <span className="text-3xl font-black text-amber-400 mt-1 block">{ratedItems.length}</span>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-sm">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
            Average Score
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-3xl font-black text-white">{averageRating}</span>
            <span className="text-xs text-amber-400 font-bold">/ 10</span>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-sm">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
            Favorites
          </span>
          <span className="text-3xl font-black text-red-400 mt-1 block">{favorites.length}</span>
        </div>
      </div>

      {/* Live Trending Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Trending & Masterpieces</h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-900/80 rounded-xl border border-white/5">
            {[
              { id: 'all', label: 'All', icon: Sparkles },
              { id: 'movie', label: 'Movies', icon: Film },
              { id: 'tv', label: 'Series', icon: Tv },
              { id: 'anime', label: 'Anime', icon: Sparkles },
            ].map((tab) => {
              const isSelected = trendingCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTrendingCategory(tab.id as 'all' | MediaType)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {isTrendingLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-zinc-900/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {trendingList.slice(0, 10).map((item) => (
              <PosterCard
                key={item.id}
                item={item}
                onClick={() => setActiveModalItem(item)}
                onQuickAdd={() => setAddModalItem(item)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recently Rated Section */}
      {ratedItems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Your Highest & Recent Ratings</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/library')}
              className="text-xs font-medium text-purple-400 hover:text-purple-300 cursor-pointer"
            >
              View all ({ratedItems.length})
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ratedItems.slice(0, 6).map((item) => (
              <PosterCard
                key={item.id}
                item={item}
                onClick={() => setActiveModalItem(item)}
                onToggleFavorite={() => toggleFavorite(item.id)}
                sectionName={sections.find((s) => s.id === item.sectionId)?.name}
                isLibrary
              />
            ))}
          </div>
        </section>
      )}

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h2 className="text-xl font-bold text-white tracking-tight">Your Favorites</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/library?filter=favorites')}
              className="text-xs font-medium text-purple-400 hover:text-purple-300 cursor-pointer"
            >
              View favorites
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {favorites.slice(0, 6).map((item) => (
              <PosterCard
                key={item.id}
                item={item}
                onClick={() => setActiveModalItem(item)}
                onToggleFavorite={() => toggleFavorite(item.id)}
                sectionName={sections.find((s) => s.id === item.sectionId)?.name}
                isLibrary
              />
            ))}
          </div>
        </section>
      )}

      {/* Title Detail Modal */}
      <TitleDetailModal
        item={activeModalItem}
        isOpen={Boolean(activeModalItem)}
        onClose={() => setActiveModalItem(null)}
        onOpenAddModal={() => {
          if (activeModalItem && !('sectionId' in activeModalItem)) {
            setAddModalItem(activeModalItem as SearchResult);
          }
        }}
        onToast={showToast}
      />

      {/* Add To Section Modal */}
      <AddToSectionModal
        item={addModalItem}
        isOpen={Boolean(addModalItem)}
        onClose={() => setAddModalItem(null)}
        onSuccess={showToast}
      />

      {/* Spotlight Trailer Modal */}
      <TrailerModal
        isOpen={isSpotlightTrailerOpen}
        onClose={() => setIsSpotlightTrailerOpen(false)}
        title="Interstellar"
        trailerUrl="https://www.youtube.com/watch?v=zSWdZVtXT7E"
      />
    </div>
  );
};
