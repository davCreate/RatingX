import { SearchResult, MediaType } from '../types';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';

// Curated popular items when offline or browsing initial state
const POPULAR_CATALOG: SearchResult[] = [
  {
    id: 'tmdb-550',
    mediaType: 'movie',
    title: 'Fight Club',
    posterPath: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    year: '1999',
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
    voteAverage: 8.4,
    genres: ['Drama', 'Thriller']
  },
  {
    id: 'tmdb-157336',
    mediaType: 'movie',
    title: 'Interstellar',
    posterPath: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    year: '2014',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.',
    voteAverage: 8.4,
    genres: ['Adventure', 'Drama', 'Sci-Fi']
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
    genres: ['Drama', 'Fantasy', 'Adventure']
  },
  {
    id: 'tmdb-1396',
    mediaType: 'tv',
    title: 'Breaking Bad',
    posterPath: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    year: '2008',
    overview: 'A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student.',
    voteAverage: 8.9,
    genres: ['Crime', 'Drama', 'Thriller']
  },
  {
    id: 'anime-16498',
    mediaType: 'anime',
    title: 'Attack on Titan (Shingeki no Kyojin)',
    posterPath: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/hP0j8p0oR0uEaOq9rK4s9Z1F3hX.jpg',
    year: '2013',
    overview: 'Centuries ago, mankind was slaughtered by monstrous humanoid creatures called Titans. Young Eren Yeager vows to cleanse the earth of Titans.',
    voteAverage: 9.0,
    genres: ['Action', 'Fantasy', 'Suspense']
  },
  {
    id: 'anime-5114',
    mediaType: 'anime',
    title: 'Fullmetal Alchemist: Brotherhood',
    posterPath: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg',
    year: '2009',
    overview: 'Two brothers lose their bodies attempting forbidden human alchemy. They embark on a quest to locate the Philosopher Stone.',
    voteAverage: 9.1,
    genres: ['Action', 'Adventure', 'Drama', 'Fantasy']
  },
  {
    id: 'anime-21',
    mediaType: 'anime',
    title: 'One Piece',
    posterPath: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
    year: '1999',
    overview: 'Monkey D. Luffy embarks with his pirate crew across the Grand Line to find the legendary treasure One Piece and become the Pirate King.',
    voteAverage: 8.9,
    genres: ['Action', 'Adventure', 'Fantasy']
  },
  {
    id: 'tmdb-27205',
    mediaType: 'movie',
    title: 'Inception',
    posterPath: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
    backdropPath: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    year: '2010',
    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    voteAverage: 8.4,
    genres: ['Action', 'Sci-Fi', 'Adventure']
  },
  {
    id: 'tmdb-60059',
    mediaType: 'tv',
    title: 'Better Call Saul',
    posterPath: 'https://image.tmdb.org/t/p/w500/fC2HDm5t0kHapG9T1vaDsm3UxSu.jpg',
    year: '2015',
    overview: 'The trials and tribulations of criminal lawyer Jimmy McGill in the years leading up to his fateful run-in with Walter White and Jesse Pinkman.',
    voteAverage: 8.6,
    genres: ['Crime', 'Drama']
  },
  {
    id: 'anime-38000',
    mediaType: 'anime',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    posterPath: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
    year: '2019',
    overview: 'A family is attacked by demons and only two members survive: Tanjiro and his sister Nezuko, who is turning into a demon.',
    voteAverage: 8.5,
    genres: ['Action', 'Fantasy']
  }
];

export async function searchTitles(query: string, filterType: 'all' | MediaType = 'all', tmdbApiKey?: string): Promise<SearchResult[]> {
  const cleanQuery = query.trim().toLowerCase();
  
  if (!cleanQuery) {
    return POPULAR_CATALOG.filter(item => filterType === 'all' || item.mediaType === filterType);
  }

  const results: SearchResult[] = [];

  // 1. If TMDB key provided, call TMDB multi search
  if (tmdbApiKey) {
    try {
      const tmdbUrl = `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&query=${encodeURIComponent(cleanQuery)}&include_adult=false`;
      const res = await fetch(tmdbUrl);
      if (res.ok) {
        const data = await res.json();
        for (const item of (data.results || [])) {
          if (item.media_type !== 'movie' && item.media_type !== 'tv') continue;
          
          results.push({
            id: `tmdb-${item.id}`,
            mediaType: item.media_type as MediaType,
            title: item.title || item.name || 'Untitled',
            posterPath: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null,
            backdropPath: item.backdrop_path ? `${TMDB_BACKDROP_BASE}${item.backdrop_path}` : null,
            year: (item.release_date || item.first_air_date || '').substring(0, 4) || 'N/A',
            overview: item.overview || '',
            voteAverage: item.vote_average ? Math.round(item.vote_average * 10) / 10 : undefined,
          });
        }
      }
    } catch {
      // Continue to next sources
    }
  }

  // 2. Query Jikan (free open-source Anime API, no key required!)
  if (filterType === 'all' || filterType === 'anime') {
    try {
      const animeUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(cleanQuery)}&limit=10&sfw=true`;
      const animeRes = await fetch(animeUrl);
      if (animeRes.ok) {
        const animeData = await animeRes.json();
        for (const anime of (animeData.data || [])) {
          results.push({
            id: `anime-${anime.mal_id}`,
            mediaType: 'anime',
            title: anime.title_english || anime.title || 'Untitled Anime',
            posterPath: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || null,
            backdropPath: anime.images?.jpg?.large_image_url || null,
            year: anime.year ? String(anime.year) : (anime.aired?.from ? anime.aired.from.substring(0, 4) : 'N/A'),
            overview: anime.synopsis || '',
            voteAverage: anime.score ? Math.round(anime.score * 10) / 10 : undefined,
            genres: anime.genres?.map((g: { name: string }) => g.name) || []
          });
        }
      }
    } catch {
      // Continue
    }
  }

  // 3. Fallback matching against preloaded catalog if no results returned or network offline
  const localMatches = POPULAR_CATALOG.filter(item => {
    const matchesFilter = filterType === 'all' || item.mediaType === filterType;
    const matchesQuery = item.title.toLowerCase().includes(cleanQuery) || item.overview.toLowerCase().includes(cleanQuery);
    return matchesFilter && matchesQuery;
  });

  for (const item of localMatches) {
    if (!results.some(r => r.id === item.id)) {
      results.push(item);
    }
  }

  return results.filter(item => filterType === 'all' || item.mediaType === filterType);
}

export function getFeatured(): SearchResult[] {
  return POPULAR_CATALOG;
}
