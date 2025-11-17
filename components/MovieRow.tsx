'use client';
import { ContentItem, isTVShow, getContentTitle, getContentLink } from '@/types/movie';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import MovieImage from './MovieImage';

interface MovieRowProps {
  movies: ContentItem[];
  categoryTitle: string;
}

export default function MovieRow({ movies, categoryTitle }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check if mobile and handle scroll visibility
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Check initial scroll position
    checkScrollPosition();
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkScrollPosition = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = isMobile ? clientWidth * 0.75 : clientWidth * 0.8;
      const scrollTo = direction === 'left' 
        ? scrollLeft - scrollAmount
        : scrollLeft + scrollAmount;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
      
      // Update arrow visibility after scroll
      setTimeout(checkScrollPosition, 300);
    }
  };

  const handleScroll = () => {
    checkScrollPosition();
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <section className="relative group mb-8 md:mb-12">
      <div className="container mx-auto px-3 md:px-4">
        <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-white px-2 md:px-0">
          {categoryTitle}
        </h2>
        
        <div className="relative">
          {/* Left Scroll Button - Always visible on mobile when needed */}
          {(showLeftArrow || !isMobile) && (
            <button
              onClick={() => scroll('left')}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 md:p-3 rounded-r-lg transition-all duration-300 ${
                isMobile 
                  ? 'opacity-90' 
                  : 'opacity-0 group-hover:opacity-100'
              } ${isMobile ? 'scale-90' : ''}`}
              aria-label={`Scroll ${categoryTitle} left`}
            >
              <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {/* Content Row */}
          <div
            ref={rowRef}
            onScroll={handleScroll}
            className="flex space-x-3 md:space-x-4 overflow-x-auto scrollbar-hide scroll-smooth py-2 px-2 md:px-0 gradient-mask"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {movies.map((item) => {
              const title = getContentTitle(item);
              const href = getContentLink(item);
              const isTV = isTVShow(item);
              
              return (
                <Link
                  key={item.id}
                  href={href}
                  className="flex-shrink-0 transform transition-all duration-300 hover:scale-105 hover:z-10 active:scale-95"
                >
                  <div className="relative w-32 h-48 md:w-48 md:h-72 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                    <MovieImage
                      src={item.poster_path}
                      alt={title}
                      fill
                      className="object-cover hover:brightness-110 transition"
                      sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 256px"
                    />
                    
                    {/* Gradient Overlay - Always slightly visible on mobile for better text readability */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent ${
                      isMobile ? 'opacity-70' : 'opacity-0 hover:opacity-100'
                    } transition-opacity duration-300`} />
                    
                    {/* Info Card - Always visible on mobile */}
                    <div className={`absolute bottom-0 left-0 right-0 p-2 md:p-3 text-white ${
                      isMobile 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-4 opacity-0 hover:translate-y-0 hover:opacity-100'
                    } transition-all duration-300 bg-gradient-to-t from-black/80 via-black/50 to-transparent`}>
                      <h3 className="font-semibold text-xs md:text-sm line-clamp-2 leading-tight">
                        {title}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center">
                          <span className="text-yellow-400 text-xs">⭐</span>
                          <span className="text-xs ml-1">{item.vote_average.toFixed(1)}</span>
                        </div>
                        
                      </div>
                    </div>

                    {/* Play button overlay for mobile */}
                    {isMobile && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="bg-black/50 rounded-full p-2">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Right Scroll Button - Always visible on mobile when needed */}
          {(showRightArrow || !isMobile) && (
            <button
              onClick={() => scroll('right')}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-70 hover:bg-opacity-90 text-white p-2 md:p-3 rounded-l-lg transition-all duration-300 ${
                isMobile 
                  ? 'opacity-90' 
                  : 'opacity-0 group-hover:opacity-100'
              } ${isMobile ? 'scale-90' : ''}`}
              aria-label={`Scroll ${categoryTitle} right`}
            >
              <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile scroll indicator dots */}
        {isMobile && movies.length > 4 && (
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          </div>
        )}
      </div>
    </section>
  );
}