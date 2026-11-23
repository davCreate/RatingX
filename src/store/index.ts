import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Section, LibraryItem, UserProfile, MediaType } from '../types';

interface AppState {
  theme: 'dark' | 'light';
  tmdbApiKey: string;
  sections: Section[];
  library: LibraryItem[];
  profile: UserProfile;
  selectedSectionId: string | null;

  // Actions
  setTheme: (theme: 'dark' | 'light') => void;
  setTmdbApiKey: (key: string) => void;
  setSelectedSectionId: (id: string | null) => void;

  // Sections
  addSection: (name: string, icon?: string) => Section;
  updateSection: (id: string, name: string, icon?: string) => void;
  deleteSection: (id: string) => void;
  reorderSections: (newSections: Section[]) => void;

  // Library Items
  addToLibrary: (item: {
    externalId: string | number;
    mediaType: MediaType;
    title: string;
    posterPath: string | null;
    backdropPath?: string | null;
    year: string;
    overview: string;
    sectionId: string;
    rating?: number | null;
    note?: string;
  }) => LibraryItem;
  updateRating: (itemId: string, rating: number | null, note?: string) => void;
  moveItemSection: (itemId: string, sectionId: string) => void;
  removeFromLibrary: (itemId: string) => void;

  // Profile
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Backup / Restore
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  clearAllData: () => void;
}

const DEFAULT_SECTIONS: Section[] = [
  { id: 'sec-watching', name: 'Currently Watching', icon: '▶️', order: 0, createdAt: Date.now() },
  { id: 'sec-completed', name: 'Completed & Rated', icon: '⭐', order: 1, createdAt: Date.now() },
  { id: 'sec-watchlist', name: 'Plan to Watch', icon: '🔖', order: 2, createdAt: Date.now() },
  { id: 'sec-favorites', name: 'All Time Favorites', icon: '🔥', order: 3, createdAt: Date.now() },
];

const DEFAULT_PROFILE: UserProfile = {
  username: 'FilmEnthusiast',
  bio: 'Cinema lover, binge watcher, anime collector. Here is my rated catalog!',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
  createdAt: Date.now(),
};

const INITIAL_ITEMS: LibraryItem[] = [
  {
    id: 'item-1',
    externalId: 'tmdb-157336',
    mediaType: 'movie',
    title: 'Interstellar',
    posterPath: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    year: '2014',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole.',
    sectionId: 'sec-favorites',
    rating: 10,
    note: 'Masterpiece. The soundtrack and visuals are beyond compare.',
    addedAt: Date.now() - 86400000 * 5,
    ratedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'item-2',
    externalId: 'anime-16498',
    mediaType: 'anime',
    title: 'Attack on Titan',
    posterPath: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
    year: '2013',
    overview: 'Centuries ago, mankind was slaughtered by monstrous humanoid creatures called Titans.',
    sectionId: 'sec-completed',
    rating: 9.5,
    note: 'One of the best narratives written in anime history.',
    addedAt: Date.now() - 86400000 * 3,
    ratedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'item-3',
    externalId: 'tmdb-1396',
    mediaType: 'tv',
    title: 'Breaking Bad',
    posterPath: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
    year: '2008',
    overview: 'A chemistry teacher diagnosed with lung cancer turns to manufacturing methamphetamine.',
    sectionId: 'sec-favorites',
    rating: 9.8,
    note: 'Unmatched character arcs and tension.',
    addedAt: Date.now() - 86400000 * 10,
    ratedAt: Date.now() - 86400000 * 8,
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      tmdbApiKey: '',
      sections: DEFAULT_SECTIONS,
      library: INITIAL_ITEMS,
      profile: DEFAULT_PROFILE,
      selectedSectionId: null,

      setTheme: (theme) => set({ theme }),
      setTmdbApiKey: (key) => set({ tmdbApiKey: key }),
      setSelectedSectionId: (id) => set({ selectedSectionId: id }),

      addSection: (name, icon = '📁') => {
        const newSec: Section = {
          id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: name.trim(),
          icon,
          order: get().sections.length,
          createdAt: Date.now(),
        };
        set({ sections: [...get().sections, newSec] });
        return newSec;
      },

      updateSection: (id, name, icon) => {
        set({
          sections: get().sections.map((sec) =>
            sec.id === id ? { ...sec, name: name.trim(), ...(icon ? { icon } : {}) } : sec
          ),
        });
      },

      deleteSection: (id) => {
        const { sections, library, selectedSectionId } = get();
        // Remove section and assign its items to first available section or delete
        const remainingSections = sections.filter((s) => s.id !== id);
        const fallbackSectionId = remainingSections[0]?.id || 'default';

        set({
          sections: remainingSections,
          library: library.map((item) =>
            item.sectionId === id ? { ...item, sectionId: fallbackSectionId } : item
          ),
          selectedSectionId: selectedSectionId === id ? null : selectedSectionId,
        });
      },

      reorderSections: (newSections) => {
        set({ sections: newSections });
      },

      addToLibrary: (itemData) => {
        const existing = get().library.find((i) => i.externalId === itemData.externalId);
        if (existing) {
          // If already in library, update section or rating
          set({
            library: get().library.map((i) =>
              i.id === existing.id
                ? {
                    ...i,
                    sectionId: itemData.sectionId,
                    rating: itemData.rating !== undefined ? itemData.rating : i.rating,
                    note: itemData.note !== undefined ? itemData.note : i.note,
                  }
                : i
            ),
          });
          return existing;
        }

        const newItem: LibraryItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          externalId: itemData.externalId,
          mediaType: itemData.mediaType,
          title: itemData.title,
          posterPath: itemData.posterPath,
          backdropPath: itemData.backdropPath,
          year: itemData.year,
          overview: itemData.overview,
          sectionId: itemData.sectionId,
          rating: itemData.rating ?? null,
          note: itemData.note || '',
          addedAt: Date.now(),
          ratedAt: itemData.rating !== null && itemData.rating !== undefined ? Date.now() : null,
        };

        set({ library: [newItem, ...get().library] });
        return newItem;
      },

      updateRating: (itemId, rating, note) => {
        set({
          library: get().library.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  rating,
                  note: note !== undefined ? note : item.note,
                  ratedAt: rating !== null ? Date.now() : null,
                }
              : item
          ),
        });
      },

      moveItemSection: (itemId, sectionId) => {
        set({
          library: get().library.map((item) =>
            item.id === itemId ? { ...item, sectionId } : item
          ),
        });
      },

      removeFromLibrary: (itemId) => {
        set({
          library: get().library.filter((item) => item.id !== itemId),
        });
      },

      updateProfile: (partial) => {
        set({
          profile: { ...get().profile, ...partial },
        });
      },

      exportData: () => {
        const state = get();
        const exportObj = {
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          profile: state.profile,
          sections: state.sections,
          library: state.library,
        };
        return JSON.stringify(exportObj, null, 2);
      },

      importData: (jsonStr) => {
        try {
          const parsed = JSON.parse(jsonStr);
          if (parsed.library && Array.isArray(parsed.library)) {
            set({
              sections: parsed.sections || get().sections,
              library: parsed.library,
              profile: parsed.profile || get().profile,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      clearAllData: () => {
        set({
          sections: DEFAULT_SECTIONS,
          library: [],
          profile: DEFAULT_PROFILE,
        });
      },
    }),
    {
      name: 'ratingx-store-v1',
    }
  )
);
