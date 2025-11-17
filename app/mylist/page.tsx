'use client';

import { useWishlist } from '@/context/WishlistContext';
import { getContentTitle, getContentLink, isTVShow } from '@/types/movie';
import Link from 'next/link';
import MovieImage from '@/components/MovieImage';

export default function MyListPage() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-2">My List</h1>
        <p className="text-gray-400 mb-8">
          {wishlist.length === 0 
            ? "Your list is empty. Start adding movies and TV shows to watch later!"
            : `You have ${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} in your list`
          }
        </p>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🎬</div>
              <h2 className="text-2xl font-bold text-white mb-4">Your List is Empty</h2>
              <p className="text-gray-400 mb-6">
                Start adding movies and TV shows to watch later!
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
                    href="/tv"
                    className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition"
                  >
                    Browse TV Shows
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {wishlist.map((item) => {
              const title = getContentTitle(item);
              const href = getContentLink(item);
              const isTV = isTVShow(item);

              return (
                <div key={item.id} className="group relative">
                  <Link href={href} className="block">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                      <MovieImage
                        src={item.poster_path}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                        <h3 className="font-semibold text-sm line-clamp-2">{title}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center">
                            <span className="text-yellow-400 text-xs">⭐</span>
                            <span className="text-xs ml-1">{item.vote_average.toFixed(1)}</span>
                          </div>
                          {isTV && (
                            <span className="text-xs bg-blue-600 px-1 rounded">TV</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(item.id);
                    }}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from list"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}