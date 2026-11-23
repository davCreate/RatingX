import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, ArrowUpDown } from 'lucide-react';
import { useAppStore } from '../store';
import { LibraryItem, MediaType } from '../types';
import { PosterCard } from '../components/PosterCard';
import { TitleDetailModal } from '../components/TitleDetailModal';
import { useToast } from '../components/Toast';

export const Library: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSectionId = searchParams.get('section');

  const { sections, library, addSection, updateSection, deleteSection } = useAppStore();
  const { showToast } = useToast();

  const [activeItem, setActiveItem] = useState<LibraryItem | null>(null);
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [sectionModalMode, setSectionModalMode] = useState<'create' | 'edit'>('create');
  const [secName, setSecName] = useState('');
  const [secIcon, setSecIcon] = useState('📁');
  const [targetEditSecId, setTargetEditSecId] = useState<string | null>(null);

  // Sorting and Filtering
  const [sortBy, setSortBy] = useState<'rating_desc' | 'rating_asc' | 'date_desc' | 'title_asc'>('rating_desc');
  const [typeFilter, setTypeFilter] = useState<'all' | MediaType>('all');

  const filteredItems = useMemo(() => {
    let items = [...library];

    // Filter by Section
    if (activeSectionId) {
      items = items.filter((i) => i.sectionId === activeSectionId);
    }

    // Filter by Media Type
    if (typeFilter !== 'all') {
      items = items.filter((i) => i.mediaType === typeFilter);
    }

    // Sort
    items.sort((a, b) => {
      if (sortBy === 'rating_desc') {
        return (b.rating ?? -1) - (a.rating ?? -1);
      }
      if (sortBy === 'rating_asc') {
        return (a.rating ?? 11) - (b.rating ?? 11);
      }
      if (sortBy === 'date_desc') {
        return b.addedAt - a.addedAt;
      }
      if (sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return items;
  }, [library, activeSectionId, typeFilter, sortBy]);

  const activeSection = sections.find((s) => s.id === activeSectionId);

  const handleOpenCreateSection = () => {
    setSecName('');
    setSecIcon('📁');
    setSectionModalMode('create');
    setIsEditingSection(true);
  };

  const handleOpenEditSection = (id: string, name: string, icon: string) => {
    setTargetEditSecId(id);
    setSecName(name);
    setSecIcon(icon);
    setSectionModalMode('edit');
    setIsEditingSection(true);
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secName.trim()) return;

    if (sectionModalMode === 'create') {
      const created = addSection(secName.trim(), secIcon);
      setSearchParams({ section: created.id });
      showToast(`Created section "${created.name}"`);
    } else if (targetEditSecId) {
      updateSection(targetEditSecId, secName.trim(), secIcon);
      showToast('Section updated');
    }

    setIsEditingSection(false);
  };

  const handleDeleteCurrentSection = (id: string) => {
    const sec = sections.find((s) => s.id === id);
    if (window.confirm(`Delete section "${sec?.name}"? Items inside will remain in your library.`)) {
      deleteSection(id);
      setSearchParams({});
      showToast('Section deleted');
    }
  };

  const EMOJI_OPTIONS = ['📁', '🔥', '⭐', '🎬', '🍿', '📺', '🌸', '🏆', '💎', '🎯', '🚀', '🔮'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>{activeSection ? `${activeSection.icon} ${activeSection.name}` : '📚 All Library Titles'}</span>
            <span className="text-sm font-semibold text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-white/5">
              {filteredItems.length}
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Organize films, series and anime into custom folders and rate each from 0/10.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSection && (
            <>
              <button
                type="button"
                onClick={() => handleOpenEditSection(activeSection.id, activeSection.name, activeSection.icon)}
                className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-white/5 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Folder
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCurrentSection(activeSection.id)}
                className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-semibold border border-red-500/20 transition-colors cursor-pointer"
                title="Delete Section"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            type="button"
            onClick={handleOpenCreateSection}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Folder
          </button>
        </div>
      </div>

      {/* Sections Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/5">
        <button
          type="button"
          onClick={() => setSearchParams({})}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
            !activeSectionId
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          <span>📁</span>
          <span>All Items ({library.length})</span>
        </button>

        {sections.map((sec) => {
          const count = library.filter((i) => i.sectionId === sec.id).length;
          const isSelected = activeSectionId === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setSearchParams({ section: sec.id })}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span>{sec.icon}</span>
              <span>{sec.name}</span>
              <span className="text-[10px] opacity-75 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/50 p-3 rounded-2xl border border-white/5">
        {/* Type Filter */}
        <div className="flex items-center gap-1">
          {(['all', 'movie', 'tv', 'anime'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                typeFilter === t
                  ? 'bg-white/10 text-purple-300 font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t === 'tv' ? 'TV Series' : t}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-white/10 text-xs text-zinc-300 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="rating_desc">Highest Rated (10 → 0)</option>
            <option value="rating_asc">Lowest Rated (0 → 10)</option>
            <option value="date_desc">Recently Added</option>
            <option value="title_asc">Title (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-24 text-center space-y-3 bg-zinc-900/20 rounded-3xl border border-white/5">
          <span className="text-5xl">🎬</span>
          <h3 className="text-lg font-bold text-white">No titles in this folder</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Use Search to find movies, shows or anime and add them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <PosterCard
              key={item.id}
              item={item}
              onClick={() => setActiveItem(item)}
              sectionName={sections.find((s) => s.id === item.sectionId)?.name}
              isLibrary
            />
          ))}
        </div>
      )}

      {/* Title Detail Modal */}
      <TitleDetailModal
        item={activeItem}
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        onToast={showToast}
      />

      {/* Create / Edit Section Modal */}
      <AnimatePresence>
        {isEditingSection && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsEditingSection(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-2xl p-6 text-zinc-100 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">
                {sectionModalMode === 'create' ? 'Create New Folder' : 'Edit Folder'}
              </h3>
              <form onSubmit={handleSaveSection} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    value={secName}
                    onChange={(e) => setSecName(e.target.value)}
                    placeholder="e.g. Masterpieces, Weekend Binge..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white focus:outline-none focus:border-purple-500"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">
                    Icon / Emoji
                  </label>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSecIcon(emoji)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer ${
                          secIcon === emoji
                            ? 'bg-purple-600 scale-110 shadow-lg'
                            : 'bg-zinc-800 hover:bg-zinc-700'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingSection(false)}
                    className="px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
