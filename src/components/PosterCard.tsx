import React from 'react';
import { motion } from 'framer-motion';
import { Star, MoreVertical, Film, Tv, Sparkles } from 'lucide-react';
import { LibraryItem, SearchResult, MediaType } from '../types';

interface PosterCardProps {
  item: LibraryItem | SearchResult;
  onClick: () => void;
  onQuickAdd?: () => void;
  onRemove?: () => void;
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
  onRemove,
  rating,
  sectionName,
  isLibrary = false,
}) => {
  const displayRating = 'rating' in item ? item.rating : rating;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-zinc-900/80 border border-white/5 hover:border-purple-500/40 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 transition-all cursor-pointer"
      onClick={onClick}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        {item.posterPath ? (
          <img
            src={item.posterPath}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-purple-950/40 to-zinc-900">
            <span className="text-4xl mb-2">🎬</span>
            <span className="text-xs font-medium text-zinc-400 line-clamp-3">{item.title}</span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Media Type Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-semibold uppercase tracking-wider text-zinc-200">
          {typeIcons[item.mediaType]}
          <span>{item.mediaType}</span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2.5 right-2.5">
          {displayRating !== null && displayRating !== undefined ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/75 backdrop-blur-md border border-amber-500/30 text-amber-400 font-bold text-xs shadow-md shadow-amber-500/10">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{displayRating.toFixed(1)}</span>
            </div>
          ) : (
            <div className="px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-zinc-400 text-[10px]">
              Unrated
            </div>
          )}
        </div>

        {/* Quick Actions Overlay Button for non-library items */}
        {onQuickAdd && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd();
            }}
            className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0"
          >
            + Add to List
          </button>
        )}
      </div>

      {/* Title & Info */}
      <div className="p-3.5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-semibold text-sm text-zinc-100 group-hover:text-purple-300 transition-colors line-clamp-1">
            {item.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
            <span>{item.year || 'Unknown'}</span>
            {sectionName && (
              <>
                <span>•</span>
                <span className="text-purple-400 truncate max-w-[100px]">{sectionName}</span>
              </>
            )}
          </div>
        </div>

        {/* Note snippet if present */}
        {'note' in item && item.note && (
          <p className="mt-2 text-[11px] text-zinc-400 italic line-clamp-2 bg-zinc-950/60 p-1.5 rounded-lg border border-white/5">
            "{item.note}"
          </p>
        )}
      </div>
    </motion.div>
  );
};
