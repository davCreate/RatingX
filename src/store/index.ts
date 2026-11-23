import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Section, LibraryItem, UserProfile, MediaType, WatchStatus } from '../types';

export type AppTheme = 'dark' | 'oled' | 'cyberpunk' | 'light';

interface AppState {
  theme: AppTheme;
  tmdbApiKey: string;
  sections: Section[];
  library: LibraryItem[];
  profile: UserProfile;
  recentSearches: string[];
  selectedSectionId: string | null;

  // Actions
  setTheme: (theme: AppTheme) => void;
  setTmdbApiKey: (key: string) => void;
  setSelectedSectionId: (id: string | null) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // Sections
  addSection: (name: string, icon?: string, color?: string) => Section;
  updateSection: (id: string, name: string, icon?: string, color?: string) => void;
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
    tags?: string[];
    watchStatus?: WatchStatus;
    trailerUrl?: string | null;
    genres?: string[];
  }) => LibraryItem;

  updateRating: (itemId: string, rating: number | null, note?: string) => void;
  toggleFavorite: (itemId: string) => void;
  updateWatchStatus: (itemId: string, status: WatchStatus) => void;
  updateItemTags: (itemId: string, tags: string[]) => void;
  moveItemSection: (itemId: string, sectionId: string) => void;
  removeFromLibrary: (itemId: string) => void;

  // Profile Customization
  updateProfile: (profile: Partial<UserProfile>) => void;
  togglePinnedFavorite: (externalId: string) => void;

  // Backup / Restore
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  clearAllData: () => void;
}

const DEFAULT_SECTIONS: Section[] = [
  { id: 'sec-watching', name: 'Currently Watching', icon: '▶️', color: '#8B5CF6', order: 0, createdAt: Date.now() },
  { id: 'sec-completed', name: 'Completed & Rated', icon: '⭐', color: '#10B981', order: 1, createdAt: Date.now() },
  { id: 'sec-watchlist', name: 'Plan to Watch', icon: '🔖', color: '#F59E0B', order: 2, createdAt: Date.now() },
  { id: 'sec-favorites', name: 'All Time Favorites', icon: '🔥', color: '#EF4444', order: 3, createdAt: Date.now() },
  { id: 'sec-anime', name: 'Anime Universe', icon: '🌸', color: '#EC4899', order: 4, createdAt: Date.now() },
];

