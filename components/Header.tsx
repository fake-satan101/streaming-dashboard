'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Auto-focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search when clicking outside (optional)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSearchOpen && searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        handleCloseSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-red-600 hover:text-red-500 transition">
          STREAMFLIX
        </Link>
        
        <div className="flex space-x-6">
          <Link 
            href="/" 
            className={`transition ${
              isActive('/') ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/tv" 
            className={`transition ${
              isActive('/tv') ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            TV Shows
          </Link>
          <Link 
            href="/movies" 
            className={`transition ${
              isActive('/movies') ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            Movies
          </Link>
          <Link 
            href="/mylist" 
            className={`transition ${
              isActive('/mylist') ? 'text-white font-semibold' : 'text-gray-300 hover:text-white'
            }`}
          >
            My List
          </Link>
        </div>

        {/* Search and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Search - Toggle between icon and input */}
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search movies and TV shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 w-64 transition-all duration-300"
                autoFocus
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                Search
              </button>
              <button
                type="button"
                onClick={handleCloseSearch}
                className="text-gray-400 hover:text-white transition p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>
          ) : (
            <button 
              onClick={handleSearchClick}
              className="text-gray-300 hover:text-white transition p-2"
              aria-label="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
          
          {/* User Menu */}
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center cursor-pointer">
            <span className="text-white text-sm">U</span>
          </div>
        </div>
      </nav>
    </header>
  );
}