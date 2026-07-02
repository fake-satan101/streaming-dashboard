// lib/tmdb.ts
import { 
  Movie, 
  TVShow, 
  MovieDetails, 
  TVShowDetails, 
  ApiResponse 
} from '@/types/movie';

// Constants
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Genre IDs for reference
export const GENRES = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCIENCE_FICTION: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37,
};

export const TV_GENRES = {
  ACTION_ADVENTURE: 10759,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  KIDS: 10762,
  MYSTERY: 9648,
  NEWS: 10763,
  REALITY: 10764,
  SCI_FI_FANTASY: 10765,
  SOAP: 10766,
  TALK: 10767,
  WAR_POLITICS: 10768,
  WESTERN: 37,
};

// Config
class TMDBConfig {
  private static instance: TMDBConfig;
  private apiKey: string = '';
  private hasCheckedEnv = false;

  private constructor() {}

  static getInstance(): TMDBConfig {
    if (!TMDBConfig.instance) {
      TMDBConfig.instance = new TMDBConfig();
    }
    return TMDBConfig.instance;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  getApiKey(): string {
    if (!this.apiKey && !this.hasCheckedEnv) {
      this.hasCheckedEnv = true;
      this.apiKey = process.env.TMDB_API_KEY || '';
      
      if (!this.apiKey) {
        console.error('❌ TMDB_API_KEY is not configured!');
        console.error('💡 Please add TMDB_API_KEY to your environment variables');
      } else {
        console.log('✅ TMDB API key loaded successfully');
      }
    }
    return this.apiKey;
  }

  hasValidApiKey(): boolean {
    const key = this.getApiKey();
    return !!(key && key.length > 10 && key !== 'c8c31fb7fb86283f02126c86a38d9a2d');
  }
}

const config = TMDBConfig.getInstance();

// Utility Functions
async function fetchFromTMDB<T>(endpoint: string, options: RequestInit = {}, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const apiKey = config.getApiKey();
      
      console.log(`🌐 [fetchFromTMDB] Attempt ${i + 1}/${retries} for endpoint: ${endpoint}`);
      console.log(`🌐 [fetchFromTMDB] API Key configured: ${config.hasValidApiKey()}`);
      console.log(`🌐 [fetchFromTMDB] API Key length: ${apiKey?.length || 0}`);
      
      if (!config.hasValidApiKey()) {
        console.log('❌ [fetchFromTMDB] No valid API key - throwing error');
        throw new Error('TMDB API key is not configured or invalid');
      }

      const url = `${API_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}`;
      console.log(`🌐 [fetchFromTMDB] Fetching from: ${url.replace(apiKey, '***')}`);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        next: { revalidate: 3600 },
      });

      console.log(`🌐 [fetchFromTMDB] Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        console.log(`❌ [fetchFromTMDB] API error: ${response.status} ${response.statusText}`);
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ [fetchFromTMDB] Successfully fetched data from: ${endpoint}`);
      console.log(`📊 [fetchFromTMDB] Data results count: ${data.results?.length || 'N/A'}`);
      
      return data;
    } catch (error) {
      console.log(`🔄 [fetchFromTMDB] Retry ${i + 1}/${retries} failed for ${endpoint}:`, error);
      if (i === retries - 1) {
        console.log(`❌ [fetchFromTMDB] All retries failed for: ${endpoint}`);
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('All retries failed');
}

export function getImageUrl(
  path: string | null, 
  size: string = 'w500', 
  type: 'poster' | 'backdrop' | 'profile' | 'logo' = 'poster'
): string {
  if (!path) {
    console.log(`🖼️ [getImageUrl] No path provided, using placeholder`);
    return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMxMTExMTEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2NjY2NjYiIGZvbnQtc2l6ZT0iMTgiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==`;
  }
  
  const imageUrl = `${IMAGE_BASE_URL}/${size}${path}`;
  console.log(`🖼️ [getImageUrl] Generated URL: ${imageUrl}`);
  return imageUrl;
}

// Movie Functions
export async function fetchPopularMovies(): Promise<Movie[]> {
  console.log('🎬 [fetchPopularMovies] Starting fetch');
  try {
    const data = await fetchFromTMDB<ApiResponse<Movie>>('/movie/popular?language=en-US&page=1');
    const results = data.results.slice(0, 20);
    console.log(`✅ [fetchPopularMovies] Successfully fetched ${results.length} movies`);
    return results;
  } catch (error) {
    console.error('❌ [fetchPopularMovies] Error fetching popular movies:', error);
    const fallback = getFallbackMovies();
    console.log(`🔄 [fetchPopularMovies] Using ${fallback.length} fallback movies`);
    return fallback;
  }
}

export async function fetchNowPlayingMovies(): Promise<Movie[]> {
  console.log('🎬 [fetchNowPlayingMovies] Starting fetch');
  try {
    const data = await fetchFromTMDB<ApiResponse<Movie>>('/movie/now_playing?language=en-US&page=1');
    const results = data.results.slice(0, 20);
    console.log(`✅ [fetchNowPlayingMovies] Successfully fetched ${results.length} movies`);
    return results;
  } catch (error) {
    console.error('❌ [fetchNowPlayingMovies] Error fetching now playing movies:', error);
    const fallback = getFallbackMovies();
    console.log(`🔄 [fetchNowPlayingMovies] Using ${fallback.length} fallback movies`);
    return fallback;
  }
}

export async function fetchTopRatedMovies(): Promise<Movie[]> {
  console.log('🎬 [fetchTopRatedMovies] Starting fetch');
  try {
    const data = await fetchFromTMDB<ApiResponse<Movie>>('/movie/top_rated?language=en-US&page=1');
    const results = data.results.slice(0, 20);
    console.log(`✅ [fetchTopRatedMovies] Successfully fetched ${results.length} movies`);
    return results;
  } catch (error) {
    console.error('❌ [fetchTopRatedMovies] Error fetching top rated movies:', error);
    const fallback = getFallbackMovies();
    console.log(`🔄 [fetchTopRatedMovies] Using ${fallback.length} fallback movies`);
    return fallback;
  }
}

export async function fetchUpcomingMovies(): Promise<Movie[]> {
  console.log('🎬 [fetchUpcomingMovies] Starting fetch');
  try {
    const data = await fetchFromTMDB<ApiResponse<Movie>>('/movie/upcoming?language=en-US&page=1');
    const results = data.results.slice(0, 20);
    console.log(`✅ [fetchUpcomingMovies] Successfully fetched ${results.length} movies`);
    return results;
  } catch (error) {
    console.error('❌ [fetchUpcomingMovies] Error fetching upcoming movies:', error);
    const fallback = getFallbackMovies();
    console.log(`🔄 [fetchUpcomingMovies] Using ${fallback.length} fallback movies`);
    return fallback;
  }
}

export async function fetchMoviesByGenre(genreId: number): Promise<Movie[]> {
  console.log(`🎬 [fetchMoviesByGenre] Starting fetch for genre: ${genreId}`);
  try {
    const data = await fetchFromTMDB<ApiResponse<Movie>>(
      `/discover/movie?with_genres=${genreId}&language=en-US&page=1&sort_by=popularity.desc`
    );
    const results = data.results.slice(0, 20);
    console.log(`✅ [fetchMoviesByGenre] Successfully fetched ${results.length} movies for genre ${genreId}`);
    return results;
  } catch (error) {
    console.error(`❌ [fetchMoviesByGenre] Error fetching movies for genre ${genreId}:`, error);
    const fallback = getFallbackMovies();
    console.log(`🔄 [fetchMoviesByGenre] Using ${fallback.length} fallback movies for genre ${genreId}`);
    return fallback;
  }
}

export async function fetchMovieDetails(movieId: string): Promise<MovieDetails | null> {
  try {
    console.log(`🔍 [fetchMovieDetails] Starting fetch for ID: ${movieId}`);
    console.log(`🔍 [fetchMovieDetails] TMDB Configured: ${config.hasValidApiKey()}`);
    
    const apiKey = config.getApiKey();
    console.log(`🔍 [fetchMovieDetails] API Key present: ${!!apiKey}`);
    console.log(`🔍 [fetchMovieDetails] API Key length: ${apiKey?.length}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log(`⏰ [fetchMovieDetails] Timeout triggered for movie: ${movieId}`);
      controller.abort();
    }, 10000);
    
    const url = `${API_BASE_URL}/movie/${movieId}?language=en-US&api_key=${apiKey}`;
    console.log(`🔍 [fetchMovieDetails] Fetching from: ${url.replace(apiKey, '***')}`);
    
    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    console.log(`🔍 [fetchMovieDetails] Response status: ${response.status}`);
    
    if (!response.ok) {
      console.log(`❌ [fetchMovieDetails] API error: ${response.status} ${response.statusText}`);
      if (response.status === 404) {
        console.log(`❌ [fetchMovieDetails] Movie not found in TMDB: ${movieId}`);
      } else if (response.status === 401) {
        console.log(`🔑 [fetchMovieDetails] API key invalid for movie: ${movieId}`);
      }
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ [fetchMovieDetails] Successfully fetched: "${data.title}" (ID: ${data.id})`);
    console.log(`📊 [fetchMovieDetails] Movie data:`, {
      title: data.title,
      release_date: data.release_date,
      runtime: data.runtime,
      vote_average: data.vote_average
    });
    
    clearTimeout(timeoutId);
    return data;
  } catch (error) {
    console.error(`❌ [fetchMovieDetails] Error for ID ${movieId}:`, error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.log(`⏰ [fetchMovieDetails] Timeout for: ${movieId}`);
      } else if (error.message.includes('404')) {
        console.log(`❓ [fetchMovieDetails] Movie not found on TMDB: ${movieId}`);
      } else if (error.message.includes('401')) {
        console.log(`🔑 [fetchMovieDetails] API key invalid for movie: ${movieId}`);
      }
    }
    
    console.log(`🔄 [fetchMovieDetails] Using fallback data for movie ID: ${movieId}`);
    const fallback = getFallbackMovieDetails(movieId);
    console.log(`🔄 [fetchMovieDetails] Fallback data:`, fallback ? {
      title: fallback.title,
      id: fallback.id
    } : 'null');
    return fallback;
  }
}

// TV Show Functions
export async function fetchPopularTVShows(): Promise<TVShow[]> {
  console.log('📺 [fetchPopularTVShows] Starting fetch');
  try {
    const data = await fetchFromTMDB<ApiResponse<TVShow>>('/tv/popular?language=en-US&page=1');
    const results = data.results.slice(0, 20);
    console.log(`✅ [fetchPopularTVShows] Successfully fetched ${results.length} TV shows`);
    return results;
  } catch (error) {
    console.error('❌ [fetchPopularTVShows] Error fetching popular TV shows:', error);
    const fallback = getFallbackTVShows();
    console.log(`🔄 [fetchPopularTVShows] Using ${fallback.length} fallback TV shows`);
    return fallback;
  }
}

export async function fetchTopRatedTVShows(): Promise<TVShow[]> {
  console.log('📺 [fetchTopRatedTVShows] Starting fetch');
  try {
    const data = await fetchFromTMDB<ApiResponse<TVShow>>('/tv/top_rated?language=en-US&page=1');
    const results = data.results.slice(0, 20);
    console.log(`✅ [fetchTopRatedTVShows] Successfully fetched ${results.length} TV shows`);
    return results;
  } catch (error) {
    console.error('❌ [fetchTopRatedTVShows] Error fetching top rated TV shows:', error);
    const fallback = getFallbackTVShows();
    console.log(`🔄 [fetchTopRatedTVShows] Using ${fallback.length} fallback TV shows`);
    return fallback;
  }
}

export async function fetchOnTheAirTVShows(): Promise<TVShow[]> {
  console.log('📺 [fetchOnTheAirTVShows] Starting fetch');
  try {
    const data = await fetchFromTMDB<ApiResponse<TVShow>>('/tv/on_the_air?language=en-US&page=1');
    const results = data.results.slice(0, 20);
    console.log(`✅ [fetchOnTheAirTVShows] Successfully fetched ${results.length} TV shows`);
    return results;
  } catch (error) {
    console.error('❌ [fetchOnTheAirTVShows] Error fetching on the air TV shows:', error);
    const fallback = getFallbackTVShows();
    console.log(`🔄 [fetchOnTheAirTVShows] Using ${fallback.length} fallback TV shows`);
    return fallback;
  }
}

export async function fetchAiringTodayTVShows(): Promise<TVShow[]> {
  console.log('📺 [fetchAiringTodayTVShows] Starting fetch');
  try {
    const data = await fetchFromTMDB<ApiResponse<TVShow>>('/tv/airing_today?language=en-US&page=1');
    const results = data.results.slice(0, 20);
    console.log(`✅ [fetchAiringTodayTVShows] Successfully fetched ${results.length} TV shows`);
    return results;
  } catch (error) {
    console.error('❌ [fetchAiringTodayTVShows] Error fetching airing today TV shows:', error);
    const fallback = getFallbackTVShows();
    console.log(`🔄 [fetchAiringTodayTVShows] Using ${fallback.length} fallback TV shows`);
    return fallback;
  }
}

export async function fetchTVShowsByGenre(genreId: number): Promise<TVShow[]> {
  console.log(`📺 [fetchTVShowsByGenre] Starting fetch for genre: ${genreId}`);
  try {
    const data = await fetchFromTMDB<ApiResponse<TVShow>>(
      `/discover/tv?with_genres=${genreId}&language=en-US&page=1&sort_by=popularity.desc`
    );
    const results = data.results.slice(0, 20);
    console.log(`✅ [fetchTVShowsByGenre] Successfully fetched ${results.length} TV shows for genre ${genreId}`);
    return results;
  } catch (error) {
    console.error(`❌ [fetchTVShowsByGenre] Error fetching TV shows for genre ${genreId}:`, error);
    const fallback = getFallbackTVShows();
    console.log(`🔄 [fetchTVShowsByGenre] Using ${fallback.length} fallback TV shows for genre ${genreId}`);
    return fallback;
  }
}

export async function fetchTVShowDetails(tvId: string): Promise<TVShowDetails | null> {
  try {
    console.log(`🔍 [fetchTVShowDetails] Starting fetch for ID: ${tvId}`);
    console.log(`🔍 [fetchTVShowDetails] TMDB Configured: ${config.hasValidApiKey()}`);
    
    const apiKey = config.getApiKey();
    console.log(`🔍 [fetchTVShowDetails] API Key present: ${!!apiKey}`);
    
    const data = await fetchFromTMDB<TVShowDetails>(`/tv/${tvId}?language=en-US`);
    console.log(`✅ [fetchTVShowDetails] Successfully fetched: "${data.name}" (ID: ${data.id})`);
    console.log(`📊 [fetchTVShowDetails] TV Show data:`, {
      name: data.name,
      first_air_date: data.first_air_date,
      number_of_seasons: data.number_of_seasons,
      vote_average: data.vote_average
    });
    return data;
  } catch (error) {
    console.error(`❌ [fetchTVShowDetails] Error fetching TV show details for ID ${tvId}:`, error);
    console.log(`🔄 [fetchTVShowDetails] Using fallback data for TV ID: ${tvId}`);
    const fallback = getFallbackTVShowDetails(tvId);
    console.log(`🔄 [fetchTVShowDetails] Fallback data:`, fallback ? {
      name: fallback.name,
      id: fallback.id
    } : 'null');
    return fallback;
  }
}

export async function searchMovies(query: string, page: number = 1): Promise<Movie[]> {
  try {
    console.log(`🔍 [searchMovies] Starting search for: "${query}"`);
    
    if (!query.trim()) {
      console.log(`🔍 [searchMovies] Empty query, returning empty array`);
      return [];
    }
    
    if (!config.hasValidApiKey()) {
      console.log(`❌ [searchMovies] No valid API key configured`);
      throw new Error('No valid API key configured');
    }
    
    const data = await fetchFromTMDB<ApiResponse<Movie>>(
      `/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`
    );
    console.log(`✅ [searchMovies] Found ${data.results.length} results for: "${query}"`);
    return data.results;
  } catch (error) {
    console.error(`❌ [searchMovies] Error searching movies for "${query}":`, error);
    const lowerQuery = query.toLowerCase();
    const fallbackResults = getFallbackMovies().filter(movie => 
      movie.title.toLowerCase().includes(lowerQuery) ||
      movie.overview.toLowerCase().includes(lowerQuery)
    );
    console.log(`🎬 [searchMovies] Fallback movie search for "${query}": ${fallbackResults.length} results`);
    return fallbackResults;
  }
}

export async function searchTVShows(query: string, page: number = 1): Promise<TVShow[]> {
  try {
    console.log(`🔍 [searchTVShows] Starting search for: "${query}"`);
    
    if (!query.trim()) {
      console.log(`🔍 [searchTVShows] Empty query, returning empty array`);
      return [];
    }
    
    if (!config.hasValidApiKey()) {
      console.log(`❌ [searchTVShows] No valid API key configured`);
      throw new Error('No valid API key configured');
    }
    
    const data = await fetchFromTMDB<ApiResponse<TVShow>>(
      `/search/tv?query=${encodeURIComponent(query)}&language=en-US&page=${page}`
    );
    console.log(`✅ [searchTVShows] Found ${data.results.length} results for: "${query}"`);
    return data.results;
  } catch (error) {
    console.error(`❌ [searchTVShows] Error searching TV shows for "${query}":`, error);
    const lowerQuery = query.toLowerCase();
    const fallbackResults = getFallbackTVShows().filter(show => 
      show.name.toLowerCase().includes(lowerQuery) ||
      show.overview.toLowerCase().includes(lowerQuery)
    );
    console.log(`📺 [searchTVShows] Fallback TV search for "${query}": ${fallbackResults.length} results`);
    return fallbackResults;
  }
}

// Enhanced Fallback Data
function getFallbackMovies(): Movie[] {
  console.log('🔄 [getFallbackMovies] Generating fallback movies');
  const fallbackMovies: Movie[] = [
    // ... your existing fallback movies array
    {
      id: 1,
      title: "The Matrix",
      overview: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
      release_date: "1999-03-30",
      vote_average: 8.7,
      vote_count: 24567,
      genre_ids: [GENRES.ACTION, GENRES.SCIENCE_FICTION],
      popularity: 100,
      adult: false,
      video: false,
      original_language: "en",
      original_title: "The Matrix"
    },
    // ... include all your other fallback movies
  ];

  const result = [...fallbackMovies, ...fallbackMovies.map(movie => ({ ...movie, id: movie.id + 100 }))].slice(0, 20);
  console.log(`🔄 [getFallbackMovies] Generated ${result.length} fallback movies`);
  return result;
}

function getFallbackTVShows(): TVShow[] {
  console.log('🔄 [getFallbackTVShows] Generating fallback TV shows');
  const fallbackTVShows: TVShow[] = [
    // ... your existing fallback TV shows array
    {
      id: 1,
      name: "Stranger Things",
      overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
      poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
      backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
      first_air_date: "2016-07-15",
      vote_average: 8.6,
      vote_count: 12345,
      genre_ids: [TV_GENRES.SCI_FI_FANTASY, TV_GENRES.DRAMA],
      popularity: 95,
      original_language: "en",
      original_name: "Stranger Things"
    },
    // ... include all your other fallback TV shows
  ];

  const result = [...fallbackTVShows, ...fallbackTVShows.map(show => ({ ...show, id: show.id + 100 }))].slice(0, 20);
  console.log(`🔄 [getFallbackTVShows] Generated ${result.length} fallback TV shows`);
  return result;
}

// Helper function to get genre name
function getGenreName(genreId: number): string {
  const genreMap: { [key: number]: string } = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
    80: 'Crime', 18: 'Drama', 10749: 'Romance', 14: 'Fantasy',
    27: 'Horror', 878: 'Science Fiction', 53: 'Thriller',
    10759: 'Action & Adventure', 10765: 'Sci-Fi & Fantasy'
  };
  return genreMap[genreId] || 'Action';
}

// FIXED Fallback Detail Functions - Creates unique content for each ID
function getFallbackMovieDetails(movieId: string): MovieDetails | null {
  console.log(`🔄 [getFallbackMovieDetails] Generating fallback for movie ID: ${movieId}`);
  const fallbackMovies = getFallbackMovies();
  
  // Create a unique index based on the movie ID to ensure variety
  const uniqueIndex = Array.from(movieId).reduce((sum, char) => sum + char.charCodeAt(0), 0) % fallbackMovies.length;
  
  const baseMovie = fallbackMovies[uniqueIndex] || fallbackMovies[0];
  
  if (!baseMovie) {
    console.log(`❌ [getFallbackMovieDetails] No base movie found for ID: ${movieId}`);
    return null;
  }

  // Create unique movie details based on the ID
  const uniqueId = parseInt(movieId) || 1;
  const year = 1990 + (uniqueId % 30);
  const runtime = 90 + (uniqueId % 60);
  const rating = 6.0 + (uniqueId % 4.0);
  
  // Create a unique title by appending the year
  const uniqueTitle = `${baseMovie.title} (${year})`;
  
  // Create a unique overview
  const uniqueOverview = `A special edition of ${baseMovie.title}. ${baseMovie.overview}`;

  const result = {
    ...baseMovie,
    id: uniqueId,
    title: uniqueTitle,
    overview: uniqueOverview,
    release_date: `${year}-${String((uniqueId % 12) + 1).padStart(2, '0')}-${String((uniqueId % 28) + 1).padStart(2, '0')}`,
    vote_average: parseFloat(rating.toFixed(1)),
    vote_count: 1000 + (uniqueId % 10000),
    runtime: runtime,
    genres: baseMovie.genre_ids.map(id => ({ id, name: getGenreName(id) })),
    production_companies: [],
    production_countries: [],
    spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }],
    status: 'Released',
    tagline: `A unique cinematic experience - ID: ${movieId}`,
    budget: 50000000 + ((uniqueId % 10) * 25000000),
    revenue: 200000000 + ((uniqueId % 20) * 50000000),
    homepage: '',
    imdb_id: `tt${1000000 + (uniqueId % 10000)}`
  };

  console.log(`✅ [getFallbackMovieDetails] Generated fallback movie: "${result.title}"`);
  return result;
}

// FIXED TV Show Fallback Function - Creates unique content for each ID
function getFallbackTVShowDetails(tvId: string): TVShowDetails | null {
  console.log(`🔄 [getFallbackTVShowDetails] Generating fallback for TV ID: ${tvId}`);
  const fallbackTVShows = getFallbackTVShows();
  
  // Create a unique index based on the TV ID to ensure variety
  const uniqueIndex = Array.from(tvId).reduce((sum, char) => sum + char.charCodeAt(0), 0) % fallbackTVShows.length;
  
  const baseShow = fallbackTVShows[uniqueIndex] || fallbackTVShows[0];
  
  if (!baseShow) {
    console.log(`❌ [getFallbackTVShowDetails] No base show found for ID: ${tvId}`);
    return null;
  }

  // Create unique TV show details based on the ID
  const uniqueId = parseInt(tvId) || 1;
  const year = 2000 + (uniqueId % 20);
  const rating = 7.0 + (uniqueId % 3.0);
  const seasons = 1 + (uniqueId % 6);

  // Create a unique name by appending the year
  const uniqueName = `${baseShow.name} (${year})`;
  
  // Create a unique overview
  const uniqueOverview = `A special edition of ${baseShow.name}. ${baseShow.overview}`;

  // Fix date calculations - ensure valid dates
  const firstAirDate = new Date(year, (uniqueId % 12), (uniqueId % 28) + 1);
  
  // Create seasons array
  const seasonsArray = Array.from({ length: seasons }, (_, i) => ({
    id: i + 1,
    name: `Season ${i + 1}`,
    overview: `The ${i + 1} season of ${uniqueName}`,
    poster_path: baseShow.poster_path,
    season_number: i + 1,
    air_date: new Date(year + i, (uniqueId % 12), (uniqueId % 28) + 1).toISOString().split('T')[0],
    episode_count: 8 + (uniqueId % 7)
  }));

  const lastAirDate = new Date(firstAirDate);
  lastAirDate.setFullYear(firstAirDate.getFullYear() + seasons - 1);

  const result = {
    ...baseShow,
    id: uniqueId,
    name: uniqueName,
    overview: uniqueOverview,
    first_air_date: firstAirDate.toISOString().split('T')[0],
    vote_average: parseFloat(rating.toFixed(1)),
    vote_count: 1000 + (uniqueId % 10000),
    genres: baseShow.genre_ids.map(id => ({ id, name: getGenreName(id) })),
    created_by: [],
    episode_run_time: [45 + (uniqueId % 15)],
    networks: [],
    production_companies: [],
    seasons: seasonsArray,
    status: seasons > 3 ? 'Ended' : 'Returning Series',
    type: 'Scripted',
    last_air_date: lastAirDate.toISOString().split('T')[0],
    number_of_seasons: seasons,
    number_of_episodes: seasonsArray.reduce((sum, season) => sum + season.episode_count, 0)
  };

  console.log(`✅ [getFallbackTVShowDetails] Generated fallback TV show: "${result.name}"`);
  return result;
}

// Export configuration check
export function isTMDBConfigured(): boolean {
  const configured = config.hasValidApiKey();
  console.log(`🔧 [isTMDBConfigured] TMDB configured: ${configured}`);
  return configured;
}
