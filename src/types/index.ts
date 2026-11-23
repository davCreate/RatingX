export type MediaType = 'movie' | 'tv' | 'anime';

export interface Section {
  id: string;
  name: string;
  icon: string;
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
  rating: number | null; // 0 to 10
  note: string;
  addedAt: number;
  ratedAt: number | null;
  genres?: string[];
}

export interface UserProfile {
  username: string;
  bio: string;
  avatarUrl: string;
  bannerUrl?: string;
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
}
