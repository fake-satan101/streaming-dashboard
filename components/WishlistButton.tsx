'use client';

import { useWishlist } from '@/context/WishlistContext';
import { ContentItem } from '@/types/movie';
import { useState } from 'react';

interface WishlistButtonProps {
  item: ContentItem;
}

export default function WishlistButton({ item }: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(isInWishlist(item.id));

  const handleWishlistClick = () => {
    if (isAdded) {
      removeFromWishlist(item.id);
      setIsAdded(false);
    } else {
      addToWishlist(item);
      setIsAdded(true);
    }
  };

  return (
    <button
      onClick={handleWishlistClick}
      className={`px-8 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
        isAdded
          ? 'bg-green-600 hover:bg-gray-700 text-white'
          : 'bg-gray-600 hover:bg-gray-700 text-white'
      }`}
    >
      {isAdded ? (
        <>
          <span>✓</span>
          Added to List
        </>
      ) : (
        <>
          <span>+</span>
          Add to List
        </>
      )}
    </button>
  );
}