const DEFAULT_PROFILE: UserProfile = {
  displayName: 'Alex Mercer',
  username: 'CinephileX',
  bio: 'Rating everything from golden age cinema to seasonal anime. Tracking every story that leaves a mark on the soul.',
  location: 'Tokyo / Worldwide',
  pronouns: 'they/them',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  avatarFrame: 'neon-purple',
  bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
  bannerType: 'image',
  accentColor: '#8B5CF6',
  favoriteQuote: '“No amount of money ever bought a second of time.” — Tony Stark',
  pinnedFavorites: ['tmdb-157336', 'anime-16498', 'tmdb-1396', 'anime-5114'],
  socialLinks: {
    twitter: 'https://x.com',
    discord: 'Cinephile#0001',
    letterboxd: 'https://letterboxd.com',
    mal: 'https://myanimelist.net',
  },
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
    note: 'Absolute cinema. Zimmer\'s organ score and the depiction of relativity are transcendent.',
    tags: ['Sci-Fi', 'Christopher Nolan', 'Masterpiece', 'Hans Zimmer'],
    watchStatus: 'completed',
    favorite: true,
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    duration: '169 min',
    addedAt: Date.now() - 86400000 * 5,
    ratedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'item-2',
    externalId: 'anime-16498',
    mediaType: 'anime',
    title: 'Attack on Titan',
    posterPath: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/hP0j8p0oR0uEaOq9rK4s9Z1F3hX.jpg',
    year: '2013',
    overview: 'Centuries ago, mankind was slaughtered by monstrous humanoid creatures called Titans.',
    sectionId: 'sec-completed',
    rating: 9.8,
    note: 'Peak fictional narrative. From season 1 mystery to political warfare and moral complexity.',
    tags: ['Masterpiece', 'Plot Twists', 'Action', 'Dark Fantasy'],
    watchStatus: 'completed',
    favorite: true,
    trailerUrl: 'https://www.youtube.com/watch?v=MGRm4IzK1SQ',
    genres: ['Action', 'Fantasy', 'Suspense'],
    episodes: 87,
    addedAt: Date.now() - 86400000 * 3,
    ratedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'item-3',
    externalId: 'tmdb-1396',
    mediaType: 'tv',
    title: 'Breaking Bad',
    posterPath: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    year: '2008',
    overview: 'A chemistry teacher diagnosed with lung cancer turns to manufacturing methamphetamine.',
    sectionId: 'sec-favorites',
    rating: 9.9,
    note: 'The benchmark of prestige television drama. Unforgiving pacing and character descent.',
    tags: ['Prestige TV', 'Vince Gilligan', 'Character Study'],
    watchStatus: 'completed',
    favorite: true,
    trailerUrl: 'https://www.youtube.com/watch?v=HhesaQXLuRY',
    genres: ['Crime', 'Drama', 'Thriller'],
    episodes: 62,
    addedAt: Date.now() - 86400000 * 10,
    ratedAt: Date.now() - 86400000 * 8,
  },
  {
    id: 'item-4',
    externalId: 'anime-5114',
    mediaType: 'anime',
    title: 'Fullmetal Alchemist: Brotherhood',
    posterPath: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg',
    year: '2009',
    overview: 'Two brothers lose their bodies attempting forbidden human alchemy.',
    sectionId: 'sec-anime',
    rating: 9.5,
    note: 'Flawless shonen structure with incredible philosophical themes.',
    tags: ['Classic', 'Philosophy', 'Brotherhood'],
    watchStatus: 'completed',
    favorite: false,
    genres: ['Action', 'Adventure', 'Drama', 'Fantasy'],
    episodes: 64,
    addedAt: Date.now() - 86400000 * 12,
    ratedAt: Date.now() - 86400000 * 11,
  },
  {
    id: 'item-5',
    externalId: 'tmdb-27205',
    mediaType: 'movie',
    title: 'Inception',
    posterPath: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    year: '2010',
    overview: 'A thief who steals corporate secrets through dream-sharing technology.',
    sectionId: 'sec-favorites',
    rating: 9.2,
    note: 'Mind-bending premise executed with precision.',
    tags: ['Sci-Fi', 'Heist', 'Mind Game'],
    watchStatus: 'completed',
    favorite: false,
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    duration: '148 min',
    addedAt: Date.now() - 86400000 * 15,
    ratedAt: Date.now() - 86400000 * 14,
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
      recentSearches: ['Inception', 'Attack on Titan', 'Oppenheimer', 'Breaking Bad'],
      selectedSectionId: null,

      setTheme: (theme) => set({ theme }),
      setTmdbApiKey: (key) => set({ tmdbApiKey: key }),
      setSelectedSectionId: (id) => set({ selectedSectionId: id }),

      addRecentSearch: (query) => {
        const q = query.trim();
        if (!q) return;
        const filtered = get().recentSearches.filter((item) => item.toLowerCase() !== q.toLowerCase());
        set({ recentSearches: [q, ...filtered].slice(0, 8) });
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      addSection: (name, icon = '📁', color = '#8B5CF6') => {
        const newSec: Section = {
          id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: name.trim(),
          icon,
          color,
          order: get().sections.length,
          createdAt: Date.now(),
        };
        set({ sections: [...get().sections, newSec] });
        return newSec;
      },

      updateSection: (id, name, icon, color) => {
        set({
          sections: get().sections.map((sec) =>
            sec.id === id
              ? {
                  ...sec,
                  name: name.trim(),
                  ...(icon ? { icon } : {}),
                  ...(color ? { color } : {}),
                }
              : sec
          ),
        });
      },

      deleteSection: (id) => {
        const { sections, library, selectedSectionId } = get();
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
          set({
            library: get().library.map((i) =>
              i.id === existing.id
                ? {
                    ...i,
                    sectionId: itemData.sectionId,
                    rating: itemData.rating !== undefined ? itemData.rating : i.rating,
                    note: itemData.note !== undefined ? itemData.note : i.note,
                    tags: itemData.tags || i.tags,
                    watchStatus: itemData.watchStatus || i.watchStatus,
                    trailerUrl: itemData.trailerUrl || i.trailerUrl,
                    genres: itemData.genres || i.genres,
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
          tags: itemData.tags || [],
          watchStatus: itemData.watchStatus || 'completed',
          favorite: false,
          trailerUrl: itemData.trailerUrl || null,
          genres: itemData.genres || [],
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

      toggleFavorite: (itemId) => {
        set({
          library: get().library.map((item) =>
            item.id === itemId ? { ...item, favorite: !item.favorite } : item
          ),
        });
      },

      updateWatchStatus: (itemId, status) => {
        set({
          library: get().library.map((item) =>
            item.id === itemId ? { ...item, watchStatus: status } : item
          ),
        });
      },

      updateItemTags: (itemId, tags) => {
        set({
          library: get().library.map((item) =>
            item.id === itemId ? { ...item, tags } : item
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

      togglePinnedFavorite: (externalId) => {
        const { pinnedFavorites } = get().profile;
        let newPinned = [...pinnedFavorites];
        if (newPinned.includes(externalId)) {
          newPinned = newPinned.filter((id) => id !== externalId);
        } else {
          if (newPinned.length >= 4) {
            newPinned.shift(); // keep max 4 pinned
          }
          newPinned.push(externalId);
        }
        set({
          profile: { ...get().profile, pinnedFavorites: newPinned },
        });
      },

      exportData: () => {
        const state = get();
        const exportObj = {
          version: '1.2.0',
          exportedAt: new Date().toISOString(),
          profile: state.profile,
          sections: state.sections,
          library: state.library,
          theme: state.theme,
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
              profile: { ...get().profile, ...(parsed.profile || {}) },
              theme: parsed.theme || get().theme,
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
      name: 'ratingx-store-v3',
    }
  )
);
