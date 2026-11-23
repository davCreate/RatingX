export type MediaType = 'movie' | 'tv' | 'anime';

export type WatchStatus = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';

export interface Section {
  id: string;
  name: string;
  icon: string;
  color?: string;
  order: number;
  createdAt: number;
}

export interface LibraryItem {
  id: string;
  externalId: string | number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath?: string | null;
  year: string;
  overview: string;
  sectionId: string;
  rating: number | null; // 0.0 to 10.0
  note: string;
  tags?: string[];
  watchStatus?: WatchStatus;
  favorite?: boolean;
  trailerUrl?: string | null;
  genres?: string[];
  director?: string;
  cast?: string[];
  duration?: string;
  episodes?: number;
  addedAt: number;
  ratedAt: number | null;
}

export interface SocialLinks {
  twitter?: string;
  discord?: string;
  instagram?: string;
  letterboxd?: string;
  imdb?: string;
  mal?: string;
}

export interface UserProfile {
  displayName: string;
  username: string;
  bio: string;
  location?: string;
  pronouns?: string;
  avatarUrl: string;
  avatarFrame?: string; // 'none' | 'gold' | 'neon-purple' | 'emerald' | 'cyberpunk'
  bannerUrl: string;
  bannerType?: 'image' | 'gradient';
  accentColor: string; // Hex color code for user's profile theme
  favoriteQuote?: string;
  pinnedFavorites: string[]; // Up to 4 externalId strings pinned to profile top
  socialLinks: SocialLinks;
  createdAt: number;
}

export interface SearchResult {
  id: string | number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  backdropPath?: string | null;
  year: string;
  overview: string;
  voteAverage?: number;
  genres?: string[];
  trailerUrl?: string | null;
  duration?: string;
  episodes?: number;
}

export interface CatalogGenre {
  id: string;
  name: string;
  icon: string;
}
