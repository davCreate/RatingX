import { SearchResult, MediaType } from '../types';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';
const FALLBACK_TMDB_KEY = '4544d6db8741369aeebff17482613d96';

// Stremio official Cinemeta Addon API base (Free, open public endpoints)
const STREMIO_CINEMETA_BASE = 'https://v3-cinemeta.strem.io';

export const CATALOG_GENRES = [
  { id: 'all', name: 'All Genres', icon: '✨' },
  { id: 'Action', name: 'Action', icon: '💥' },
  { id: 'Sci-Fi', name: 'Sci-Fi', icon: '🚀' },
  { id: 'Adventure', name: 'Adventure', icon: '🗺️' },
  { id: 'Animation', name: 'Animation', icon: '🌸' },
  { id: 'Comedy', name: 'Comedy', icon: '😂' },
  { id: 'Crime', name: 'Crime', icon: '🔫' },
  { id: 'Drama', name: 'Drama', icon: '🎭' },
  { id: 'Fantasy', name: 'Fantasy', icon: '🧙' },
  { id: 'Horror', name: 'Horror', icon: '👻' },
  { id: 'Mystery', name: 'Mystery', icon: '🔎' },
  { id: 'Romance', name: 'Romance', icon: '💖' },
  { id: 'Thriller', name: 'Thriller', icon: '⚡' },
];

export async function fetchStremioCatalog(
  mediaType: 'movie' | 'series',
  genre: string = 'all',
  skip: number = 0
): Promise<SearchResult[]> {
  try {
    let url = `${STREMIO_CINEMETA_BASE}/catalog/${mediaType}/top`;
    if (genre !== 'all') {
      url += `/genre=${encodeURIComponent(genre)}`;
    }
    if (skip > 0) {
      url += `/skip=${skip}`;
    }
    url += '.json';

    const res = await fetch(url);
    if (!res.ok) return [];

    const json = await res.json();
    const metas = json.metas || [];

    return metas.map((meta: any) => ({
      id: meta.imdb_id || `stremio-${meta.id}`,
      mediaType: mediaType === 'movie' ? 'movie' : 'tv',
      title: meta.name || 'Untitled',
      posterPath: meta.poster || (meta.imdb_id ? `https://images.metahub.space/poster/medium/${meta.imdb_id}/img` : null),
      backdropPath: meta.background || null,
      year: meta.year ? String(meta.year).substring(0, 4) : 'N/A',
      overview: meta.description || meta.overview || '',
      voteAverage: meta.imdbRating ? parseFloat(meta.imdbRating) : undefined,
      genres: meta.genres || (meta.genre ? meta.genre.split(', ') : []),
      trailerUrl: meta.trailer ? `https://www.youtube.com/watch?v=${meta.trailer}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(meta.name + ' trailer')}`,
    }));
  } catch {
    return [];
  }
}

export async function fetchStremioSearch(
  query: string,
  mediaType: 'movie' | 'series'
): Promise<SearchResult[]> {
  try {
    const url = `${STREMIO_CINEMETA_BASE}/catalog/${mediaType}/top/search=${encodeURIComponent(query)}.json`;
    const res = await fetch(url);
    if (!res.ok) return [];

    const json = await res.json();
    const metas = json.metas || [];

    return metas.map((meta: any) => ({
      id: meta.imdb_id || `stremio-${meta.id}`,
      mediaType: mediaType === 'movie' ? 'movie' : 'tv',
      title: meta.name || 'Untitled',
      posterPath: meta.poster || (meta.imdb_id ? `https://images.metahub.space/poster/medium/${meta.imdb_id}/img` : null),
      backdropPath: meta.background || null,
      year: meta.year ? String(meta.year).substring(0, 4) : 'N/A',
      overview: meta.description || meta.overview || '',
      voteAverage: meta.imdbRating ? parseFloat(meta.imdbRating) : undefined,
      genres: meta.genres || [],
      trailerUrl: meta.trailer ? `https://www.youtube.com/watch?v=${meta.trailer}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(meta.name + ' trailer')}`,
    }));
  } catch {
    return [];
  }
}

