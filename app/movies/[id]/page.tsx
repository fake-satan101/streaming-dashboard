import { fetchMovieDetails, isTMDBConfigured } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import MovieImage from '@/components/MovieImage';
import Link from 'next/link';
import WishlistButton from '@/components/WishlistButton';

interface MoviePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Add explicit type for the component
const MoviePage: React.FC<MoviePageProps> = async ({ params }) => {
  const resolvedParams = await params;
  const movieId = resolvedParams.id;

  console.log(`🎬 Loading movie page for ID: ${movieId}`);

  try {
    const movie = await fetchMovieDetails(movieId);

    if (!movie) {
      console.log(`❌ Movie not found for ID: ${movieId}`);
      notFound();
    }

    console.log(`✅ Successfully loaded: "${movie.title}" (ID: ${movie.id})`);

    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown';
    const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'Unknown';

    return (
      <div className="min-h-screen bg-black text-white">
        {/* Debug banners */}
        {movie.id < 100 && (
          <div className="bg-blue-500 text-white text-center p-2 text-sm">
            ℹ️ Showing Fallback Data
          </div>
        )}
        {!isTMDBConfigured() && (
          <div className="bg-yellow-500 text-black text-center p-2 text-sm">
            ⚠️ TMDB API not configured
          </div>
        )}

        {/* Backdrop Image */}
        <div className="relative h-[50vh] w-full">
          <MovieImage
            src={movie.backdrop_path}
            alt={movie.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="relative w-64 h-96 rounded-lg overflow-hidden shadow-2xl">
                <MovieImage
                  src={movie.poster_path}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex-grow space-y-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-2">{movie.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {releaseYear}
                  </span>
                  <span className="bg-gray-600 px-3 py-1 rounded-full text-sm">
                    {runtime}
                  </span>
                  <span className="bg-yellow-600 px-3 py-1 rounded-full text-sm flex items-center">
                    ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
                  </span>
                  {movie.id < 100 && (
                    <span className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                      Demo Data
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Overview</h2>
                <p className="text-lg leading-relaxed text-gray-300 max-w-3xl">
                  {movie.overview || "No overview available."}
                </p>
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="bg-purple-600 px-3 py-1 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2">
                  <span>▶</span>
                  Watch Now
                </button>
                
                {/* Wishlist Button - ADDED BACK */}
                <WishlistButton item={movie} />
                
                <Link
                  href="/movies"
                  className="border border-gray-600 hover:border-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  ← Back to Movies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(`❌ Error loading movie ${movieId}:`, error);
    notFound();
  }
}

// Make sure this export is present
export default MoviePage;