import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Folder, Calendar, Star, Share2, Play, Heart, Tag, Plus, Pin } from 'lucide-react';
import { LibraryItem, SearchResult, WatchStatus } from '../types';
import { useAppStore } from '../store';
import { RatingWidget } from './RatingWidget';
import { TrailerModal } from './TrailerModal';

interface TitleDetailModalProps {
  item: LibraryItem | SearchResult | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAddModal?: () => void;
  onToast?: (msg: string) => void;
}

export const TitleDetailModal: React.FC<TitleDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onOpenAddModal,
  onToast,
}) => {
  const { library, sections, profile, updateRating, moveItemSection, removeFromLibrary, toggleFavorite, togglePinnedFavorite, updateWatchStatus, updateItemTags } = useAppStore();

  const [currentRating, setCurrentRating] = useState<number | null>(null);
  const [currentNote, setCurrentNote] = useState<string>('');
  const [currentSecId, setCurrentSecId] = useState<string>(sections[0]?.id || '');
  const [currentStatus, setCurrentStatus] = useState<WatchStatus>('completed');
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const libraryItem = item
    ? library.find((i) =>
        String(i.externalId) === String('externalId' in item ? item.externalId : item.id)
      )
    : undefined;

  const isSavedInLibrary = Boolean(libraryItem);
  const isPinned = libraryItem ? (profile.pinnedFavorites || []).includes(String(libraryItem.externalId)) : false;

  useEffect(() => {
    if (item) {
      const match = library.find((i) =>
        String(i.externalId) === String('externalId' in item ? item.externalId : item.id)
      );
      setCurrentRating(match?.rating ?? null);
      setCurrentNote(match?.note ?? '');
      setCurrentSecId(match?.sectionId ?? sections[0]?.id ?? '');
      setCurrentStatus(match?.watchStatus ?? 'completed');
      setTags(match?.tags ?? []);
      setNewTagInput('');
    }
  }, [item, library, sections]);

  if (!isOpen || !item) return null;

  const handleSaveEdits = () => {
    if (libraryItem) {
      updateRating(libraryItem.id, currentRating, currentNote);
      if (currentSecId && currentSecId !== libraryItem.sectionId) {
        moveItemSection(libraryItem.id, currentSecId);
      }
      updateWatchStatus(libraryItem.id, currentStatus);
      updateItemTags(libraryItem.id, tags);
      onToast?.('Saved changes!');
      onClose();
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTag = newTagInput.trim();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleDelete = () => {
    if (libraryItem && window.confirm(`Remove "${item.title}" from your library?`)) {
      removeFromLibrary(libraryItem.id);
      onToast?.('Removed from library');
      onClose();
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Check out "${item.title}" (${item.year}) on RatingX! Score: ${currentRating ?? 'Unrated'}/10`);
      onToast?.('Title link copied to clipboard!');
    }
  };

  return (
    <>
      <AnimatePresence>
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-zinc-900/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-zinc-100 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Backdrop Header */}
            <div className="relative h-56 md:h-72 w-full bg-zinc-950 overflow-hidden">
              {item.backdropPath || item.posterPath ? (
                <img
                  src={item.backdropPath || item.posterPath || ''}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-45 blur-xs scale-105 pointer-events-none"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent pointer-events-none" />

              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-zinc-400 hover:text-white transition-all backdrop-blur-md z-10 cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Share button */}
              <button
                type="button"
                onClick={handleShare}
                className="absolute top-4 right-16 p-2 rounded-full bg-black/60 hover:bg-black text-zinc-400 hover:text-white transition-all backdrop-blur-md z-10 cursor-pointer"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {/* Favorite button if in library */}
              {libraryItem && (
                <button
                  type="button"
                  onClick={() => toggleFavorite(libraryItem.id)}
                  className={`absolute top-4 right-28 p-2 rounded-full backdrop-blur-md transition-all z-10 cursor-pointer ${
                    libraryItem.favorite
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/40'
                      : 'bg-black/60 text-zinc-400 hover:text-white'
                  }`}
                  title={libraryItem.favorite ? 'Favorited' : 'Favorite'}
                >
                  <Heart className={`w-5 h-5 ${libraryItem.favorite ? 'fill-white' : ''}`} />
                </button>
              )}

              {/* Pin to Profile Spotlight button if in library */}
              {libraryItem && (
                <button
                  type="button"
                  onClick={() => {
                    togglePinnedFavorite(String(libraryItem.externalId));
                    showToast(isPinned ? 'Unpinned from profile spotlight' : 'Pinned to profile top 4 spotlight!');
                  }}
                  className={`absolute top-4 right-40 p-2 rounded-full backdrop-blur-md transition-all z-10 cursor-pointer ${
                    isPinned
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/40 font-bold'
                      : 'bg-black/60 text-zinc-400 hover:text-white'
                  }`}
                  title={isPinned ? 'Pinned in Profile Top 4' : 'Pin to Profile Top 4'}
                >
                  <Pin className={`w-5 h-5 ${isPinned ? 'fill-black' : ''}`} />
                </button>
              )}

              {/* Title overlay */}
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/30 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
                      {item.mediaType}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.year}
                    </span>
                    {'episodes' in item && item.episodes && (
                      <span className="text-xs text-zinc-400 font-mono">
                        • {item.episodes} eps
                      </span>
                    )}
                    {'duration' in item && item.duration && (
                      <span className="text-xs text-zinc-400 font-mono">
                        • {item.duration}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                    {item.title}
                  </h1>
                </div>

                {/* Trailer Button */}
                <button
                  type="button"
                  onClick={() => setIsTrailerOpen(true)}
                  className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-2 shadow-xl transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  Trailer
                </button>
              </div>
            </div>

            {/* Body Content */}
            <div className="p-6 space-y-6">
              {/* Genre Pills */}
              {item.genres && item.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {item.genres.map((g) => (
                    <span
                      key={g}
                      className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Synopsis
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed max-h-36 overflow-y-auto">
                  {item.overview || 'No synopsis available for this title.'}
                </p>
              </div>

              {/* If in Library: Rating & Section & Notes */}
              {isSavedInLibrary && libraryItem ? (
                <div className="space-y-5 p-5 bg-zinc-950/70 rounded-2xl border border-white/5">
                  {/* Rating component */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        Your Rating (0 to 10)
                      </span>
                      {libraryItem.ratedAt && (
                        <span className="text-[11px] text-zinc-500 font-mono">
                          Rated {new Date(libraryItem.ratedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <RatingWidget
                      value={currentRating}
                      onChange={(val) => setCurrentRating(val)}
                      size="lg"
                    />
                  </div>

                  {/* Section & Watch Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2 flex items-center gap-1.5">
                        <Folder className="w-4 h-4 text-purple-400" />
                        Folder / Section
                      </label>
                      <select
                        value={currentSecId}
                        onChange={(e) => setCurrentSecId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                      >
                        {sections.map((sec) => (
                          <option key={sec.id} value={sec.id}>
                            {sec.icon} {sec.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2 flex items-center gap-1.5">
                        Watch Status
                      </label>
                      <select
                        value={currentStatus}
                        onChange={(e) => setCurrentStatus(e.target.value as WatchStatus)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                      >
                        <option value="completed">Completed</option>
                        <option value="watching">Currently Watching</option>
                        <option value="plan_to_watch">Plan to Watch</option>
                        <option value="on_hold">On Hold</option>
                        <option value="dropped">Dropped</option>
                      </select>
                    </div>
                  </div>

                  {/* Custom Tags */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-purple-400" />
                      Custom Tags
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/10 text-xs text-zinc-300 flex items-center gap-1"
                        >
                          <span>#{t}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            className="text-zinc-500 hover:text-red-400 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add tag (e.g. Rewatch, Hans Zimmer, Dark Fantasy)..."
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag(e);
                          }
                        }}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white text-xs font-semibold border border-purple-500/30 transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Personal Notes */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                      Review / Thoughts
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Write your review, favourite quote, or thoughts..."
                      value={currentNote}
                      onChange={(e) => setCurrentNote(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-purple-950/20 border border-purple-500/20 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">Not in your collection yet</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Add this title to rank it from 0 to 10 and organize it into folders.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAddModal?.();
                    }}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all whitespace-nowrap cursor-pointer"
                  >
                    + Add to List
                  </button>
                </div>
              )}

              {/* Footer buttons */}
              <div className="flex items-center justify-between pt-2">
                {isSavedInLibrary ? (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  {isSavedInLibrary && (
                    <button
                      type="button"
                      onClick={handleSaveEdits}
                      className="px-6 py-2 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Trailer Video Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        title={item.title}
        trailerUrl={item.trailerUrl}
      />
    </>
  );
};
