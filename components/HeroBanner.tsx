'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import MovieImage from './MovieImage';

interface HeroBannerProps {
  movies: Movie[];
}

export default function HeroBanner({ movies }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // The minimum distance required for a swipe to be registered
  const minSwipeDistance = 50;

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-rotate movies every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || movies.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);

  const nextMovie = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevMovie = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Touch event handlers for swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false); // Pause auto-play during swipe
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !isMobile) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextMovie();
    } else if (isRightSwipe) {
      prevMovie();
    }

    // Resume auto-play after swipe
    setTimeout(() => setIsAutoPlaying(true), 5000);
    
    // Reset touch positions
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Click/tap handlers for progress indicators on mobile
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (!movies || movies.length === 0) {
    return (
      <div className="relative h-[50vh] md:h-[70vh] w-full bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">No movies available</p>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <div 
      ref={containerRef}
      className="relative h-[50vh] md:h-[70vh] w-full overflow-hidden touch-pan-y"
      onMouseEnter={() => !isMobile && setIsAutoPlaying(false)}
      onMouseLeave={() => !isMobile && setIsAutoPlaying(true)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <MovieImage
          src={currentMovie.backdrop_path}
          alt={currentMovie.title}
          fill
          priority={currentIndex === 0}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        {/* Stronger overlay for mobile for better text readability */}
        <div className="absolute inset-0 bg-black/30 md:bg-transparent" />
      </div>

      {/* Navigation Arrows - Hidden on mobile, visible on hover for desktop */}
      {movies.length > 1 && !isMobile && (
        <>
          <button
            onClick={prevMovie}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 md:p-4 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
            aria-label="Previous movie"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextMovie}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 md:p-4 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
            aria-label="Next movie"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Mobile Swipe Indicators - Now clickable */}
      {movies.length > 1 && isMobile && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Swipe Instruction for Mobile (only shows briefly on first visit) */}
      {isMobile && movies.length > 1 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-black/50 rounded-full px-4 py-2">
            <p className="text-white text-xs opacity-70">Swipe to navigate</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-8 md:bottom-20 left-4 md:left-10 right-4 md:right-auto max-w-2xl z-10">
        <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4 text-white drop-shadow-2xl line-clamp-2 md:line-clamp-none">
          {currentMovie.title}
        </h1>
        <p className="text-sm md:text-lg mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 text-white drop-shadow-lg">
          {currentMovie.overview}
        </p>
        <div className="flex space-x-2 md:space-x-4">
          <Link
            href={`/movies/${currentMovie.id}`}
            className="bg-red-600 hover:bg-red-700 text-white px-4 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition flex items-center gap-1 md:gap-2 text-sm md:text-base flex-1 md:flex-none justify-center"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Play
          </Link>
          <Link
            href={`/movies/${currentMovie.id}`}
            className="bg-gray-600/80 hover:bg-gray-500/80 text-white px-4 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition flex items-center gap-1 md:gap-2 text-sm md:text-base flex-1 md:flex-none justify-center"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            More Info
          </Link>
        </div>
      </div>

      {/* Progress Indicators - Desktop */}
      {movies.length > 1 && !isMobile && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to movie ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}