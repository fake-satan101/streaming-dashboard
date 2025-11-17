// types/movie.ts

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  video: boolean;
  original_language: string;
  original_title: string;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  homepage: string;
  imdb_id: string;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  original_language: string;
  original_name: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
}

export interface TVShowDetails extends TVShow {
  genres: Genre[];
  created_by: Creator[];
  episode_run_time: number[];
  networks: Network[];
  production_companies: ProductionCompany[];
  seasons: Season[];
  status: string;
  type: string;
  last_air_date: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Creator {
  id: number;
  name: string;
  credit_id: string;
  gender: number;
  profile_path: string | null;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  air_date: string;
  episode_count: number;
}

export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// Union type for content that can be either Movie or TVShow
export type ContentItem = Movie | TVShow;

// Type guard to check if content is a TVShow
export function isTVShow(item: ContentItem): item is TVShow {
  return 'name' in item && 'first_air_date' in item;
}

// Type guard to check if content is a Movie
export function isMovie(item: ContentItem): item is Movie {
  return 'title' in item && 'release_date' in item;
}

// Helper function to get the title/name of any content item
export function getContentTitle(item: ContentItem): string {
  return isTVShow(item) ? item.name : item.title;
}

// Helper function to get the release/air date of any content item
export function getContentDate(item: ContentItem): string {
  return isTVShow(item) ? item.first_air_date : item.release_date;
}

// Helper function to get the appropriate link for any content item
export function getContentLink(item: ContentItem): string {
  return isTVShow(item) ? `/tv/${item.id}` : `/movies/${item.id}`;
}