import { fetchTVShowDetails, isTMDBConfigured } from '@/lib/tmdb';
import { notFound } from 'next/navigation';
import MovieImage from '@/components/MovieImage';
import Link from 'next/link';
import WishlistButton from '@/components/WishlistButton';
interface TVPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TVPage({ params }: TVPageProps) {
  // ✅ AWAIT the params in Next.js 14+
  const resolvedParams = await params;
  
  if (!resolvedParams?.id || typeof resolvedParams.id !== 'string') {
    notFound();
  }

  const tvId = resolvedParams.id;
  console.log(`📺 Loading TV page for ID: ${tvId}`);

  try {
    const tvShow = await fetchTVShowDetails(tvId);

    if (!tvShow) {
      notFound();
    }

    const firstAirYear = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : 'Unknown';
    const lastAirYear = tvShow.last_air_date ? new Date(tvShow.last_air_date).getFullYear() : 'Present';

    return (
      <div className="min-h-screen bg-black text-white">
        {tvShow.id < 100 && (
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
            src={tvShow.backdrop_path}
            alt={tvShow.name}
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
                  src={tvShow.poster_path}
                  alt={tvShow.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Details */}
            <div className="flex-grow space-y-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-2">{tvShow.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {firstAirYear} - {lastAirYear}
                  </span>
                  <span className="bg-gray-600 px-3 py-1 rounded-full text-sm">
                    {tvShow.number_of_seasons} Season{tvShow.number_of_seasons !== 1 ? 's' : ''}
                  </span>
                  <span className="bg-yellow-600 px-3 py-1 rounded-full text-sm flex items-center">
                    ⭐ {tvShow.vote_average?.toFixed(1) || 'N/A'}
                  </span>
                  <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
                    {tvShow.status}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Overview</h2>
                <p className="text-lg leading-relaxed text-gray-300 max-w-3xl">
                  {tvShow.overview || "No overview available."}
                </p>
              </div>

              {tvShow.genres && tvShow.genres.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {tvShow.genres.map((genre) => (
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

              {tvShow.seasons && tvShow.seasons.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Seasons</h3>
                  <div className="flex flex-wrap gap-2">
                    {tvShow.seasons.map((season) => (
                      <span
                        key={season.id}
                        className="bg-blue-600 px-3 py-1 rounded-full text-sm"
                      >
                        {season.name} ({season.episode_count} eps)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2">
                  <span>▶</span>
                  Watch Now
                </button>
                <WishlistButton item={tvShow} />
                <Link
                  href="/tv"
                  className="border border-gray-600 hover:border-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  ← Back to TV Shows
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(`❌ Error loading TV show ${tvId}:`, error);
    notFound();
  }
}