import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, FolderPlus, Check } from 'lucide-react';
import { useAppStore } from '../store';
import { SearchResult, LibraryItem } from '../types';
import { RatingWidget } from './RatingWidget';

interface AddToSectionModalProps {
  item: SearchResult | LibraryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (msg: string) => void;
}

export const AddToSectionModal: React.FC<AddToSectionModalProps> = ({
  item,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { sections, addSection, addToLibrary, library } = useAppStore();
  const [selectedSecId, setSelectedSecId] = useState<string>(sections[0]?.id || '');
  const [rating, setRating] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionIcon, setNewSectionIcon] = useState('📁');

  useEffect(() => {
    if (item) {
      const existing = library.find(
        (i) => String(i.externalId) === String('externalId' in item ? item.externalId : item.id)
      );
      setSelectedSecId(existing?.sectionId || sections[0]?.id || '');
      setRating(existing?.rating ?? null);
      setNote(existing?.note || '');
      setIsCreatingSection(false);
      setNewSectionName('');
    }
  }, [item, library, sections]);

  if (!isOpen || !item) return null;

  const existingInLib = library.find(
    (i) => String(i.externalId) === String('externalId' in item ? item.externalId : item.id)
  );

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    let targetSectionId = selectedSecId;

    if (isCreatingSection && newSectionName.trim()) {
      const created = addSection(newSectionName.trim(), newSectionIcon);
      targetSectionId = created.id;
    }

    addToLibrary({
      externalId: 'externalId' in item ? item.externalId : item.id,
      mediaType: item.mediaType,
      title: item.title,
      posterPath: item.posterPath,
      backdropPath: item.backdropPath,
      year: item.year,
      overview: item.overview,
      sectionId: targetSectionId || sections[0]?.id,
      rating: rating,
      note: note,
    });

    onSuccess?.(`Saved "${item.title}" to collection!`);
    onClose();
  };

  const EMOJI_OPTIONS = ['📁', '🔥', '⭐', '🎬', '🍿', '📺', '🌸', '🏆', '💎', '🎯'];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-6 text-zinc-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-purple-400" />
              {existingInLib ? 'Edit in Library' : 'Add to Collection'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Item Preview */}
          <div className="flex gap-3 my-4 p-3 bg-zinc-950/60 rounded-xl border border-white/5">
            {item.posterPath ? (
              <img
                src={item.posterPath}
                alt={item.title}
                className="w-12 h-16 object-cover rounded-lg pointer-events-none"
              />
            ) : (
              <div className="w-12 h-16 rounded-lg bg-purple-900/40 flex items-center justify-center text-xl">
                🎬
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <h4 className="font-semibold text-sm truncate">{item.title}</h4>
              <p className="text-xs text-zinc-400">{item.year} • {item.mediaType.toUpperCase()}</p>
              {existingInLib && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/20 text-purple-300">
                  Already in library
                </span>
              )}
            </div>
          </div>

          {/* Section Picker */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Select Section / Folder
              </label>
              <button
                type="button"
                onClick={() => setIsCreatingSection(!isCreatingSection)}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {isCreatingSection ? 'Choose Existing' : 'New Folder'}
              </button>
            </div>

            {isCreatingSection ? (
              <div className="p-3 bg-zinc-950 rounded-xl border border-purple-500/30 space-y-3">
                <input
                  type="text"
                  placeholder="e.g. Masterpieces, Weekend Binge..."
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                  autoFocus
                />
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewSectionIcon(emoji)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer ${
                        newSectionIcon === emoji
                          ? 'bg-purple-600 scale-110 shadow-lg'
                          : 'bg-zinc-800 hover:bg-zinc-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSelectedSecId(sec.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all text-left cursor-pointer ${
                      selectedSecId === sec.id
                        ? 'bg-purple-600 text-white font-medium shadow-md shadow-purple-600/30'
                        : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{sec.icon}</span>
                      <span>{sec.name}</span>
                    </span>
                    {selectedSecId === sec.id && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rating (0 - 10) */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
              Your Rating (0 / 10)
            </label>
            <RatingWidget value={rating} onChange={setRating} />
          </div>

          {/* Optional Note */}
          <div className="mb-6">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Personal Note / Review (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="What did you think of the plot, characters, OST...?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Save Item
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
