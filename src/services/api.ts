import { SearchResult, MediaType } from '../types';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

// Public demo TMDB read-only v3 key for direct metadata & posters if user has not set their own
const FALLBACK_TMDB_KEY = '4544d6db8741369aeebff17482613d96';

export const POPULAR_CATALOG: SearchResult[] = [
  {
    id: 'tmdb-157336',
    mediaType: 'movie',
    title: 'Interstellar',
    posterPath: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    year: '2014',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    voteAverage: 8.4,
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    duration: '169 min'
  },
  {
    id: 'tmdb-27205',
    mediaType: 'movie',
    title: 'Inception',
    posterPath: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    year: '2010',
    overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets, is offered a chance to regain his old life as payment for an impossible task: "inception".',
    voteAverage: 8.4,
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    duration: '148 min'
  },
  {
    id: 'tmdb-155',
    mediaType: 'movie',
    title: 'The Dark Knight',
    posterPath: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/oO2w81z3eDbg95BglGZ8vWzQzKk.jpg',
    year: '2008',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
    voteAverage: 9.0,
    genres: ['Action', 'Crime', 'Drama'],
    trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    duration: '152 min'
  },
  {
    id: 'tmdb-550',
    mediaType: 'movie',
    title: 'Fight Club',
    posterPath: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    year: '1999',
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
    voteAverage: 8.4,
    genres: ['Drama', 'Thriller'],
    trailerUrl: 'https://www.youtube.com/watch?v=qtRKdVHc-cE',
    duration: '139 min'
  },
  {
    id: 'tmdb-1396',
    mediaType: 'tv',
    title: 'Breaking Bad',
    posterPath: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    year: '2008',
    overview: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student in order to secure his family\'s future.',
    voteAverage: 8.9,
    genres: ['Crime', 'Drama', 'Thriller'],
    trailerUrl: 'https://www.youtube.com/watch?v=HhesaQXLuRY',
    episodes: 62
  },
  {
    id: 'tmdb-1399',
    mediaType: 'tv',
    title: 'Game of Thrones',
    posterPath: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg',
    year: '2011',
    overview: 'Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war.',
    voteAverage: 8.4,
    genres: ['Drama', 'Fantasy', 'Adventure'],
    trailerUrl: 'https://www.youtube.com/watch?v=KPLWWIOCOOQ',
    episodes: 73
  },
  {
    id: 'tmdb-66732',
    mediaType: 'tv',
    title: 'Stranger Things',
    posterPath: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    year: '2016',
    overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    voteAverage: 8.6,
    genres: ['Sci-Fi', 'Mystery', 'Drama'],
    trailerUrl: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
    episodes: 34
  },
  {
    id: 'anime-16498',
    mediaType: 'anime',
    title: 'Attack on Titan (Shingeki no Kyojin)',
    posterPath: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/hP0j8p0oR0uEaOq9rK4s9Z1F3hX.jpg',
    year: '2013',
    overview: 'Centuries ago, mankind was slaughtered by monstrous humanoid creatures called Titans. Young Eren Yeager vows to cleanse the earth of Titans after his home is destroyed.',
    voteAverage: 9.0,
    genres: ['Action', 'Fantasy', 'Suspense'],
    trailerUrl: 'https://www.youtube.com/watch?v=MGRm4IzK1SQ',
    episodes: 87
  },
  {
    id: 'anime-5114',
    mediaType: 'anime',
    title: 'Fullmetal Alchemist: Brotherhood',
    posterPath: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/m9m0a1f9ZkX8eGk6vO1yZ7O8g8L.jpg',
    year: '2009',
    overview: 'Two brothers lose their bodies attempting forbidden human alchemy. They embark on a quest to locate the Philosopher\'s Stone to restore themselves.',
    voteAverage: 9.1,
    genres: ['Action', 'Adventure', 'Drama', 'Fantasy'],
    trailerUrl: 'https://www.youtube.com/watch?v=--IcmZkvL0Q',
    episodes: 64
  },
  {
    id: 'anime-21',
    mediaType: 'anime',
    title: 'One Piece',
    posterPath: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    year: '1999',
    overview: 'Monkey D. Luffy embarks with his pirate crew across the Grand Line to find the legendary treasure One Piece and become the Pirate King.',
    voteAverage: 8.9,
    genres: ['Action', 'Adventure', 'Fantasy'],
    trailerUrl: 'https://www.youtube.com/watch?v=MCb13lbKPsE',
    episodes: 1100
  },
  {
    id: 'anime-38000',
    mediaType: 'anime',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    posterPath: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/nTvM4mhqZlHIvUkI1gq29umCOn7.jpg',
    year: '2019',
    overview: 'A family is attacked by demons and only two members survive: Tanjiro and his sister Nezuko, who is turning into a demon. Tanjiro embarks on a dangerous path to cure her.',
    voteAverage: 8.5,
    genres: ['Action', 'Fantasy'],
    trailerUrl: 'https://www.youtube.com/watch?v=VQGCKyvzIM4',
    episodes: 55
  },
  {
    id: 'anime-40748',
    mediaType: 'anime',
    title: 'Jujutsu Kaisen',
    posterPath: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/gmECX1DvYGDv3eTiiR6FEI1k6v6.jpg',
    year: '2020',
    overview: 'A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman\'s school to be able to locate the demon\'s other body parts and exorcise himself.',
    voteAverage: 8.6,
    genres: ['Action', 'Supernatural'],
    trailerUrl: 'https://www.youtube.com/watch?v=f7T48W04ea4',
    episodes: 47
  }
];

