import { fetchPopularMovies, fetchMoviesByGenre } from '@/lib/tmdb';
import HeroBanner from '@/components/HeroBanner';
import MovieRow from '@/components/MovieRow';

export default async function Home() {
  const [
    popularMovies,
    romanceMovies,
    actionMovies,
    comedyMovies,
    dramaMovies
  ] = await Promise.all([
    fetchPopularMovies(),
    fetchMoviesByGenre(10749), // Romance
    fetchMoviesByGenre(28),    // Action
    fetchMoviesByGenre(35),    // Comedy
    fetchMoviesByGenre(18)     // Drama
  ]);

  // Use the first 5-6 popular movies for the hero banner rotation
  const heroMovies = popularMovies.slice(0, 6);

  return (
    <div className="min-h-screen bg-black">
      {/* Auto-shuffling Hero Banner with multiple movies */}
      <HeroBanner movies={heroMovies} />
      
      {/* Movie rows with proper spacing - REMOVED negative margin */}
      <div className="space-y-6 md:space-y-8 py-6 md:py-8 relative z-10">
        <MovieRow movies={popularMovies} categoryTitle=" Popular Now" />
        <MovieRow movies={romanceMovies} categoryTitle=" Romance" />
        <MovieRow movies={actionMovies} categoryTitle=" Action" />
        <MovieRow movies={comedyMovies} categoryTitle=" Comedy" />
        <MovieRow movies={dramaMovies} categoryTitle=" Drama" />
      </div>
    </div>
  );
}