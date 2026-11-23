import React from 'react';
import { motion } from 'framer-motion';
import { Star, Film, Tv, Sparkles, Plus, Heart } from 'lucide-react';
import { LibraryItem, SearchResult, MediaType } from '../types';

interface PosterCardProps {
  item: LibraryItem | SearchResult;
  onClick: () => void;
  onQuickAdd?: () => void;
  onToggleFavorite?: () => void;
  rating?: number | null;
  sectionName?: string;
  isLibrary?: boolean;
}

const typeIcons: Record<MediaType, React.ReactNode> = {
  movie: <Film className="w-3 h-3 text-cyan-400" />,
  tv: <Tv className="w-3 h-3 text-purple-400" />,
  anime: <Sparkles className="w-3 h-3 text-pink-400" />,
};

export const PosterCard: React.FC<PosterCardProps> = ({
  item,
  onClick,
  onQuickAdd,
  onToggleFavorite,
  rating,
  sectionName,
}) => {
  const displayRating = 'rating' in item ? item.rating : rating;
  const isFavorite = 'favorite' in item ? item.favorite : false;
  const genres = item.genres || [];

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-zinc-900/90 border border-white/5 hover:border-purple-500/50 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all cursor-pointer select-none"
      onClick={onClick}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        {item.posterPath ? (
          <img
            src={item.posterPath}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-purple-950/40 to-zinc-900 pointer-events-none">
            <span className="text-4xl mb-2">🎬</span>
            <span className="text-xs font-medium text-zinc-400 line-clamp-3">{item.title}</span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-60 group-hover:opacity-85 transition-opacity pointer-events-none" />

        {/* Media Type Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-semibold uppercase tracking-wider text-zinc-200 pointer-events-none z-10">
          {typeIcons[item.mediaType]}
          <span>{item.mediaType}</span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2.5 right-2.5 pointer-events-none z-10">
          {displayRating !== null && displayRating !== undefined ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-400 font-bold text-xs shadow-md shadow-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{displayRating.toFixed(1)}</span>
            </div>
          ) : (
            <div className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-400 text-[10px]">
              Unrated
            </div>
          )}
        </div>

        {/* Favorite Heart Button if in library */}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className={`absolute bottom-3 left-3 p-2 rounded-xl backdrop-blur-md border border-white/10 transition-all z-20 cursor-pointer ${
              isFavorite
                ? 'bg-red-500/80 text-white shadow-lg shadow-red-500/30'
                : 'bg-black/60 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        )}

        {/* Quick Actions Overlay Button for non-library items */}
        {onQuickAdd && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd();
            }}
            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-xl shadow-purple-600/40 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-20 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        )}
      </div>

      {/* Title & Info */}
      <div className="p-3.5 flex flex-col flex-grow justify-between pointer-events-none">
        <div>
          <h3 className="font-semibold text-sm text-zinc-100 group-hover:text-purple-300 transition-colors line-clamp-1">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
            <span>{item.year || 'Unknown'}</span>
            {sectionName && (
              <>
                <span>•</span>
                <span className="text-purple-400 truncate max-w-[90px]">{sectionName}</span>
              </>
            )}
          </div>
        </div>

        {/* Genre Tags snippet */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 text-[9px] text-zinc-400 font-medium"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Note snippet if present */}
        {'note' in item && item.note && (
          <p className="mt-2 text-[11px] text-zinc-400 italic line-clamp-2 bg-zinc-950/80 p-1.5 rounded-lg border border-white/5">
            "{item.note}"
          </p>
        )}
      </div>
    </motion.div>
  );
};
