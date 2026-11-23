import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Folder, Calendar, Star, Film, Tv, Sparkles, Share2 } from 'lucide-react';
import { LibraryItem, SearchResult } from '../types';
import { useAppStore } from '../store';
import { RatingWidget } from './RatingWidget';

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
  const { library, sections, updateRating, moveItemSection, removeFromLibrary } = useAppStore();

  if (!isOpen || !item) return null;

  const libraryItem = library.find((i) =>
    'externalId' in item ? i.externalId === item.externalId : i.externalId === item.id
  );

  const [currentRating, setCurrentRating] = useState<number | null>(libraryItem?.rating ?? null);
  const [currentNote, setCurrentNote] = useState<string>(libraryItem?.note ?? '');
  const [currentSecId, setCurrentSecId] = useState<string>(libraryItem?.sectionId ?? sections[0]?.id);

  const isSavedInLibrary = Boolean(libraryItem);

  const handleSaveEdits = () => {
    if (libraryItem) {
      updateRating(libraryItem.id, currentRating, currentNote);
      if (currentSecId !== libraryItem.sectionId) {
        moveItemSection(libraryItem.id, currentSecId);
      }
      onToast?.('Changes saved!');
      onClose();
    }
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
      navigator.clipboard.writeText(`Check out "${item.title}" (${item.year}) on RatingX!`);
      onToast?.('Title link copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-zinc-900/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-zinc-100 my-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Backdrop Header */}
          <div className="relative h-48 md:h-64 w-full bg-zinc-950 overflow-hidden">
            {item.backdropPath || item.posterPath ? (
              <img
                src={item.backdropPath || item.posterPath || ''}
                alt={item.title}
                className="w-full h-full object-cover opacity-40 blur-xs scale-105"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-zinc-400 hover:text-white transition-all backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="absolute top-4 right-16 p-2 rounded-full bg-black/60 hover:bg-black text-zinc-400 hover:text-white transition-all backdrop-blur-md"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Title overlay */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/30 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
                    {item.mediaType}
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.year}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {item.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6">
            {/* Overview */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Synopsis
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed max-h-36 overflow-y-auto">
                {item.overview || 'No overview available for this title.'}
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
                      <span className="text-[11px] text-zinc-500">
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

                {/* Section selection */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2 flex items-center gap-1.5">
                    <Folder className="w-4 h-4 text-purple-400" />
                    Section / Folder
                  </label>
                  <select
                    value={currentSecId}
                    onChange={(e) => setCurrentSecId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    {sections.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.icon} {sec.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Personal Notes */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                    Review / Notes
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
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all whitespace-nowrap"
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
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
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
                  className="px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Close
                </button>
                {isSavedInLibrary && (
                  <button
                    type="button"
                    onClick={handleSaveEdits}
                    className="px-6 py-2 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all"
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
  );
};
