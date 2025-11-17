export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
          <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
        </div>

        {/* Movie Results Skeleton */}
        <div className="space-y-12">
          {/* Movies Skeleton */}
          <div>
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="flex space-x-4 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-48 h-72 bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* TV Shows Skeleton */}
          <div>
            <div className="h-6 bg-gray-700 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="flex space-x-4 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-48 h-72 bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}