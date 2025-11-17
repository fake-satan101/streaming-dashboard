import { 
  fetchPopularMovies, 
  fetchNowPlayingMovies, 
  fetchTopRatedMovies, 
  fetchUpcomingMovies,
  fetchMoviesByGenre,
  GENRES,
  isTMDBConfigured 
} from '@/lib/tmdb';
import { Movie } from '@/types/movie';
import MovieRow from '@/components/MovieRow';

export default async function MoviesPage() {
  console.log('🎬 MoviesPage loading...');
  console.log('🔍 TMDB API Key Present:', !!process.env.TMDB_API_KEY);
  console.log('🔍 TMDB Configured:', isTMDBConfigured());

  const [
    popularMovies,
    nowPlayingMovies,
    topRatedMovies,
    upcomingMovies,
    actionMovies,
    comedyMovies,
    dramaMovies,
    thrillerMovies,
    scifiMovies,
    romanceMovies,
    horrorMovies,
    adventureMovies
  ] = await Promise.all([
    fetchPopularMovies(),
    fetchNowPlayingMovies(),
    fetchTopRatedMovies(),
    fetchUpcomingMovies(),
    fetchMoviesByGenre(GENRES.ACTION),
    fetchMoviesByGenre(GENRES.COMEDY),
    fetchMoviesByGenre(GENRES.DRAMA),
    fetchMoviesByGenre(GENRES.THRILLER),
    fetchMoviesByGenre(GENRES.SCIENCE_FICTION),
    fetchMoviesByGenre(GENRES.ROMANCE),
    fetchMoviesByGenre(GENRES.HORROR),
    fetchMoviesByGenre(GENRES.ADVENTURE)
  ]);

  const isConfigured = isTMDBConfigured();
  
  console.log('📊 Popular Movies Count:', popularMovies.length);
  console.log('📊 Popular Movie IDs:', popularMovies.map(m => m.id));
  console.log('📊 First Movie Title:', popularMovies[0]?.title);
  console.log('📊 Using Fallback Data:', popularMovies[0]?.id < 100);

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Debug Banner */}
      {!isConfigured && (
        <div className="bg-yellow-500 text-black text-center p-3 font-bold">
          ⚠️ USING FALLBACK DATA - Add TMDB_API_KEY to .env.local
        </div>
      )}
      {popularMovies[0]?.id < 100 && (
        <div className="bg-blue-500 text-white text-center p-2">
          ℹ️ Showing Enhanced Fallback Movies
        </div>
      )}

      {/* Page Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Movies</h1>
            <p className="text-gray-400">Explore our vast collection of movies</p>
          </div>
          {!isConfigured && (
            <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm">
              ⚠️ Using demo data - Configure TMDB API for real movies
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{popularMovies.length}</div>
            <div className="text-gray-400 text-sm">Popular</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{nowPlayingMovies.length}</div>
            <div className="text-gray-400 text-sm">Now Playing</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{topRatedMovies.length}</div>
            <div className="text-gray-400 text-sm">Top Rated</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{upcomingMovies.length}</div>
            <div className="text-gray-400 text-sm">Upcoming</div>
          </div>
        </div>
      </div>

      {/* Movie Rows */}
      <div className="space-y-12 pb-12">
        {popularMovies.length > 0 && (
          <MovieRow movies={popularMovies} categoryTitle=" Popular Movies" />
        )}
        
        {nowPlayingMovies.length > 0 && (
          <MovieRow movies={nowPlayingMovies} categoryTitle=" Now Playing" />
        )}
        
        {topRatedMovies.length > 0 && (
          <MovieRow movies={topRatedMovies} categoryTitle=" Top Rated" />
        )}
        
        {upcomingMovies.length > 0 && (
          <MovieRow movies={upcomingMovies} categoryTitle=" Upcoming" />
        )}
        
        {actionMovies.length > 0 && (
          <MovieRow movies={actionMovies} categoryTitle=" Action Movies" />
        )}
        
        {comedyMovies.length > 0 && (
          <MovieRow movies={comedyMovies} categoryTitle=" Comedy Movies" />
        )}
        
        {dramaMovies.length > 0 && (
          <MovieRow movies={dramaMovies} categoryTitle=" Drama Movies" />
        )}
        
        {thrillerMovies.length > 0 && (
          <MovieRow movies={thrillerMovies} categoryTitle=" Thriller Movies" />
        )}
        
        {scifiMovies.length > 0 && (
          <MovieRow movies={scifiMovies} categoryTitle=" Sci-Fi Movies" />
        )}
        
        {romanceMovies.length > 0 && (
          <MovieRow movies={romanceMovies} categoryTitle=" Romance Movies" />
        )}
        
        {horrorMovies.length > 0 && (
          <MovieRow movies={horrorMovies} categoryTitle=" Horror Movies" />
        )}
        
        {adventureMovies.length > 0 && (
          <MovieRow movies={adventureMovies} categoryTitle=" Adventure Movies" />
        )}
      </div>

      {/* Empty State Fallback */}
      {!popularMovies.length && !nowPlayingMovies.length && (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold text-white mb-4">No Movies Available</h2>
            <p className="text-gray-400 mb-6">
              {isConfigured 
                ? "Couldn't load movies. Please check your TMDB API configuration."
                : "Configure your TMDB API key to load real movie data."
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