export async function searchTitles(
  query: string,
  filterType: 'all' | MediaType = 'all',
  tmdbApiKey?: string
): Promise<SearchResult[]> {
  const cleanQuery = query.trim().toLowerCase();

  if (!cleanQuery) {
    return POPULAR_CATALOG.filter((item) => filterType === 'all' || item.mediaType === filterType);
  }

  const results: SearchResult[] = [];
  const effectiveKey = tmdbApiKey?.trim() || FALLBACK_TMDB_KEY;

  // 1. TMDB Multi Search
  if (filterType === 'all' || filterType === 'movie' || filterType === 'tv') {
    try {
      const tmdbUrl = `https://api.themoviedb.org/3/search/multi?api_key=${effectiveKey}&query=${encodeURIComponent(cleanQuery)}&include_adult=false`;
      const res = await fetch(tmdbUrl);
      if (res.ok) {
        const data = await res.json();
        for (const item of data.results || []) {
          if (item.media_type !== 'movie' && item.media_type !== 'tv') continue;
          if (filterType !== 'all' && item.media_type !== filterType) continue;

          results.push({
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
      }
    } catch {
      // Ignore network errors and continue
    }
  }

  // 2. Jikan Anime Search
  if (filterType === 'all' || filterType === 'anime') {
    try {
      const animeUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(cleanQuery)}&limit=12&sfw=true`;
      const animeRes = await fetch(animeUrl);
      if (animeRes.ok) {
        const animeData = await animeRes.json();
        for (const anime of animeData.data || []) {
          results.push({
            id: `anime-${anime.mal_id}`,
            mediaType: 'anime',
            title: anime.title_english || anime.title || 'Untitled Anime',
            posterPath: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || null,
            backdropPath: anime.images?.jpg?.large_image_url || null,
            year: anime.year ? String(anime.year) : anime.aired?.from ? anime.aired.from.substring(0, 4) : 'N/A',
            overview: anime.synopsis || '',
            voteAverage: anime.score ? Math.round(anime.score * 10) / 10 : undefined,
            genres: anime.genres?.map((g: { name: string }) => g.name) || [],
            trailerUrl: anime.trailer?.url || (anime.trailer?.youtube_id ? `https://www.youtube.com/watch?v=${anime.trailer.youtube_id}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(anime.title + ' anime trailer')}`),
            episodes: anime.episodes || undefined,
          });
        }
      }
    } catch {
      // Ignore network errors
    }
  }

  // 3. Fallback matching against preloaded catalog
  const localMatches = POPULAR_CATALOG.filter((item) => {
    const matchesFilter = filterType === 'all' || item.mediaType === filterType;
    const matchesQuery =
      item.title.toLowerCase().includes(cleanQuery) || item.overview.toLowerCase().includes(cleanQuery);
    return matchesFilter && matchesQuery;
  });

  for (const item of localMatches) {
    if (!results.some((r) => r.id === item.id)) {
      results.push(item);
    }
  }

  return results;
}

export async function fetchLiveTrending(category: 'all' | MediaType = 'all'): Promise<SearchResult[]> {
  const trending: SearchResult[] = [];

  // Fetch real top anime from Jikan
  if (category === 'all' || category === 'anime') {
    try {
      const res = await fetch('https://api.jikan.moe/v4/top/anime?filter=bypopularity&limit=10');
      if (res.ok) {
        const json = await res.json();
        for (const item of json.data || []) {
          trending.push({
            id: `anime-${item.mal_id}`,
            mediaType: 'anime',
            title: item.title_english || item.title,
            posterPath: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url,
            backdropPath: item.images?.jpg?.large_image_url,
            year: item.year ? String(item.year) : item.aired?.from ? item.aired.from.substring(0, 4) : 'N/A',
            overview: item.synopsis || '',
            voteAverage: item.score || 8.5,
            genres: item.genres?.map((g: { name: string }) => g.name) || [],
            trailerUrl: item.trailer?.url || null,
            episodes: item.episodes,
          });
        }
      }
    } catch {
      // fallback
    }
  }

  // Fetch real trending movies/shows from TMDB
  if (category === 'all' || category === 'movie' || category === 'tv') {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${FALLBACK_TMDB_KEY}`);
      if (res.ok) {
        const json = await res.json();
        for (const item of json.results || []) {
          if (item.media_type !== 'movie' && item.media_type !== 'tv') continue;
          if (category !== 'all' && item.media_type !== category) continue;
          trending.push({
            id: `tmdb-${item.id}`,
            mediaType: item.media_type as MediaType,
            title: item.title || item.name || 'Untitled',
            posterPath: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null,
            backdropPath: item.backdrop_path ? `${TMDB_BACKDROP_BASE}${item.backdrop_path}` : null,
            year: (item.release_date || item.first_air_date || '').substring(0, 4) || '2024',
            overview: item.overview || '',
            voteAverage: item.vote_average ? Math.round(item.vote_average * 10) / 10 : undefined,
            trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent((item.title || item.name) + ' official trailer')}`,
          });
        }
      }
    } catch {
      // fallback
    }
  }

  if (trending.length === 0) {
    return POPULAR_CATALOG.filter((i) => category === 'all' || i.mediaType === category);
  }

  return trending.filter((i) => category === 'all' || i.mediaType === category);
}

export function getFeatured(): SearchResult[] {
  return POPULAR_CATALOG;
}
