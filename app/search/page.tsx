import { Metadata } from 'next';
import { searchMovies, searchTVShows, isTMDBConfigured } from '@/lib/tmdb';
import MovieRow from '@/components/MovieRow';

interface SearchPageProps {
  searchParams: {
    q: string;
  };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q;
  
  if (!query) {
    return {
      title: 'Search - StreamFlix',
      description: 'Search for movies and TV shows on StreamFlix',
      openGraph: {
        title: 'Search - StreamFlix',
        description: 'Search for movies and TV shows on StreamFlix',
      },
    };
  }

  return {
    title: `Search: "${query}" - StreamFlix`,
    description: `Search results for "${query}" on StreamFlix`,
    openGraph: {
      title: `Search: "${query}" - StreamFlix`,
      description: `Search results for "${query}" on StreamFlix`,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q;
  
  console.log('🔧 TMDB Configured:', isTMDBConfigured());
  console.log('🔧 API Key exists:', !!process.env.TMDB_API_KEY);
  console.log('🔍 Search query:', query);

  if (!query) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">🔍</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Search StreamFlix
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Find your favorite movies and TV shows by title, genre, or description
            </p>
            
            {/* Search Tips */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-white font-semibold mb-3">Search Tips:</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Search by movie or TV show title</li>
                <li>• Try actor or director names</li>
                <li>• Use keywords from plot descriptions</li>
                <li>• Search for specific genres</li>
              </ul>
            </div>

            {/* Quick Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <a 
                href="/movies" 
                className="bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-lg transition text-center"
              >
                <div className="text-2xl mb-2">🎬</div>
                <div className="text-sm">Movies</div>
              </a>
              <a 
                href="/tv" 
                className="bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-lg transition text-center"
              >
                <div className="text-2xl mb-2">📺</div>
                <div className="text-sm">TV Shows</div>
              </a>
              <a 
                href="/movies?genre=28" 
                className="bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-lg transition text-center"
              >
                <div className="text-2xl mb-2">💥</div>
                <div className="text-sm">Action</div>
              </a>
              <a 
                href="/tv?genre=35" 
                className="bg-gray-800 hover:bg-gray-700 text-white p-4 rounded-lg transition text-center"
              >
                <div className="text-2xl mb-2">😂</div>
                <div className="text-sm">Comedy</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Search for both movies and TV shows
  const [movieResults, tvResults] = await Promise.all([
    searchMovies(query),
    searchTVShows(query)
  ]);

  console.log('🎬 Movie results:', movieResults.length);
  console.log('📺 TV results:', tvResults.length);

  const isConfigured = isTMDBConfigured();
  const totalResults = movieResults.length + tvResults.length;
  const hasResults = totalResults > 0;

  console.log('⚙️ TMDB Configured:', isConfigured);
  console.log('📊 Total results:', totalResults);

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Search Results for "{query}"
              </h1>
              <p className="text-gray-400">
                Found {totalResults} result{totalResults !== 1 ? 's' : ''}
                {totalResults > 0 && (
                  <span className="text-gray-500">
                    {' '}({movieResults.length} movies, {tvResults.length} TV shows)
                  </span>
                )}
              </p>
            </div>
            
            {/* Search Again */}
            <a 
              href="/search" 
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition text-sm md:text-base inline-flex items-center gap-2 w-fit"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              New Search
            </a>
          </div>

          {!isConfigured && (
            <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm inline-block">
              ⚠️ Using demo data - Configure TMDB API for real search results
            </div>
          )}
        </div>

        {/* Results */}
        {hasResults ? (
          <div className="space-y-12">
            {movieResults.length > 0 && (
              <div>
                <MovieRow 
                  movies={movieResults} 
                  categoryTitle={`🎬 Movies (${movieResults.length})`} 
                />
                {movieResults.length >= 20 && (
                  <p className="text-gray-500 text-sm mt-2 px-4">
                    Showing top {movieResults.length} movies. Try refining your search for more specific results.
                  </p>
                )}
              </div>
            )}
            
            {tvResults.length > 0 && (
              <div>
                <MovieRow 
                  movies={tvResults} 
                  categoryTitle={`📺 TV Shows (${tvResults.length})`} 
                />
                {tvResults.length >= 20 && (
                  <p className="text-gray-500 text-sm mt-2 px-4">
                    Showing top {tvResults.length} TV shows. Try refining your search for more specific results.
                  </p>
                )}
              </div>
            )}

            {/* Related Searches */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-4">Try Related Searches:</h3>
              <div className="flex flex-wrap gap-2">
                {['action', 'comedy', 'drama', 'thriller', 'sci-fi', 'romance', 'horror'].map((genre) => (
                  <a
                    key={genre}
                    href={`/search?q=${genre}`}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full text-sm transition"
                  >
                    {genre}
                  </a>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-white mb-4">No Results Found</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {isConfigured 
                ? "We couldn't find any matches for your search. Try different keywords or browse our categories."
                : "No demo data matches your search. Configure TMDB API for real search results."
              }
            </p>
            
            {/* Search Suggestions */}
            <div className="max-w-md mx-auto mb-8">
              <h3 className="text-white font-semibold mb-3">Try searching for:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Avengers', 'Stranger Things', 'Comedy', 'Action', 'Drama', '2023', 'Netflix'].map((suggestion) => (
                  <a
                    key={suggestion}
                    href={`/search?q=${suggestion}`}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full text-sm transition"
                  >
                    {suggestion}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-center">
              <a 
                href="/movies" 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center"
              >
                Browse Movies
              </a>
              <a 
                href="/tv" 
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center"
              >
                Browse TV Shows
              </a>
              <a 
                href="/" 
                className="border border-gray-600 hover:border-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition text-center"
              >
                Back to Home
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}