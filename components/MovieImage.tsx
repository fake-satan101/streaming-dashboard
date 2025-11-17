'use client';

import Image from 'next/image';
import { useState } from 'react';
import { getImageUrl } from '@/lib/tmdb';

interface MovieImageProps {
  src: string | null;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
}

export default function MovieImage({ 
  src, 
  alt, 
  fill = false, 
  priority = false, 
  className = '',
  sizes,
  width,
  height 
}: MovieImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageUrl = getImageUrl(src);
  const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMxMTExMTEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2NjY2NjYiIGZvbnQtc2l6ZT0iMTgiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative ${fill ? 'w-full h-full' : ''}`}>
      <Image
        src={hasError ? placeholder : imageUrl}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        priority={priority}
        className={`
          ${className}
          transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      )}
    </div>
  );
}