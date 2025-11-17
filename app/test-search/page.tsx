import { searchMovies, searchTVShows } from '@/lib/tmdb';

export default async function TestSearch() {
  const testQuery = 'good';
  
  try {
    const [movies, tvShows] = await Promise.all([
      searchMovies(testQuery),
      searchTVShows(testQuery)
    ]);

    return (
      <div className="min-h-screen bg-black text-white pt-20 p-8">
        <h1 className="text-2xl font-bold mb-4">Search Test</h1>
        <p>Query: "{testQuery}"</p>
        <p>Movies found: {movies.length}</p>
        <p>TV Shows found: {tvShows.length}</p>
        <div className="mt-4">
            <h2 className="text-xl font-bold">Movies:</h2>
            {movies.map(movie => (
                <div key={movie.id} className="border p-2 my-2">
                    <p>{movie.title} (ID: {movie.id})</p>
                </div>
            ))}
          <h2 className="text-xl font-bold">TV Shows:</h2>
          {tvShows.map(show => (
            <div key={show.id} className="border p-2 my-2">
              <p>{show.name} (ID: {show.id})</p>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-500">Search Error</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }
}