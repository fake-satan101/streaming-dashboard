import { 
  fetchPopularTVShows, 
  fetchTopRatedTVShows, 
  fetchOnTheAirTVShows, 
  fetchAiringTodayTVShows,
  fetchTVShowsByGenre,
  TV_GENRES,
  isTMDBConfigured 
} from '@/lib/tmdb';
import { TVShow } from '@/types/movie';
import MovieRow from '@/components/MovieRow';

export default async function TVShowsPage() {
  console.log('📺 TVShowsPage loading...');
  console.log('🔍 TMDB API Key Present:', !!process.env.TMDB_API_KEY);
  console.log('🔍 TMDB Configured:', isTMDBConfigured());

  const [
    popularTVShows,
    topRatedTVShows,
    onTheAirTVShows,
    airingTodayTVShows,
    dramaTVShows,
    comedyTVShows,
    actionTVShows,
    scifiTVShows,
    crimeTVShows,
    animationTVShows,
    mysteryTVShows,
    documentaryTVShows,
    realityTVShows,
    familyTVShows
  ] = await Promise.all([
    fetchPopularTVShows(),
    fetchTopRatedTVShows(),
    fetchOnTheAirTVShows(),
    fetchAiringTodayTVShows(),
    fetchTVShowsByGenre(TV_GENRES.DRAMA),
    fetchTVShowsByGenre(TV_GENRES.COMEDY),
    fetchTVShowsByGenre(TV_GENRES.ACTION_ADVENTURE),
    fetchTVShowsByGenre(TV_GENRES.SCI_FI_FANTASY),
    fetchTVShowsByGenre(TV_GENRES.CRIME),
    fetchTVShowsByGenre(TV_GENRES.ANIMATION),
    fetchTVShowsByGenre(TV_GENRES.MYSTERY),
    fetchTVShowsByGenre(TV_GENRES.DOCUMENTARY),
    fetchTVShowsByGenre(TV_GENRES.REALITY),
    fetchTVShowsByGenre(TV_GENRES.FAMILY)
  ]);

  const isConfigured = isTMDBConfigured();
  
  console.log('📊 Popular TV Shows Count:', popularTVShows.length);
  console.log('📊 Popular TV Show IDs:', popularTVShows.map(m => m.id));
  console.log('📊 First TV Show Title:', popularTVShows[0]?.name);
  console.log('📊 Using Fallback Data:', popularTVShows[0]?.id < 100);

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Debug Banner */}
      {!isConfigured && (
        <div className="bg-yellow-500 text-black text-center p-3 font-bold">
          ⚠️ USING FALLBACK DATA - Add TMDB_API_KEY to .env.local
        </div>
      )}
      {popularTVShows[0]?.id < 100 && (
        <div className="bg-blue-500 text-white text-center p-2">
          ℹ️ Showing Enhanced Fallback TV Shows
        </div>
      )}

      {/* Page Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">TV Shows</h1>
            <p className="text-gray-400">Discover amazing TV series and binge-worthy shows</p>
          </div>
          {!isConfigured && (
            <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm">
              ⚠️ Using demo data - Configure TMDB API for real TV shows
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{popularTVShows.length}</div>
            <div className="text-gray-400 text-sm">Popular</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{topRatedTVShows.length}</div>
            <div className="text-gray-400 text-sm">Top Rated</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{onTheAirTVShows.length}</div>
            <div className="text-gray-400 text-sm">On The Air</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{airingTodayTVShows.length}</div>
            <div className="text-gray-400 text-sm">Airing Today</div>
          </div>
        </div>
      </div>

      {/* TV Show Rows */}
      <div className="space-y-12 pb-12">
        {popularTVShows.length > 0 && (
          <MovieRow movies={popularTVShows} categoryTitle=" Popular TV Shows" />
        )}
        
        {topRatedTVShows.length > 0 && (
          <MovieRow movies={topRatedTVShows} categoryTitle=" Top Rated TV Shows" />
        )}
        
        {onTheAirTVShows.length > 0 && (
          <MovieRow movies={onTheAirTVShows} categoryTitle=" Currently Airing" />
        )}
        
        {airingTodayTVShows.length > 0 && (
          <MovieRow movies={airingTodayTVShows} categoryTitle=" Airing Today" />
        )}
        
        {dramaTVShows.length > 0 && (
          <MovieRow movies={dramaTVShows} categoryTitle=" Drama Series" />
        )}
        
        {comedyTVShows.length > 0 && (
          <MovieRow movies={comedyTVShows} categoryTitle=" Comedy Series" />
        )}
        
        {actionTVShows.length > 0 && (
          <MovieRow movies={actionTVShows} categoryTitle=" Action & Adventure" />
        )}
        
        {scifiTVShows.length > 0 && (
          <MovieRow movies={scifiTVShows} categoryTitle=" Sci-Fi & Fantasy" />
        )}
        
        {crimeTVShows.length > 0 && (
          <MovieRow movies={crimeTVShows} categoryTitle=" Crime & Mystery" />
        )}
        
        {animationTVShows.length > 0 && (
          <MovieRow movies={animationTVShows} categoryTitle=" Animation" />
        )}
        
        {mysteryTVShows.length > 0 && (
          <MovieRow movies={mysteryTVShows} categoryTitle=" Mystery" />
        )}
        
        {documentaryTVShows.length > 0 && (
          <MovieRow movies={documentaryTVShows} categoryTitle=" Documentary" />
        )}
        
        {realityTVShows.length > 0 && (
          <MovieRow movies={realityTVShows} categoryTitle=" Reality TV" />
        )}
        
        {familyTVShows.length > 0 && (
          <MovieRow movies={familyTVShows} categoryTitle=" Family" />
        )}
      </div>

      {/* Empty State Fallback */}
      {!popularTVShows.length && !topRatedTVShows.length && (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📺</div>
            <h2 className="text-2xl font-bold text-white mb-4">No TV Shows Available</h2>
            <p className="text-gray-400 mb-6">
              {isConfigured 
                ? "Couldn't load TV shows. Please check your TMDB API configuration."
                : "Configure your TMDB API key to load real TV show data."
              }
            </p>
            <div className="space-y-4">
              <a
                href="/movies"
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Browse Movies
              </a>
              <div>
                <a
                  href="/"
                  className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  Back to Home
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}