export async function searchTitles(
  query: string,
  filterType: 'all' | MediaType = 'all',
  tmdbApiKey?: string
): Promise<SearchResult[]> {
  const cleanQuery = query.trim();

  // If empty query, load Stremio popular catalog
  if (!cleanQuery) {
    if (filterType === 'anime') {
      return fetchAnimeCatalog(1);
    }
    const stremioType = filterType === 'tv' ? 'series' : 'movie';
    const stremioResults = await fetchStremioCatalog(stremioType, 'all', 0);
    return stremioResults.slice(0, 24);
  }

  const results: SearchResult[] = [];
  const seenIds = new Set<string>();

  // 1. Query Stremio Cinemeta catalog search
  const stremioPromises: Promise<SearchResult[]>[] = [];
  if (filterType === 'all' || filterType === 'movie') {
    stremioPromises.push(fetchStremioSearch(cleanQuery, 'movie'));
  }
  if (filterType === 'all' || filterType === 'tv') {
    stremioPromises.push(fetchStremioSearch(cleanQuery, 'series'));
  }

  // 2. Query Jikan for Anime
  if (filterType === 'all' || filterType === 'anime') {
    const animePromise = fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(cleanQuery)}&limit=15&sfw=true`
    )
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((json) =>
        (json.data || []).map((anime: any) => ({
          id: `anime-${anime.mal_id}`,
          mediaType: 'anime' as MediaType,
          title: anime.title_english || anime.title || 'Untitled Anime',
          posterPath: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || null,
          backdropPath: anime.images?.jpg?.large_image_url || null,
          year: anime.year ? String(anime.year) : anime.aired?.from ? anime.aired.from.substring(0, 4) : 'N/A',
          overview: anime.synopsis || '',
          voteAverage: anime.score ? Math.round(anime.score * 10) / 10 : undefined,
          genres: anime.genres?.map((g: any) => g.name) || [],
          trailerUrl: anime.trailer?.url || null,
          episodes: anime.episodes,
        }))
      )
      .catch(() => []);
    stremioPromises.push(animePromise);
  }

  // 3. Query TMDB Multi Search
  const effectiveKey = tmdbApiKey?.trim() || FALLBACK_TMDB_KEY;
  const tmdbPromise = fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${effectiveKey}&query=${encodeURIComponent(cleanQuery)}&include_adult=false`
  )
    .then((r) => (r.ok ? r.json() : { results: [] }))
    .then((json) => {
      const items: SearchResult[] = [];
      for (const item of json.results || []) {
        if (item.media_type !== 'movie' && item.media_type !== 'tv') continue;
        if (filterType !== 'all' && item.media_type !== filterType) continue;

        items.push({
          id: `tmdb-${item.id}`,
          mediaType: item.media_type as MediaType,
          title: item.title || item.name || 'Untitled',
          posterPath: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null,
          backdropPath: item.backdrop_path ? `${TMDB_BACKDROP_BASE}${item.backdrop_path}` : null,
          year: (item.release_date || item.first_air_date || '').substring(0, 4) || 'N/A',
          overview: item.overview || '',
          voteAverage: item.vote_average ? Math.round(item.vote_average * 10) / 10 : undefined,
          trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent((item.title || item.name) + ' official trailer')}`,
        });
      }
      return items;
    })
    .catch(() => []);

  stremioPromises.push(tmdbPromise);

  const settled = await Promise.allSettled(stremioPromises);
  for (const res of settled) {
    if (res.status === 'fulfilled' && Array.isArray(res.value)) {
      for (const item of res.value) {
        const key = `${item.title.toLowerCase()}-${item.year}`;
        if (!seenIds.has(key)) {
          seenIds.add(key);
          results.push(item);
        }
      }
    }
  }

  return results;
}

export async function fetchAnimeCatalog(page: number = 1): Promise<SearchResult[]> {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/top/anime?filter=bypopularity&page=${page}&limit=24`);
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).map((anime: any) => ({
      id: `anime-${anime.mal_id}`,
      mediaType: 'anime' as MediaType,
      title: anime.title_english || anime.title,
      posterPath: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url,
      backdropPath: anime.images?.jpg?.large_image_url,
      year: anime.year ? String(anime.year) : anime.aired?.from ? anime.aired.from.substring(0, 4) : 'N/A',
      overview: anime.synopsis || '',
      voteAverage: anime.score || undefined,
      genres: anime.genres?.map((g: any) => g.name) || [],
      trailerUrl: anime.trailer?.url || null,
      episodes: anime.episodes,
    }));
  } catch {
    return [];
  }
}

export async function fetchWorldwideCatalog(
  category: 'all' | 'movie' | 'tv' | 'anime',
  genre: string = 'all',
  page: number = 0
): Promise<SearchResult[]> {
  const skip = page * 24;

  if (category === 'anime') {
    return fetchAnimeCatalog(page + 1);
  }

  if (category === 'movie') {
    return fetchStremioCatalog('movie', genre, skip);
  }

  if (category === 'tv') {
    return fetchStremioCatalog('series', genre, skip);
  }

  // 'all' category: combine movies and series
  const [movies, series, anime] = await Promise.all([
    fetchStremioCatalog('movie', genre, skip),
    fetchStremioCatalog('series', genre, skip),
    page === 0 ? fetchAnimeCatalog(1) : Promise.resolve([]),
  ]);

  const combined: SearchResult[] = [];
  const maxLen = Math.max(movies.length, series.length, anime.length);
  for (let i = 0; i < maxLen; i++) {
    if (movies[i]) combined.push(movies[i]);
    if (series[i]) combined.push(series[i]);
    if (anime[i]) combined.push(anime[i]);
  }

  return combined;
}

export const fetchLiveTrending = (category: 'all' | MediaType = 'all') =>
  fetchWorldwideCatalog(category, 'all', 0);

